const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Validar que JWT_SECRET esté configurado
if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET no está configurado en las variables de entorno');
  console.error('Agrega JWT_SECRET=tu_clave_aqui a tu archivo .env');
}

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { nombres, apellidos, correo_electronico, telefono, direccion, contrasena } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombres || !apellidos || !correo_electronico || !telefono || !direccion || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validaciones de seguridad para contraseña (alineado con frontend)
    if (contrasena.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const hasLowercase = /[a-z]/.test(contrasena);
    const hasUppercase = /[A-Z]/.test(contrasena);
    const hasNumber = /\d/.test(contrasena);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(contrasena);
    const passedRules = [hasLowercase, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
    if (passedRules < 3) {
      return res.status(400).json({ 
        error: 'La contraseña es muy débil. Debe cumplir al menos 3 de estos: minúscula, mayúscula, número, carácter especial.'
      });
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
      return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(correo_electronico);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Encriptar contraseña con salt rounds más altos para mayor seguridad
    const saltRounds = 12; // Aumentado de 10 a 12 para mayor seguridad
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Crear usuario
    const userId = await User.create({
      nombres,
      apellidos,
      correo_electronico,
      telefono,
      direccion,
      contrasena: hashedPassword
    });

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      userId 
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { correo_electronico, contrasena } = req.body;

    // Validar campos
    if (!correo_electronico || !contrasena) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = await User.findByEmailDecrypted(correo_electronico);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña (manejar tanto hasheadas como no hasheadas)
    let isValidPassword = false;
    
    // Primero intentar con bcrypt (para usuarios nuevos)
    if (user.contraseña && user.contraseña.length > 20) { // Las contraseñas hasheadas son largas
      isValidPassword = await bcrypt.compare(contrasena, user.contraseña);
    } else {
      // Para usuarios existentes con contraseñas no hasheadas
      isValidPassword = (contrasena === user.contraseña);
    }

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id_propietario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo_electronico: user.correo_electronico
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar respuesta
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id_propietario,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo_electronico: user.correo_electronico
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  registerUser,
  loginUser
};