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

    // Bloquear generación de PDF si el resultado no está finalizado
    if (analysis.nombre_estado && analysis.nombre_estado !== 'Finalizado') {
      return res.status(403).json({ message: 'El resultado aún no está disponible.' });
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

// Función para generar contenido del PDF (versión final con divisores sutiles)
function generatePDFContent(doc, analysis) {
  const fechaActual = new Date().toLocaleDateString('es-ES');

  // === ENCABEZADO ===
  doc.fontSize(24).fillColor('#007bff').text('DistriCampo', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(16).fillColor('#333').text('Reporte de Análisis Clínico', { align: 'center' });
  doc.fontSize(11).fillColor('#666').text(`Fecha de emisión: ${fechaActual}`, { align: 'center' });

  // Línea separadora principal
  doc.moveDown(0.8);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#007bff').lineWidth(1).stroke();

  doc.moveDown(0.8);

  // === INFORMACIÓN DEL PROPIETARIO ===
  doc.fontSize(14).fillColor('#007bff').text('Información del Propietario');
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ccc').lineWidth(0.5).stroke();

  const propietarioData = [
    ['ID Propietario:', analysis.id_propietario],
    ['Nombres:', analysis.propietario_nombres],
    ['Apellidos:', analysis.propietario_apellidos],
    ['Teléfono:', analysis.propietario_telefono],
    ['Dirección:', analysis.propietario_direccion],
    ['Email:', analysis.propietario_email]
  ];

  doc.moveDown(0.5);
  propietarioData.forEach(([label, value]) => {
    doc.fontSize(11).fillColor('#333').text(`${label} `, { continued: true })
      .fillColor('#000').text(value || 'No especificado');
  });

  // Línea divisoria
  doc.moveDown(0.8);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ddd').lineWidth(0.5).stroke();
  doc.moveDown(0.8);

  // === INFORMACIÓN DEL ANIMAL ===
  doc.fontSize(14).fillColor('#007bff').text('Información del Animal');
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ccc').lineWidth(0.5).stroke();

  const animalData = [
    ['ID Animal:', analysis.id_animal],
    ['Nombre:', analysis.nombre_animal],
    ['Especie:', analysis.nombre_especie],
    ['Raza:', analysis.nombre_raza],
    ['Edad:', analysis.edad || 'No especificada']
  ];

  doc.moveDown(0.5);
  animalData.forEach(([label, value]) => {
    doc.fontSize(11).fillColor('#333').text(`${label} `, { continued: true })
      .fillColor('#000').text(value || 'No especificado');
  });

  // Línea divisoria
  doc.moveDown(0.8);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ddd').lineWidth(0.5).stroke();
  doc.moveDown(0.8);

  // === INFORMACIÓN DEL ANÁLISIS ===
  doc.fontSize(14).fillColor('#007bff').text('Información del Análisis');
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ccc').lineWidth(0.5).stroke();

  const horaToma = analysis.hora_toma ? String(analysis.hora_toma).slice(0, 5) : '';
  const horaEmision = analysis.hora_emision ? String(analysis.hora_emision).slice(0, 5) : '';
  const precioCOP = `$${(parseFloat(analysis.precio) * 1000).toLocaleString('es-CO')} COP`;

  const analisisData = [
    ['ID Muestra:', analysis.id_muestra],
    ['Tipo de Muestra:', analysis.nombre_tipo_muestra],
    ['Análisis Solicitado:', analysis.nombre_analisis],
    ['Fecha de Toma:', `${new Date(analysis.fecha_toma).toLocaleDateString('es-ES')} ${horaToma ? '- ' + horaToma : ''}`],
    ['Fecha de Emisión:', `${new Date(analysis.fecha_emision).toLocaleDateString('es-ES')} ${horaEmision ? '- ' + horaEmision : ''}`],
    ['Estado:', analysis.nombre_estado],
    ['Precio:', precioCOP]
  ];

  doc.moveDown(0.5);
  analisisData.forEach(([label, value]) => {
    doc.fontSize(11).fillColor('#333').text(`${label} `, { continued: true })
      .fillColor('#000').text(value || 'No especificado');
  });

  // Línea divisoria
  doc.moveDown(0.8);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ddd').lineWidth(0.5).stroke();
  doc.moveDown(0.8);

  // === RESULTADO ===
  doc.fontSize(14).fillColor('#007bff').text('Resultado del Análisis');
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ccc').lineWidth(0.5).stroke();

  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#000').text(analysis.resultado || 'Pendiente', { width: 480 });

  // === OBSERVACIONES ===
  if (analysis.observaciones) {
    doc.moveDown(0.8);
    doc.fontSize(14).fillColor('#007bff').text('Observaciones del Veterinario');
    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#ccc').lineWidth(0.5).stroke();
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#000').text(analysis.observaciones, {
      width: 480,
      align: 'left'
    });
  }

  // === FOOTER ===
  doc.moveDown(1.5);
  doc.fontSize(10).fillColor('#666')
    .text('Informe generado automáticamente por DistriCampo', { align: 'center' });
}

// (Función de prueba eliminada para la versión oficial)

module.exports = {
  generatePDF
};
