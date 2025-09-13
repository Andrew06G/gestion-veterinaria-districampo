const db = require('../config/db');
const { encrypt, decrypt, encryptObject, decryptObject } = require('../utils/crypto');

// Campos sensibles que requieren cifrado
const SENSITIVE_FIELDS = ['correo_electronico', 'telefono', 'direccion'];

class User {
  static async findByEmail(email) {
    try {
      // Cifrar el email para buscar en la base de datos
      const encryptedEmail = encrypt(email);
      
      const [rows] = await db.query(
        'SELECT * FROM propietario WHERE correo_electronico = ?',
        [encryptedEmail]
      );
      
      if (rows[0]) {
        // Descifrar los datos sensibles antes de devolver
        return decryptObject(rows[0], SENSITIVE_FIELDS);
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  static async findByEmailForLogin(email) {
    try {
      // Cifrar el email para buscar en la base de datos
      const encryptedEmail = encrypt(email);
      
      const [rows] = await db.query(
        'SELECT * FROM propietario WHERE correo_electronico = ?',
        [encryptedEmail]
      );
      
      if (rows[0]) {
        // Descifrar los datos sensibles antes de devolver
        return decryptObject(rows[0], SENSITIVE_FIELDS);
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  static async findByEmailDirect(email) {
    try {
      // Buscar directamente con el email (para datos ya cifrados)
      const [rows] = await db.query(
        'SELECT * FROM propietario WHERE correo_electronico = ?',
        [email]
      );
      
      if (rows[0]) {
        // Descifrar los datos sensibles antes de devolver
        return decryptObject(rows[0], SENSITIVE_FIELDS);
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  static async findByEmailDecrypted(email) {
    try {
      // Buscar todos los usuarios y comparar emails descifrados
      const [rows] = await db.query('SELECT * FROM propietario');
      
      for (const user of rows) {
        try {
          const decryptedEmail = decrypt(user.correo_electronico);
          if (decryptedEmail === email) {
            // Descifrar todos los datos sensibles antes de devolver
            return decryptObject(user, SENSITIVE_FIELDS);
          }
        } catch (error) {
          // Si no se puede descifrar, continuar con el siguiente
          continue;
        }
      }
      
      return null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  static async create(userData) {
    try {
      const { nombres, apellidos, correo_electronico, telefono, direccion, contrasena } = userData;
      
      // Cifrar los datos sensibles
      const encryptedData = encryptObject({
        nombres,
        apellidos,
        correo_electronico,
        telefono,
        direccion,
        contrasena
      }, SENSITIVE_FIELDS);
      
      // Primero obtener el siguiente ID disponible
      const [maxIdResult] = await db.query('SELECT MAX(id_propietario) as maxId FROM propietario');
      const nextId = (maxIdResult[0].maxId || 0) + 1;
      
      // Insertar con el ID calculado y datos cifrados
      const [result] = await db.query(
        'INSERT INTO propietario (id_propietario, nombres, apellidos, correo_electronico, telefono, direccion, contraseña) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nextId, encryptedData.nombres, encryptedData.apellidos, encryptedData.correo_electronico, encryptedData.telefono, encryptedData.direccion, encryptedData.contrasena]
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
      
      if (rows[0]) {
        // Descifrar los datos sensibles antes de devolver
        return decryptObject(rows[0], SENSITIVE_FIELDS);
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }
}

module.exports = User;
