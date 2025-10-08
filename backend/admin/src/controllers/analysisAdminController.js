const db = require('../../../src/config/db');
const { decrypt, decryptObject } = require('../../../src/utils/crypto');
const Notification = require('../../../src/models/Notification');

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
    const { id_estado, fecha_emision, resultado, observaciones, tipo_resultado } = req.body;

    // Verificar que el análisis existe
    const [exists] = await db.query('SELECT r.id_resultado, m.fecha_toma FROM resultado r JOIN muestra m ON r.id_muestra = m.id_muestra WHERE r.id_resultado = ?', [id]);
    if (!exists[0]) {
      return res.status(404).json({ success: false, message: 'Análisis no encontrado' });
    }

    // Validación de fecha: emisión debe ser posterior a toma
    if (fecha_emision) {
      // Obtener fecha de toma de la muestra
      const [muestraRow] = await db.query('SELECT fecha_toma FROM muestra m JOIN resultado r ON m.id_muestra = r.id_muestra WHERE r.id_resultado = ?', [id]);
      const fechaToma = muestraRow[0]?.fecha_toma;
      
      if (fecha_emision < fechaToma) {
        return res.status(400).json({ 
          success: false, 
          error: `La fecha de emisión no puede ser anterior a la fecha de toma (${fechaToma}).` 
        });
      }
    }

    // Validación: si el estado es "Finalizado", el resultado es obligatorio
    const estadoNombre = await getEstadoNombre(id_estado);
    const resultadoTrim = (resultado || '').trim();
    if (estadoNombre === 'Finalizado') {
      // Debe existir un tipo de resultado elegido
      if (!tipo_resultado) {
        return res.status(400).json({ success: false, error: 'Seleccione un tipo de resultado.' });
      }
      // Si es categórico, resultado obligatorio
      if (tipo_resultado === 'categorico' && !resultadoTrim) {
        return res.status(400).json({ success: false, error: 'Seleccione una categoría para el resultado.' });
      }
      // Si es texto libre (acepta 'texto' o 'libre'), requiere contenido no vacío
      if ((tipo_resultado === 'texto' || tipo_resultado === 'libre') && !resultadoTrim) {
        return res.status(400).json({ success: false, error: 'Ingrese un texto para el resultado.' });
      }
    }

    // Actualizar el análisis
    // Siempre usar la hora actual del sistema
    const now = new Date();
    const horaEmisionToSave = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

    // Si el estado es "En proceso" y no hay resultado, establecer como "Pendiente"
    let resultadoFinal = resultadoTrim;
    if (id_estado === 2 && !resultadoTrim) { // Estado "En proceso" = 2
      resultadoFinal = 'Pendiente';
    }

    // Obtener el estado anterior para comparar
    const [oldStateRow] = await db.query('SELECT id_estado FROM resultado WHERE id_resultado = ?', [id]);
    const oldState = oldStateRow[0]?.id_estado;

    await db.query(
      'UPDATE resultado SET id_estado = ?, fecha_emision = ?, hora_emision = ?, resultado = ?, observaciones = ? WHERE id_resultado = ?',
      [id_estado, fecha_emision, horaEmisionToSave, resultadoFinal, observaciones, id]
    );

    // Crear notificación si el estado cambió a "En proceso" o "Finalizado"
    if (oldState !== id_estado) {
      const estadoNombre = await getEstadoNombre(id_estado);
      if (estadoNombre === 'En proceso' || estadoNombre === 'Finalizado') {
        try {
          // Obtener información del propietario, análisis y animal
          const [analysisInfo] = await db.query(`
            SELECT a.id_propietario, ta.nombre_analisis, a.nombre_animal
            FROM resultado r
            JOIN muestra m ON r.id_muestra = m.id_muestra
            JOIN animal a ON m.id_animal = a.id_animal
            JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
            WHERE r.id_resultado = ?
          `, [id]);

          if (analysisInfo[0]) {
            const { id_propietario, nombre_analisis, nombre_animal } = analysisInfo[0];
            const nombreAnimalDesencriptado = decrypt(nombre_animal);
            
            let titulo, mensaje, tipo;
            if (estadoNombre === 'En proceso') {
              titulo = 'Análisis en proceso';
              mensaje = `Tu análisis de ${nombre_analisis} para ${nombreAnimalDesencriptado} ha comenzado a procesarse.`;
              tipo = 'info';
            } else if (estadoNombre === 'Finalizado') {
              titulo = 'Análisis finalizado';
              mensaje = `Tu análisis de ${nombre_analisis} para ${nombreAnimalDesencriptado} ya tiene resultados disponibles.`;
              tipo = 'success';
            }

            await Notification.create({
              user_id: id_propietario,
              titulo,
              mensaje,
              tipo
            });
          }
        } catch (notificationError) {
          console.error('Error al crear notificación:', notificationError);
        }
      }
    }

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


module.exports = { listAnalyses, getAnalysis, updateAnalysis, deleteAnalysis, getStatuses };
