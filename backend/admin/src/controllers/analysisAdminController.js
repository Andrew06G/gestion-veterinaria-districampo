const db = require('../../../src/config/db');
const { decrypt, decryptObject } = require('../../../src/utils/crypto');

// Listar todos los análisis con información completa y paginación
async function listAnalyses(req, res) {
  try {
    const { owner, animal, status, page = 1, limit = 10 } = req.query;
    
    // Calcular offset para paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let whereClause = '';
    let params = [];
    
    if (animal) {
      whereClause = 'WHERE a.id_animal = ?';
      params.push(animal);
    } else if (owner) {
      whereClause = 'WHERE a.id_propietario = ?';
      params.push(owner);
    }
    
    if (status && whereClause) {
      whereClause += ' AND r.id_estado = ?';
      params.push(status);
    } else if (status) {
      whereClause = 'WHERE r.id_estado = ?';
      params.push(status);
    }

    // Consulta para obtener el total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM resultado r
      JOIN muestra m ON r.id_muestra = m.id_muestra
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN propietario p ON a.id_propietario = p.id_propietario
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
      JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
      ${whereClause}
    `;
    
    const [countResult] = await db.query(countQuery, params);
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    // Consulta principal con paginación
    const [rows] = await db.query(`
      SELECT 
        r.id_resultado,
        r.id_muestra,
        r.id_tipo_analisis,
        r.resultado,
        r.fecha_emision,
        r.observaciones,
        r.id_estado,
        a.id_animal,
        a.nombre_animal,
        a.id_propietario,
        p.nombres as propietario_nombres,
        p.apellidos as propietario_apellidos,
        CONCAT(p.nombres, ' ', p.apellidos) as propietario_nombre,
        ta.nombre_analisis,
        tm.nombre_tipo_muestra,
        te.nombre_estado,
        m.fecha_toma
      FROM resultado r
      JOIN muestra m ON r.id_muestra = m.id_muestra
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN propietario p ON a.id_propietario = p.id_propietario
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
      JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
      ${whereClause}
      ORDER BY m.fecha_toma DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    // Descifrar nombres de animales y datos sensibles
    const analyses = rows.map(analysis => ({
      ...analysis,
      nombre_animal: decrypt(analysis.nombre_animal),
      propietario_nombre: `${decrypt(analysis.propietario_nombres)} ${decrypt(analysis.propietario_apellidos)}`
    }));
    
    res.json({ 
      success: true, 
      analyses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords,
        limit: parseInt(limit),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Obtener un análisis por ID
async function getAnalysis(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT 
        r.id_resultado,
        r.id_muestra,
        r.id_tipo_analisis,
        r.resultado,
        r.fecha_emision,
        r.observaciones,
        r.id_estado,
        a.id_animal,
        a.nombre_animal,
        a.id_propietario,
        p.nombres as propietario_nombres,
        p.apellidos as propietario_apellidos,
        CONCAT(p.nombres, ' ', p.apellidos) as propietario_nombre,
        ta.nombre_analisis,
        tm.nombre_tipo_muestra,
        te.nombre_estado,
        m.fecha_toma
      FROM resultado r
      JOIN muestra m ON r.id_muestra = m.id_muestra
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN propietario p ON a.id_propietario = p.id_propietario
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
      JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
      WHERE r.id_resultado = ?
    `, [id]);
    
    if (!rows[0]) {
      return res.status(404).json({ success: false, message: 'Análisis no encontrado' });
    }
    
    const analysis = {
      ...rows[0],
      nombre_animal: decrypt(rows[0].nombre_animal),
      propietario_nombre: `${decrypt(rows[0].propietario_nombres)} ${decrypt(rows[0].propietario_apellidos)}`
    };
    
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Actualizar un análisis
async function updateAnalysis(req, res) {
  try {
    const { id } = req.params;
    const { id_estado, fecha_emision, resultado, observaciones } = req.body;

    // Verificar que el análisis existe
    const [exists] = await db.query('SELECT r.id_resultado, m.fecha_toma FROM resultado r JOIN muestra m ON r.id_muestra = m.id_muestra WHERE r.id_resultado = ?', [id]);
    if (!exists[0]) {
      return res.status(404).json({ success: false, message: 'Análisis no encontrado' });
    }

    // Validación de fecha: emisión debe ser posterior a toma (al menos 30 minutos después)
    if (fecha_emision) {
      // Obtener fecha y hora de toma de la muestra
      const [muestraRow] = await db.query('SELECT fecha_toma, hora_toma FROM muestra m JOIN resultado r ON m.id_muestra = r.id_muestra WHERE r.id_resultado = ?', [id]);
      const fechaToma = muestraRow[0]?.fecha_toma;
      const horaToma = muestraRow[0]?.hora_toma || '00:00:00';

      const horaEmision = req.body.hora_emision || (await getAutoHoraEmisionIfNeeded(id_estado));
      
      // Crear objetos Date para comparación
      const tomaDT = new Date(`${fechaToma}T${String(horaToma).slice(0,8)}`);
      const emisionDT = new Date(`${fecha_emision}T${String(horaEmision).slice(0,8)}`);
      const tomaMas30 = new Date(tomaDT.getTime() + 30 * 60000);
      
      if (emisionDT <= tomaMas30) {
        return res.status(400).json({ 
          success: false, 
          error: `La fecha y hora de emisión no pueden ser anteriores o iguales a 30 minutos después de la hora de toma (${fechaToma} ${horaToma}). Debe ser al menos 30 minutos después.` 
        });
      }
    }

    // Actualizar el análisis
    // Determinar hora de emisión: usar la provista o la actual si se cambia a estado en proceso/finalizado/cancelado
    let horaEmisionToSave = req.body.hora_emision;
    if (!horaEmisionToSave || ['En proceso', 'Finalizado', 'Cancelado'].includes((await getEstadoNombre(id_estado)))) {
      const now = new Date();
      horaEmisionToSave = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    }

    await db.query(
      'UPDATE resultado SET id_estado = ?, fecha_emision = ?, hora_emision = ?, resultado = ?, observaciones = ? WHERE id_resultado = ?',
      [id_estado, fecha_emision, horaEmisionToSave, resultado, observaciones, id]
    );

    // Obtener el análisis actualizado
    const [rows] = await db.query(`
      SELECT 
        r.id_resultado,
        r.id_muestra,
        r.id_tipo_analisis,
        r.resultado,
        r.fecha_emision,
        r.hora_emision,
        r.observaciones,
        r.id_estado,
        a.id_animal,
        a.nombre_animal,
        a.id_propietario,
        p.nombres as propietario_nombres,
        p.apellidos as propietario_apellidos,
        CONCAT(p.nombres, ' ', p.apellidos) as propietario_nombre,
        ta.nombre_analisis,
        tm.nombre_tipo_muestra,
        te.nombre_estado,
        m.fecha_toma,
        m.hora_toma
      FROM resultado r
      JOIN muestra m ON r.id_muestra = m.id_muestra
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN propietario p ON a.id_propietario = p.id_propietario
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
      JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
      WHERE r.id_resultado = ?
    `, [id]);
    
    const analysis = {
      ...rows[0],
      nombre_animal: decrypt(rows[0].nombre_animal),
      propietario_nombre: `${decrypt(rows[0].propietario_nombres)} ${decrypt(rows[0].propietario_apellidos)}`
    };

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Obtener estados disponibles
async function getStatuses(req, res) {
  try {
    const [rows] = await db.query('SELECT id_tipo_estado, nombre_estado FROM tipo_estado ORDER BY id_tipo_estado');
    res.json({ success: true, statuses: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Eliminar un análisis
async function deleteAnalysis(req, res) {
  try {
    const { id } = req.params;
    
    // Verificar que el análisis existe
    const [exists] = await db.query('SELECT * FROM resultado WHERE id_resultado = ?', [id]);
    if (!exists[0]) {
      return res.status(404).json({ success: false, message: 'Análisis no encontrado' });
    }

    // Eliminar el análisis (cascada eliminará muestra y resultado)
    await db.query('DELETE FROM resultado WHERE id_resultado = ?', [id]);
    
    res.json({ success: true, message: 'Análisis eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

function formatDateISO(d) {
  if (!d) return '';
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function getEstadoNombre(idEstado) {
  const [rows] = await db.query('SELECT nombre_estado FROM tipo_estado WHERE id_tipo_estado = ?', [idEstado]);
  return rows[0]?.nombre_estado || '';
}

async function getAutoHoraEmisionIfNeeded(idEstado) {
  const nombre = await getEstadoNombre(idEstado);
  if (['En proceso', 'Finalizado', 'Cancelado'].includes(nombre)) {
    const now = new Date();
    return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  }
  return null;
}

module.exports = { listAnalyses, getAnalysis, updateAnalysis, deleteAnalysis, getStatuses };
