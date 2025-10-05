
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createAnalysis,
  getUserAnalyses,
  getAnalysisTypes,
  getStatuses,
  cancelAnalysis
} = require('../controllers/analysisController');
const { generatePDF } = require('../controllers/pdfController');

// Ruta para crear análisis (protegida)
router.post('/', authenticateToken, createAnalysis);

// Ruta para obtener análisis del usuario (protegida)
router.get('/', authenticateToken, getUserAnalyses);

// Ruta para obtener tipos de análisis disponibles (protegida)
router.get('/tipos', authenticateToken, getAnalysisTypes);

// Ruta para obtener estados disponibles (protegida)
router.get('/estados', authenticateToken, getStatuses);

// Ruta para generar y devolver el PDF (protegida)
router.get('/:id/pdf', authenticateToken, generatePDF);

// Cancelar análisis (protegida)
router.delete('/:id', authenticateToken, cancelAnalysis);

module.exports = router;
