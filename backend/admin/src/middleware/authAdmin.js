const jwt = require('jsonwebtoken');

// Verificar configuración JWT
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET no configurado');
}

// Middleware para autenticar administradores
const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: 'Error de configuración del servidor'
      });
    }

    const decoded = jwt.verify(token, jwtSecret);

    // Verificar que el token sea de un administrador
    if (decoded.tipo !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Token inválido para administradores'
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol,
      tipo: decoded.tipo
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar rol de super administrador
const requireSuperAdmin = (req, res, next) => {
  if (req.user.rol !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de super administrador'
    });
  }
  next();
};

// Middleware para verificar rol de administrador (admin o super_admin)
const requireAdmin = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};

module.exports = {
  authenticateAdmin,
  requireSuperAdmin,
  requireAdmin
};
