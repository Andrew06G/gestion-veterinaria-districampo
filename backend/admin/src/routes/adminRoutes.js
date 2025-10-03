const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  createAdmin,
  getProfile,
  getAllAdmins,
  updateAdmin,
  deactivateAdmin
} = require('../controllers/adminController');
const { authenticateAdmin, requireSuperAdmin, requireAdmin } = require('../middleware/authAdmin');
const { listOwners, getOwner, updateOwner, deleteOwner } = require('../controllers/ownerAdminController');
const { listAnimals, getAnimal, updateAnimal, deleteAnimal } = require('../controllers/animalAdminController');
const { listAnalyses, getAnalysis, updateAnalysis, getStatuses } = require('../controllers/analysisAdminController');

// Rutas públicas
router.post('/login', loginAdmin);

// Rutas protegidas - requieren autenticación de admin
router.use(authenticateAdmin);

// Rutas que requieren cualquier rol de admin
router.get('/profile', getProfile);
router.put('/profile', updateAdmin);

// Gestión de propietarios (admin)
router.get('/owners', requireAdmin, listOwners);
router.get('/owners/:id', requireAdmin, getOwner);
router.put('/owners/:id', requireAdmin, updateOwner);
router.delete('/owners/:id', requireSuperAdmin, deleteOwner);

// Gestión de animales (admin)
router.get('/animals', requireAdmin, listAnimals);
router.get('/animals/:id', requireAdmin, getAnimal);
router.put('/animals/:id', requireAdmin, updateAnimal);
router.delete('/animals/:id', requireSuperAdmin, deleteAnimal);

// Gestión de análisis (admin)
router.get('/analyses', requireAdmin, listAnalyses);
router.get('/analyses/:id', requireAdmin, getAnalysis);
router.put('/analyses/:id', requireAdmin, updateAnalysis);
router.get('/statuses', requireAdmin, getStatuses);

// Rutas que requieren rol de super_admin
router.post('/create', requireSuperAdmin, createAdmin);
router.get('/all', requireSuperAdmin, getAllAdmins);
router.put('/:id', requireSuperAdmin, updateAdmin);
router.delete('/:id', requireSuperAdmin, deactivateAdmin);

module.exports = router;
