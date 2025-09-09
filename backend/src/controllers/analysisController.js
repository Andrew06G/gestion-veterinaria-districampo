const Analysis = require('../models/Analysis');

// Crear un nuevo análisis
const createAnalysis = async (req, res) => {
  try {
    console.log(' Iniciando creación de análisis...');
    const { id_animal, id_tipo_analisis, fecha_solicitud } = req.body;
    const id_propietario = req.user.id;

    console.log(' Datos recibidos:', { id_animal, id_tipo_analisis, fecha_solicitud, id_propietario });

    // Validar campos requeridos
    if (!id_animal || !id_tipo_analisis || !fecha_solicitud) {
      console.log(' Campos faltantes');
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    console.log(' Validación de campos exitosa');

    // Crear el análisis usando el modelo
    const id_muestra = await Analysis.create({
      id_animal,
      id_tipo_analisis,
      fecha_solicitud,
      id_propietario
    });

    console.log(' Análisis creado exitosamente, ID muestra:', id_muestra);

    res.status(201).json({
      message: 'Análisis creado exitosamente',
      id_muestra
    });

  } catch (error) {
    console.error(' Error al crear análisis:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener análisis del usuario autenticado
const getUserAnalyses = async (req, res) => {
  try {
    console.log(' Obteniendo análisis del usuario...');
    const id_propietario = req.user.id;
    console.log(' ID Propietario:', id_propietario);

    const analyses = await Analysis.findByOwner(id_propietario);
    console.log(' Análisis encontrados:', analyses.length);
    
    res.json(analyses);
  } catch (error) {
    console.error(' Error al obtener análisis:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener tipos de análisis disponibles
const getAnalysisTypes = async (req, res) => {
  try {
    console.log(' Obteniendo tipos de análisis...');
    const types = await Analysis.getAnalysisTypes();
    console.log(' Tipos encontrados:', types.length);
    res.json(types);
  } catch (error) {
    console.error(' Error al obtener tipos de análisis:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener análisis por ID para PDF
const getAnalysisForPDF = async (req, res) => {
  try {
    console.log('Obteniendo análisis para PDF...');
    const { id } = req.params;
    console.log('ID del análisis:', id);

    const analysis = await Analysis.getByIdForPDF(id);
    
    if (!analysis) {
      console.log(' Análisis no encontrado');
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }
    
    console.log(' Análisis encontrado para PDF');
    res.json(analysis);
  } catch (error) {
    console.error(' Error al obtener análisis para PDF:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createAnalysis,
  getUserAnalyses,
  getAnalysisTypes,
  getAnalysisForPDF
};
