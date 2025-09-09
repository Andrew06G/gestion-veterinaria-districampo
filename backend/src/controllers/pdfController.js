const Analysis = require('../models/Analysis');

// Generar PDF de análisis
const generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const id_propietario = req.user.id;

    // Obtener datos del análisis
    const analysis = await Analysis.getByIdForPDF(id);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }

    // Verificar que el análisis pertenece al usuario autenticado
    if (analysis.id_propietario !== id_propietario) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a este análisis' });
    }

    // Por ahora solo devolvemos los datos
    // En el futuro aquí se implementaría la generación real del PDF
    res.json({
      message: 'Datos del análisis para PDF',
      analysis
    });

  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  generatePDF
};
