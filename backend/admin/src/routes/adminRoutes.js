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

// Rutas públicas
router.post('/login', loginAdmin);

// Rutas protegidas - requieren autenticación de admin
router.use(authenticateAdmin);

// Rutas que requieren cualquier rol de admin
router.get('/profile', getProfile);
router.put('/profile', updateAdmin);

// Rutas que requieren rol de super_admin
router.post('/create', requireSuperAdmin, createAdmin);
router.get('/all', requireSuperAdmin, getAllAdmins);
router.put('/:id', requireSuperAdmin, updateAdmin);
router.delete('/:id', requireSuperAdmin, deactivateAdmin);

module.exports = router;
