const db = require('../../../src/config/db');
const bcrypt = require('bcrypt');
const { encryptObject, decryptObject } = require('../../../src/utils/crypto');

class Admin {
  // Campos sensibles que requieren cifrado
  static SENSITIVE_FIELDS = ['correo_electronico', 'telefono', 'direccion'];

  // Buscar admin por email (para login)
  static async findByEmail(email) {
    try {
      // Cifrar el email para buscar en la base de datos
      const encryptedEmail = encryptObject({ correo_electronico: email }, ['correo_electronico']).correo_electronico;
      
      const [rows] = await db.execute(
        'SELECT * FROM admin WHERE correo_electronico = ? AND activo = 1',
        [encryptedEmail]
      );

      if (rows.length === 0) {
        return null;
      }

      // Descifrar campos sensibles
      const admin = decryptObject(rows[0], this.SENSITIVE_FIELDS);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Buscar admin por email (método alternativo para casos especiales)
  static async findByEmailDecrypted(email) {
    try {
      const [rows] = await db.execute('SELECT * FROM admin WHERE activo = 1');
      
      for (const admin of rows) {
        const decryptedAdmin = decryptObject(admin, this.SENSITIVE_FIELDS);
        if (decryptedAdmin.correo_electronico === email) {
          return decryptedAdmin;
        }
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Buscar admin por ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM admin WHERE id_admin = ? AND activo = 1',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      // Descifrar campos sensibles
      const admin = decryptObject(rows[0], this.SENSITIVE_FIELDS);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  // Crear nuevo admin
  static async create(adminData) {
    try {
      const { nombres, apellidos, correo_electronico, telefono, direccion, contrasena, rol = 'admin' } = adminData;

      // Verificar que el email no exista
      const existingAdmin = await this.findByEmailDecrypted(correo_electronico);
      if (existingAdmin) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // Cifrar contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 12);

      // Cifrar campos sensibles
      const encryptedData = encryptObject({
        correo_electronico,
        telefono: telefono || null,
        direccion: direccion || null
      }, this.SENSITIVE_FIELDS);

      const [result] = await db.execute(
        `INSERT INTO admin (nombres, apellidos, correo_electronico, telefono, direccion, contrasena, rol) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          nombres,
          apellidos,
          encryptedData.correo_electronico,
          encryptedData.telefono,
          encryptedData.direccion,
          hashedPassword,
          rol
        ]
      );

      return {
        id_admin: result.insertId,
        nombres,
        apellidos,
        correo_electronico,
        telefono,
        direccion,
        rol
      };
    } catch (error) {
      throw error;
    }
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar último acceso
  static async updateLastAccess(id) {
    try {
      await db.execute(
        'UPDATE admin SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_admin = ?',
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los admins (para gestión)
  static async findAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM admin WHERE activo = 1 ORDER BY fecha_creacion DESC');
      
      // Descifrar campos sensibles de todos los admins
      return rows.map(admin => decryptObject(admin, this.SENSITIVE_FIELDS));
    } catch (error) {
      throw error;
    }
  }

  // Actualizar admin
  static async update(id, updateData) {
    try {
      const { nombres, apellidos, telefono, direccion, rol } = updateData;
      
      // Cifrar campos sensibles si se proporcionan
      let encryptedData = {};
      if (telefono !== undefined) {
        encryptedData.telefono = telefono;
      }
      if (direccion !== undefined) {
        encryptedData.direccion = direccion;
      }
      
      if (Object.keys(encryptedData).length > 0) {
        encryptedData = encryptObject(encryptedData, this.SENSITIVE_FIELDS);
      }

      const updateFields = [];
      const updateValues = [];

      if (nombres !== undefined) {
        updateFields.push('nombres = ?');
        updateValues.push(nombres);
      }
      if (apellidos !== undefined) {
        updateFields.push('apellidos = ?');
        updateValues.push(apellidos);
      }
      if (encryptedData.telefono !== undefined) {
        updateFields.push('telefono = ?');
        updateValues.push(encryptedData.telefono);
      }
      if (encryptedData.direccion !== undefined) {
        updateFields.push('direccion = ?');
        updateValues.push(encryptedData.direccion);
      }
      if (rol !== undefined) {
        updateFields.push('rol = ?');
        updateValues.push(rol);
      }

      if (updateFields.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      updateValues.push(id);

      await db.execute(
        `UPDATE admin SET ${updateFields.join(', ')} WHERE id_admin = ?`,
        updateValues
      );

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Desactivar admin (soft delete)
  static async deactivate(id) {
    try {
      await db.execute(
        'UPDATE admin SET activo = 0 WHERE id_admin = ?',
        [id]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Admin;
