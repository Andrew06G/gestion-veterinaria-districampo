// ============================================================================
// 🔒 crypto_legacy.js
// ----------------------------------------------------------------------------
// Versión original del cifrado usada en VeteriLab y DistriCampo.
// Se mantiene para compatibilidad con contraseñas y datos cifrados antiguos.
// ============================================================================

const crypto = require("crypto");

// ⚙️ Configuración antigua del sistema
const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(String("DistriCampo_2025"))
  .digest("base64")
  .substr(0, 32);
const iv = Buffer.alloc(16, 0); // Vector de inicialización fijo

// 🔐 Cifrar texto
function encrypt(text) {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.error("❌ Error en encrypt (legacy):", error.message);
    return text;
  }
}

// 🔓 Descifrar texto
function decrypt(text) {
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    // ⚠️ Si el formato no es válido, devolvemos el texto original
    console.warn(`⚠️ decrypt (legacy) - dato no válido: "${text}"`);
    return text;
  }
}

module.exports = { encrypt, decrypt };
