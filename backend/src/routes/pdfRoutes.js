
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { generatePDF } = require('../controllers/pdfController');

// Ruta para generar PDF (protegida)
router.get('/:id', authenticateToken, generatePDF);

// Ruta de prueba sin autenticación
// (Ruta de prueba eliminada en versión oficial)

module.exports = router;
