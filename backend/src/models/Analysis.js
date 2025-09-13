const db = require('../config/db');
const { decryptObject } = require('../utils/crypto');

// Campos sensibles que requieren descifrado
const SENSITIVE_FIELDS = ['nombre_animal', 'propietario_nombres', 'propietario_apellidos', 'propietario_telefono', 'propietario_direccion', 'propietario_email'];

class Analysis {
  static async create(analysisData) {
    try {
      const { id_animal, id_tipo_analisis, fecha_solicitud, id_propietario } = analysisData;
      
      // Crear la muestra (incluyendo id_tipo_muestra que es requerido)
      const [muestraResult] = await db.query(
        'INSERT INTO muestra (id_animal, id_estado, fecha_toma, id_tipo_muestra) VALUES (?, 1, ?, 1)',
        [id_animal, fecha_solicitud]
      );
      
      const id_muestra = muestraResult.insertId;
      
      // Crear el resultado (incluyendo id_animal que es requerido)
      await db.query(
        'INSERT INTO resultado (id_muestra, id_tipo_analisis, resultado, fecha_emision, id_animal) VALUES (?, ?, "Pendiente", ?, ?)',
        [id_muestra, id_tipo_analisis, fecha_solicitud, id_animal]
      );
      
      return id_muestra;
    } catch (error) {
      console.error('Error en modelo create:', error);
      throw new Error(`Error al crear análisis: ${error.message}`);
    }
  }

  static async findByOwner(ownerId) {
    try {
      
      // Corregir la consulta: usar JOIN con animal para obtener id_propietario
      const [rows] = await db.query(`
        SELECT 
          m.id_muestra,
          a.nombre_animal,
          ta.nombre_analisis,
          r.resultado,
          r.fecha_emision,
          te.nombre_estado,
          m.fecha_toma
        FROM muestra m
        JOIN animal a ON m.id_animal = a.id_animal
        JOIN resultado r ON m.id_muestra = r.id_muestra
        JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
        JOIN tipo_estado te ON m.id_estado = te.id_tipo_estado
        WHERE a.id_propietario = ?
        ORDER BY m.fecha_toma DESC
      `, [ownerId]);
      
      
      // Descifrar los datos sensibles
      return rows.map(row => decryptObject(row, SENSITIVE_FIELDS));
    } catch (error) {
      console.error('Error en modelo findByOwner:', error);
      throw new Error(`Error al buscar análisis del propietario: ${error.message}`);
    }
  }

  static async getAnalysisTypes() {
    try {
      const [rows] = await db.query('SELECT id_tipo_analisis, nombre_analisis, precio FROM tipo_analisis');
      return rows;
    } catch (error) {
      console.error('Error en modelo getAnalysisTypes:', error);
      throw new Error(`Error al obtener tipos de análisis: ${error.message}`);
    }
  }

  static async getByIdForPDF(id) {
    try {
      
      // Consulta corregida según la estructura real de la BD
      const [rows] = await db.query(`
        SELECT 
          m.id_muestra,
          a.id_animal,
          a.nombre_animal,
          a.edad,
          p.id_propietario,
          p.nombres as propietario_nombres,
          p.apellidos as propietario_apellidos,
          p.telefono as propietario_telefono,
          p.direccion as propietario_direccion,
          p.correo_electronico as propietario_email,
          e.nombre_especie,
          ra.nombre_raza,
          tm.nombre_tipo_muestra,
          ta.nombre_analisis,
          ta.precio,
          r.resultado,
          r.fecha_emision,
          te.nombre_estado,
          m.fecha_toma
        FROM muestra m
        JOIN animal a ON m.id_animal = a.id_animal
        JOIN propietario p ON a.id_propietario = p.id_propietario
        JOIN especie e ON a.id_especie = e.id_especie
        JOIN raza ra ON a.id_raza = ra.id_raza
        JOIN tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
        JOIN resultado r ON m.id_muestra = r.id_muestra
        JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
        JOIN tipo_estado te ON m.id_estado = te.id_tipo_estado
        WHERE m.id_muestra = ?
      `, [id]);
      
      
      if (rows[0]) {
        // Descifrar los datos sensibles antes de devolver
        return decryptObject(rows[0], SENSITIVE_FIELDS);
      }
      
      return rows[0];
    } catch (error) {
      console.error('Error en modelo getByIdForPDF:', error);
      throw new Error(`Error al obtener análisis para PDF: ${error.message}`);
    }
  }
}

module.exports = Analysis;
