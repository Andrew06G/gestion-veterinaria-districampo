const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Verificar configuración JWT
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET no configurado');
}

// Login de administrador
const loginAdmin = async (req, res) => {
  try {
    const { correo_electronico, contrasena } = req.body;

    if (!correo_electronico || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Correo electrónico y contraseña son requeridos'
      });
    }

    // Buscar admin por email
    const admin = await Admin.findByEmailDecrypted(correo_electronico);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await Admin.verifyPassword(contrasena, admin.contrasena);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último acceso
    await Admin.updateLastAccess(admin.id_admin);

    // Generar token JWT
    const token = jwt.sign(
      {
        id: admin.id_admin,
        email: admin.correo_electronico,
        rol: admin.rol,
        tipo: 'admin'
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      admin: {
        id: admin.id_admin,
        nombres: admin.nombres,
        apellidos: admin.apellidos,
        correo_electronico: admin.correo_electronico,
        rol: admin.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo administrador
const createAdmin = async (req, res) => {
  try {
    const { nombres, apellidos, correo_electronico, telefono, direccion, contrasena, rol } = req.body;

    if (!nombres || !apellidos || !correo_electronico || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Nombres, apellidos, correo electrónico y contraseña son requeridos'
      });
    }

    // Validar fortaleza de contraseña
    const passwordValidation = {
      length: contrasena.length >= 8,
      lowercase: /[a-z]/.test(contrasena),
      uppercase: /[A-Z]/.test(contrasena),
      numbers: /\d/.test(contrasena),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(contrasena)
    };

    const allRequirementsMet = Object.values(passwordValidation).every(Boolean);
    if (!allRequirementsMet) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe cumplir todos los requisitos de seguridad: mínimo 8 caracteres, al menos una minúscula, una mayúscula, un número y un carácter especial'
      });
    }

    const newAdmin = await Admin.create({
      nombres,
      apellidos,
      correo_electronico,
      telefono,
      direccion,
      contrasena,
      rol
    });

    res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      admin: {
        id: newAdmin.id_admin,
        nombres: newAdmin.nombres,
        apellidos: newAdmin.apellidos,
        correo_electronico: newAdmin.correo_electronico,
        rol: newAdmin.rol
      }
    });

  } catch (error) {
    if (error.message === 'El correo electrónico ya está registrado') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del admin autenticado
const getProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin.id_admin,
        nombres: admin.nombres,
        apellidos: admin.apellidos,
        correo_electronico: admin.correo_electronico,
        telefono: admin.telefono,
        direccion: admin.direccion,
        rol: admin.rol,
        fecha_creacion: admin.fecha_creacion,
        ultimo_acceso: admin.ultimo_acceso
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todos los administradores (solo super_admin)
const getAllAdmins = async (req, res) => {
  try {
    if (req.user.rol !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de super administrador'
      });
    }

    const admins = await Admin.findAll();

    res.json({
      success: true,
      admins: admins.map(admin => ({
        id: admin.id_admin,
        nombres: admin.nombres,
        apellidos: admin.apellidos,
        correo_electronico: admin.correo_electronico,
        telefono: admin.telefono,
        direccion: admin.direccion,
        rol: admin.rol,
        activo: admin.activo,
        fecha_creacion: admin.fecha_creacion,
        ultimo_acceso: admin.ultimo_acceso
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar administrador
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Solo super_admin puede actualizar otros admins
    if (req.user.rol !== 'super_admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado'
      });
    }

    const updatedAdmin = await Admin.update(id, updateData);

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Administrador actualizado exitosamente',
      admin: {
        id: updatedAdmin.id_admin,
        nombres: updatedAdmin.nombres,
        apellidos: updatedAdmin.apellidos,
        correo_electronico: updatedAdmin.correo_electronico,
        telefono: updatedAdmin.telefono,
        direccion: updatedAdmin.direccion,
        rol: updatedAdmin.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Desactivar administrador
const deactivateAdmin = async (req, res) => {
  try {
    if (req.user.rol !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de super administrador'
      });
    }

    const { id } = req.params;

    // No permitir desactivarse a sí mismo
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivar tu propia cuenta'
      });
    }

    await Admin.deactivate(id);

    res.json({
      success: true,
      message: 'Administrador desactivado exitosamente'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  loginAdmin,
  createAdmin,
  getProfile,
  getAllAdmins,
  updateAdmin,
  deactivateAdmin
};
