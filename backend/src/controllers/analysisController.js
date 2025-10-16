const Analysis = require('../models/Analysis');

// Crear un nuevo análisis
const createAnalysis = async (req, res) => {
  try {
    const { id_animal, id_tipo_analisis, fecha_solicitud, hora_toma } = req.body;
    const id_propietario = req.user.id;

    // Validar campos requeridos
    if (!id_animal || !id_tipo_analisis || !fecha_solicitud) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Validaciones de fecha/hora: fecha_solicitud no puede ser pasada y hora dentro de 08:00-18:00 si se envía
    const hoy = new Date();
    const fechaSel = new Date(fecha_solicitud);
    hoy.setHours(0,0,0,0);
    fechaSel.setHours(0,0,0,0);
    if (fechaSel < hoy) {
      return res.status(400).json({ message: 'La fecha de toma no puede ser anterior a hoy' });
    }
    if (hora_toma) {
      const [hh, mm] = String(hora_toma).slice(0,5).split(':').map(Number);
      if (hh < 8 || (hh > 18 || (hh === 18 && mm > 0))) {
        return res.status(400).json({ message: 'La hora de toma debe estar entre 08:00 y 18:00' });
      }
    }

    // Crear el análisis usando el modelo
    const id_muestra = await Analysis.create({
      id_animal,
      id_tipo_analisis,
      fecha_solicitud,
      hora_toma: hora_toma || null,
      id_propietario
    });

    res.status(201).json({
      message: 'Análisis creado exitosamente',
      id_muestra
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener análisis del usuario autenticado
const getUserAnalyses = async (req, res) => {
  try {
    const id_propietario = req.user.id;
    const analyses = await Analysis.findByOwner(id_propietario);
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener tipos de análisis disponibles
const getAnalysisTypes = async (req, res) => {
  try {
    const types = await Analysis.getAnalysisTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener análisis por ID para PDF
const getAnalysisForPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.getByIdForPDF(id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener estados disponibles
const getStatuses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_tipo_estado, nombre_estado FROM tipo_estado ORDER BY id_tipo_estado');
    res.json({ success: true, estados: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Obtener análisis de un animal específico
const getAnalysesByAnimal = async (req, res) => {
  try {
    const { animalId } = req.params;
    const analyses = await Analysis.findByAnimal(animalId);
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Cancelar análisis (propietario): solo si Pendiente y antes del límite (<= 1 día antes de toma)
const cancelAnalysis = async (req, res) => {
  try {
    const { id } = req.params; // id_muestra
    const ownerId = req.user.id;

    const [rows] = await Analysis._rawQuery?.(
      `SELECT r.id_resultado, te.nombre_estado, m.fecha_toma, m.hora_toma, a.id_propietario
       FROM muestra m
       JOIN resultado r ON m.id_muestra = r.id_muestra
       JOIN animal a ON m.id_animal = a.id_animal
       JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
       WHERE m.id_muestra = ?`,
      [id]
    ) || [];

    if (!rows || !rows[0]) {
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }
    const row = rows[0];
    if (row.id_propietario !== ownerId) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    if (row.nombre_estado !== 'Pendiente') {
      return res.status(400).json({ message: 'Este análisis ya no puede ser cancelado.' });
    }
    const tomaDT = new Date(`${row.fecha_toma}T${(row.hora_toma || '00:00:00')}`);
    const limite = new Date(tomaDT.getTime() - 24 * 60 * 60 * 1000);
    if (new Date() > limite) {
      return res.status(400).json({ message: 'Este análisis ya no puede ser cancelado.' });
    }

    // Cambiar estado a Cancelado
    await Analysis._rawExec?.(
      `UPDATE resultado SET id_estado = (SELECT id_tipo_estado FROM tipo_estado WHERE nombre_estado = 'Cancelado' LIMIT 1)
       WHERE id_muestra = ?`,
      [id]
    );
    return res.json({ message: 'Análisis cancelado correctamente' });
  } catch (e) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar definitivamente un análisis (solo si está Cancelado y pertenece al propietario)
const deleteAnalysisPermanent = async (req, res) => {
  try {
    const { id } = req.params; // id_muestra
    const ownerId = req.user.id;

    const [rows] = await Analysis._rawQuery?.(
      `SELECT r.id_resultado, te.nombre_estado, m.id_muestra, a.id_propietario
       FROM muestra m
       JOIN resultado r ON m.id_muestra = r.id_muestra
       JOIN animal a ON m.id_animal = a.id_animal
       JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
       WHERE m.id_muestra = ?`,
      [id]
    ) || [];

    if (!rows || !rows[0]) {
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }
    const row = rows[0];
    if (row.id_propietario !== ownerId) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    if (row.nombre_estado !== 'Cancelado') {
      return res.status(400).json({ message: 'Solo se pueden eliminar análisis con estado Cancelado.' });
    }

    // Eliminar primero dependencias (resultado) y luego la muestra
    await Analysis._rawExec?.(`DELETE FROM resultado WHERE id_muestra = ?`, [id]);
    await Analysis._rawExec?.(`DELETE FROM muestra WHERE id_muestra = ?`, [id]);

    return res.json({ message: 'Registro eliminado correctamente' });
  } catch (e) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createAnalysis,
  getUserAnalyses,
  getAnalysisTypes,
  getAnalysisForPDF,
  getStatuses,
  getAnalysesByAnimal,
  cancelAnalysis,
  deleteAnalysisPermanent
};
