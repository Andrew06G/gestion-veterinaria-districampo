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
    const [exists] = await db.query('SELECT * FROM resultado WHERE id_resultado = ?', [id]);
    if (!exists[0]) {
      return res.status(404).json({ success: false, message: 'Análisis no encontrado' });
    }

    // Actualizar el análisis
    await db.query(
      'UPDATE resultado SET id_estado = ?, fecha_emision = ?, resultado = ?, observaciones = ? WHERE id_resultado = ?',
      [id_estado, fecha_emision, resultado, observaciones, id]
    );

    // Obtener el análisis actualizado
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

module.exports = { listAnalyses, getAnalysis, updateAnalysis, deleteAnalysis, getStatuses };
