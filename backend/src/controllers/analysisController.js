const Analysis = require('../models/Analysis');

// Crear un nuevo análisis
const createAnalysis = async (req, res) => {
  try {
    const { id_animal, id_tipo_analisis, fecha_solicitud } = req.body;
    const id_propietario = req.user.id;

    // Validar campos requeridos
    if (!id_animal || !id_tipo_analisis || !fecha_solicitud) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Crear el análisis usando el modelo
    const id_muestra = await Analysis.create({
      id_animal,
      id_tipo_analisis,
      fecha_solicitud,
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

module.exports = {
  createAnalysis,
  getUserAnalyses,
  getAnalysisTypes,
  getAnalysisForPDF,
  getStatuses
};
