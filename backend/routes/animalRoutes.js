const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Registrar un animal (protegido)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { nombre_animal, edad, id_raza, id_especie } = req.body;
    const id_propietario = req.user.id; // Obtener ID del usuario autenticado

    if (!nombre_animal || !edad || !id_raza || !id_especie) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO animal (nombre_animal, edad, id_raza, id_especie, id_propietario) VALUES (?, ?, ?, ?, ?)',
      [nombre_animal, edad, id_raza, id_especie, id_propietario]
    );
    res.status(201).json({ message: 'Animal registrado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al registrar el animal:', error.message);
    res.status(500).json({ message: 'Error al registrar el animal' });
  }
});

// Obtener animales del usuario autenticado (protegido)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const id_propietario = req.user.id; // Obtener ID del usuario autenticado
    
    const [rows] = await db.query(`
      SELECT 
        a.id_animal,
        a.nombre_animal,
        a.edad,
        r.nombre_raza,
        e.nombre_especie,
        p.nombres as propietario_nombres,
        p.apellidos as propietario_apellidos
      FROM animal a
      JOIN raza r ON a.id_raza = r.id_raza
      JOIN especie e ON a.id_especie = e.id_especie
      JOIN propietario p ON a.id_propietario = p.id_propietario
      WHERE a.id_propietario = ?
    `, [id_propietario]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los animales:', error.message);
    res.status(500).json({ message: 'Error al obtener los animales' });
  }
});

// Obtener un animal específico del usuario (protegido)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const id_propietario = req.user.id; // Obtener ID del usuario autenticado
    
    const [rows] = await db.query(`
      SELECT 
        a.id_animal,
        a.nombre_animal,
        a.edad,
        r.nombre_raza,
        e.nombre_especie,
        p.nombres as propietario_nombres,
        p.apellidos as propietario_apellidos
      FROM animal a
      JOIN raza r ON a.id_raza = r.id_raza
      JOIN especie e ON a.id_especie = e.id_especie
      JOIN propietario p ON a.id_propietario = p.id_propietario
      WHERE a.id_animal = ? AND a.id_propietario = ?
    `, [id, id_propietario]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el animal:', error.message);
    res.status(500).json({ message: 'Error al obtener el animal' });
  }
});

// Actualizar un animal del usuario (protegido)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_animal, edad, id_raza, id_especie } = req.body;
    const id_propietario = req.user.id; // Obtener ID del usuario autenticado

    const [result] = await db.query(
      'UPDATE animal SET nombre_animal = ?, edad = ?, id_raza = ?, id_especie = ? WHERE id_animal = ? AND id_propietario = ?',
      [nombre_animal, edad, id_raza, id_especie, id, id_propietario]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    res.json({ message: 'Animal actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el animal:', error.message);
    res.status(500).json({ message: 'Error al actualizar el animal' });
  }
});

// Eliminar un animal del usuario (protegido)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const id_propietario = req.user.id; // Obtener ID del usuario autenticado
    
    const [result] = await db.query('DELETE FROM animal WHERE id_animal = ? AND id_propietario = ?', [id, id_propietario]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    res.json({ message: 'Animal eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el animal:', error.message);
    res.status(500).json({ message: 'Error al eliminar el animal' });
  }
});

// Obtener razas disponibles (público)
router.get('/razas/list', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM raza');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las razas:', error.message);
    res.status(500).json({ message: 'Error al obtener las razas' });
  }
});

// Obtener razas por especie específica (público)
router.get('/razas/especie/:id_especie', async (req, res) => {
  try {
    const { id_especie } = req.params;
    const [rows] = await db.query('SELECT * FROM raza WHERE id_especie = ? ORDER BY nombre_raza', [id_especie]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las razas por especie:', error.message);
    res.status(500).json({ message: 'Error al obtener las razas por especie' });
  }
});

// Obtener especies disponibles (público)
router.get('/especies/list', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM especie');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las especies:', error.message);
    res.status(500).json({ message: 'Error al obtener las especies' });
  }
});

// Obtener lista simple de animales del usuario para dropdowns (protegido)
router.get('/user/list', authenticateToken, async (req, res) => {
  try {
    const id_propietario = req.user.id; // Obtener ID del usuario autenticado
    
    const [rows] = await db.query(`
      SELECT 
        a.id_animal,
        a.nombre_animal
      FROM animal a
      WHERE a.id_propietario = ?
      ORDER BY a.nombre_animal
    `, [id_propietario]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener la lista de animales:', error.message);
    res.status(500).json({ message: 'Error al obtener la lista de animales' });
  }
});

module.exports = router;