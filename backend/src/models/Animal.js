const db = require('../config/db');

class Animal {
  static async create(animalData) {
    try {
      const { nombre_animal, edad, id_raza, id_especie, id_propietario } = animalData;
      const [result] = await db.query(
        'INSERT INTO animal (nombre_animal, edad, id_raza, id_especie, id_propietario) VALUES (?, ?, ?, ?, ?)',
        [nombre_animal, edad, id_raza, id_especie, id_propietario]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error al crear animal: ${error.message}`);
    }
  }

  static async findByOwner(ownerId) {
    try {
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
        ORDER BY a.nombre_animal
      `, [ownerId]);
      return rows;
    } catch (error) {
      throw new Error(`Error al buscar animales del propietario: ${error.message}`);
    }
  }

  static async findSimpleListByOwner(ownerId) {
    try {
      const [rows] = await db.query(`
        SELECT id_animal, nombre_animal
        FROM animal
        WHERE id_propietario = ?
        ORDER BY nombre_animal
      `, [ownerId]);
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener lista simple de animales: ${error.message}`);
    }
  }

  static async getSpecies() {
    try {
      const [rows] = await db.query('SELECT * FROM especie ORDER BY nombre_especie');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener especies: ${error.message}`);
    }
  }

  static async getRacesBySpecies(speciesId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM raza WHERE id_especie = ? ORDER BY nombre_raza',
        [speciesId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener razas por especie: ${error.message}`);
    }
  }
}

module.exports = Animal;
