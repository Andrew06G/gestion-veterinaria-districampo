// ============================================================================
// 🔐 crypto.js
// ----------------------------------------------------------------------------
// Sistema híbrido de cifrado y descifrado.
// - Compatible con datos antiguos (usando crypto_legacy.js)
// - Compatible con nuevos registros (formato IV:DATA)
// - Evita errores de formato y mantiene todo funcionando
// ============================================================================

const crypto = require("crypto");
const legacy = require("./crypto_legacy"); // 🧩 compatibilidad con cifrados antiguos

// 🔑 Clave actual (puedes moverla a .env si quieres)
const algorithm = "aes-256-cbc";
const key = Buffer.from(
  process.env.CRYPTO_KEY || "12345678901234567890123456789012"
);
const ivLength = 16;

// 🔐 Cifrar texto con formato nuevo IV:DATA
function encrypt(text) {
  try {
    if (!text) return text;
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("❌ Error en encrypt():", error.message);
    return text;
  }
}

// 🔓 Descifrar texto (nuevo + legacy)
function decrypt(text) {
  try {
    if (!text || typeof text !== "string") return text;

    // 🔙 Si el texto no tiene ":", asumimos formato antiguo
    if (!text.includes(":")) {
      return legacy.decrypt(text);
    }

    // 🆕 Si tiene ":", usamos el formato moderno
    const [ivHex, encryptedData] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.warn(`⚠️ decrypt() - texto no válido o sin cifrar: "${text}"`);
    return text;
  }
}

module.exports = { encrypt, decrypt };
