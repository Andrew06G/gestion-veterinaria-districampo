
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Ruta pública para registro
router.post('/register', registerUser);

// Ruta pública para login
router.post('/login', loginUser);

module.exports = router;
