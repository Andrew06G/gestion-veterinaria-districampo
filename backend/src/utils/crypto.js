const crypto = require('crypto');

// Clave de cifrado (debería estar en variables de entorno en producción)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-cbc';

/**
 * Cifra un texto usando AES-256-CBC
 * @param {string} text - Texto a cifrar
 * @returns {string} - Texto cifrado en formato base64 con IV separado por ':'
 */
function encrypt(text) {
  if (!text || text === null || text === undefined) {
    return null;
  }

  try {
    // Generar IV aleatorio
    const iv = crypto.randomBytes(16);
    
    // Crear cipher con IV explícito
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    
    // Cifrar
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Combinar IV y datos cifrados
    const result = iv.toString('base64') + ':' + encrypted;
    
    return result;
  } catch (error) {
    console.error('Error al cifrar:', error);
    throw new Error('Error en el cifrado de datos');
  }
}

/**
 * Descifra un texto usando AES-256-CBC
 * @param {string} encryptedText - Texto cifrado en formato base64
 * @returns {string} - Texto original descifrado
 */
function decrypt(encryptedText) {
  if (!encryptedText || encryptedText === null || encryptedText === undefined) {
    return null;
  }

  try {
    // Separar IV y datos cifrados
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Formato de datos cifrados inválido');
    }

    const iv = Buffer.from(parts[0], 'base64');
    const encrypted = parts[1];
    
    // Intentar con createDecipheriv primero (nuevo formato)
    try {
      const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      // Si falla, intentar con createDecipher (formato antiguo)
      const decipher = crypto.createDecipher(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'));
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
    
  } catch (error) {
    console.error('Error al descifrar:', error);
    // Si falla el descifrado, podría ser un dato no cifrado (para compatibilidad)
    return encryptedText;
  }
}

/**
 * Verifica si un texto está cifrado
 * @param {string} text - Texto a verificar
 * @returns {boolean} - true si está cifrado, false si no
 */
function isEncrypted(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  // Los datos cifrados tienen formato: iv:encrypted
  const parts = text.split(':');
  return parts.length === 2 && 
         parts[0].length > 0 && 
         parts[1].length > 0;
}

/**
 * Cifra un objeto con campos específicos
 * @param {Object} obj - Objeto a procesar
 * @param {Array} fields - Campos a cifrar
 * @returns {Object} - Objeto con campos cifrados
 */
function encryptObject(obj, fields) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = { ...obj };
  
  fields.forEach(field => {
    if (result[field] && !isEncrypted(result[field])) {
      result[field] = encrypt(result[field]);
    }
  });
  
  return result;
}

/**
 * Descifra un objeto con campos específicos
 * @param {Object} obj - Objeto a procesar
 * @param {Array} fields - Campos a descifrar
 * @returns {Object} - Objeto con campos descifrados
 */
function decryptObject(obj, fields) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = { ...obj };
  
  fields.forEach(field => {
    if (result[field] && isEncrypted(result[field])) {
      result[field] = decrypt(result[field]);
    }
  });
  
  return result;
}

module.exports = {
  encrypt,
  decrypt,
  isEncrypted,
  encryptObject,
  decryptObject
};
