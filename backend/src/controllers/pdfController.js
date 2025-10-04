const Analysis = require('../models/Analysis');
const PDFDocument = require('pdfkit');

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

    // Crear documento PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Configurar headers para descarga (sin caché)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="analisis_${analysis.id_muestra}.pdf"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Pipe PDF al response
    doc.pipe(res);
    
    // Generar contenido completo del PDF
    generatePDFContent(doc, analysis);
    
    // Finalizar PDF
    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para generar contenido del PDF
function generatePDFContent(doc, analysis) {
  const fechaActual = new Date().toLocaleDateString('es-ES');
  
  // Header
  doc.fontSize(24)
     .fillColor('#007bff')
     .text('DistriCampo', 50, 50, { align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#333')
     .text('Reporte de Análisis Clínico', 50, 80, { align: 'center' });
  
  doc.fontSize(12)
     .fillColor('#666')
     .text(`Fecha de emisión: ${fechaActual}`, 50, 110, { align: 'center' });
  
  // Línea separadora
  doc.moveTo(50, 140)
     .lineTo(550, 140)
     .stroke('#007bff', 2);
  
  let yPosition = 170;
  
  // Información del Propietario
  doc.fontSize(16)
     .fillColor('#007bff')
     .text('Información del Propietario', 50, yPosition);
  
  yPosition += 30;
  
  const propietarioData = [
    ['ID Propietario:', analysis.id_propietario],
    ['Nombres:', analysis.propietario_nombres],
    ['Apellidos:', analysis.propietario_apellidos],
    ['Teléfono:', analysis.propietario_telefono],
    ['Dirección:', analysis.propietario_direccion],
    ['Email:', analysis.propietario_email]
  ];
  
  propietarioData.forEach(([label, value]) => {
    doc.fontSize(12)
       .fillColor('#333')
       .text(label, 70, yPosition)
       .text(value || 'No especificado', 200, yPosition);
    yPosition += 20;
  });
  
  yPosition += 20;
  
  // Información del Animal
  doc.fontSize(16)
     .fillColor('#007bff')
     .text('Información del Animal', 50, yPosition);
  
  yPosition += 30;
  
  const animalData = [
    ['ID Animal:', analysis.id_animal],
    ['Nombre:', analysis.nombre_animal],
    ['Especie:', analysis.nombre_especie],
    ['Raza:', analysis.nombre_raza],
    ['Edad:', analysis.edad || 'No especificada']
  ];
  
  animalData.forEach(([label, value]) => {
    doc.fontSize(12)
       .fillColor('#333')
       .text(label, 70, yPosition)
       .text(value || 'No especificado', 200, yPosition);
    yPosition += 20;
  });
  
  yPosition += 20;
  
  // Información del Análisis
  doc.fontSize(16)
     .fillColor('#007bff')
     .text('Información del Análisis', 50, yPosition);
  
  yPosition += 30;
  
  const analisisData = [
    ['ID Muestra:', analysis.id_muestra],
    ['Tipo de Muestra:', analysis.nombre_tipo_muestra],
    ['Análisis Solicitado:', analysis.nombre_analisis],
    ['Fecha de Toma:', new Date(analysis.fecha_toma).toLocaleDateString('es-ES')],
    ['Fecha de Emisión:', new Date(analysis.fecha_emision).toLocaleDateString('es-ES')],
    ['Estado:', analysis.nombre_estado],
    ['Precio:', `$${parseFloat(analysis.precio).toLocaleString('es-ES')}`]
  ];
  
  analisisData.forEach(([label, value]) => {
    doc.fontSize(12)
       .fillColor('#333')
       .text(label, 70, yPosition)
       .text(value || 'No especificado', 200, yPosition);
    yPosition += 20;
  });
  
  yPosition += 30;
  
  // Resultado del Análisis
  doc.fontSize(16)
     .fillColor('#007bff')
     .text('Resultado del Análisis', 50, yPosition);
  
  yPosition += 30;
  
  doc.fontSize(14)
     .fillColor('#333')
     .text(analysis.resultado || 'Pendiente', 70, yPosition);
  
  yPosition += 30;
  
  // Observaciones del veterinario
  if (analysis.observaciones) {
    doc.fontSize(16)
       .fillColor('#007bff')
       .text('Observaciones del veterinario:', 50, yPosition);
    
    yPosition += 25;
    
    doc.fontSize(12)
       .fillColor('#333')
       .text(analysis.observaciones, 70, yPosition, { 
         width: 480,
         align: 'left'
       });
    
    yPosition += 40;
  }
  
  // Footer breve
  doc.fontSize(10)
     .fillColor('#666')
     .text('Informe generado por DistriCampo', 50, yPosition, { align: 'center' });
}

// (Función de prueba eliminada para la versión oficial)

module.exports = {
  generatePDF
};
