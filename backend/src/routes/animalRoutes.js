const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createAnimal,
  getUserAnimals,
  getAnimalById,
  getSimpleAnimalList,
  getSpecies,
  getRacesBySpecies,
  updateAnimal,
  deleteAnimal
} = require('../controllers/animalController');

// Ruta para crear animal (protegida)
router.post('/register', authenticateToken, createAnimal);

// Ruta para obtener animales del usuario (protegida)
router.get('/', authenticateToken, getUserAnimals);

// Ruta para obtener un animal específico por ID (protegida)
router.get('/:id', authenticateToken, getAnimalById);

// Ruta para obtener lista simple de animales para dropdowns (protegida)
router.get('/user/list', authenticateToken, getSimpleAnimalList);

// Ruta para obtener especies disponibles (protegida)
router.get('/especies/list', authenticateToken, getSpecies);

// Ruta para obtener razas por especie (protegida)
router.get('/razas/especie/:id_especie', authenticateToken, getRacesBySpecies);

// Ruta para actualizar animal (protegida)
router.put('/:id', authenticateToken, updateAnimal);

// Ruta para eliminar animal (protegida)
router.delete('/:id', authenticateToken, deleteAnimal);

module.exports = router;