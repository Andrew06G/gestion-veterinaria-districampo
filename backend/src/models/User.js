const db = require('../config/db');

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM propietario WHERE correo_electronico = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  static async create(userData) {
    try {
      const { nombres, apellidos, correo_electronico, telefono, direccion, contrasena } = userData;
      
      // Primero obtener el siguiente ID disponible
      const [maxIdResult] = await db.query('SELECT MAX(id_propietario) as maxId FROM propietario');
      const nextId = (maxIdResult[0].maxId || 0) + 1;
      
      // Insertar con el ID calculado
      const [result] = await db.query(
        'INSERT INTO propietario (id_propietario, nombres, apellidos, correo_electronico, telefono, direccion, contraseña) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nextId, nombres, apellidos, correo_electronico, telefono, direccion, contrasena]
      );
      
      return nextId;
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id_propietario, nombres, apellidos, correo_electronico, telefono, direccion FROM propietario WHERE id_propietario = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }
}

module.exports = User;
