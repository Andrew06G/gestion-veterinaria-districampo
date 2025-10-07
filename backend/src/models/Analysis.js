const db = require('../config/db');
const { decryptObject } = require('../utils/crypto');

// Campos sensibles que requieren descifrado
const SENSITIVE_FIELDS = ['nombre_animal', 'propietario_nombres', 'propietario_apellidos', 'propietario_telefono', 'propietario_direccion', 'propietario_email'];

class Analysis {
  // Utilidades en crudo para controladores puntuales
  static async _rawQuery(query, params) {
    return db.query(query, params);
  }
  static async _rawExec(query, params) {
    return db.query(query, params);
  }
  static async create(analysisData) {
    try {
      const { id_animal, id_tipo_analisis, fecha_solicitud, hora_toma, id_propietario } = analysisData;
      
      // Obtener el tipo de muestra correspondiente al análisis
      const [tipoAnalisis] = await db.query(
        'SELECT id_tipo_muestra FROM tipo_analisis WHERE id_tipo_analisis = ?',
        [id_tipo_analisis]
      );
      
      if (!tipoAnalisis[0]) {
        throw new Error('Tipo de análisis no encontrado');
      }
      
      const id_tipo_muestra = tipoAnalisis[0].id_tipo_muestra;
      
      // Crear la muestra con el tipo de muestra correcto
      const [muestraResult] = await db.query(
        'INSERT INTO muestra (id_animal, id_estado, fecha_toma, hora_toma, id_tipo_muestra) VALUES (?, 1, ?, ?, ?)',
        [id_animal, fecha_solicitud, hora_toma, id_tipo_muestra]
      );
      
      const id_muestra = muestraResult.insertId;
      
      // Crear el resultado (incluyendo id_animal que es requerido)
      await db.query(
        'INSERT INTO resultado (id_muestra, id_tipo_analisis, resultado, fecha_emision, hora_emision, id_animal, id_estado) VALUES (?, ?, "Pendiente", ?, ?, ?, 1)',
        [id_muestra, id_tipo_analisis, fecha_solicitud, null, id_animal]
      );
      
      return id_muestra;
    } catch (error) {
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
          ta.precio,
          tm.nombre_tipo_muestra,
          r.resultado,
        r.fecha_emision,
        r.hora_emision,
          r.observaciones,
          te.nombre_estado,
        m.fecha_toma,
        m.hora_toma
        FROM muestra m
        JOIN animal a ON m.id_animal = a.id_animal
        JOIN resultado r ON m.id_muestra = r.id_muestra
        JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
        JOIN tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
        JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
        WHERE a.id_propietario = ?
        ORDER BY m.fecha_toma DESC
      `, [ownerId]);
      
      
      // Descifrar los datos sensibles
      return rows.map(row => decryptObject(row, SENSITIVE_FIELDS));
    } catch (error) {
      throw new Error(`Error al buscar análisis del propietario: ${error.message}`);
    }
  }

  static async getAnalysisTypes() {
    try {
      const [rows] = await db.query(`
        SELECT 
          ta.id_tipo_analisis, 
          ta.nombre_analisis, 
          ta.precio,
          tm.nombre_tipo_muestra as tipo_muestra
        FROM tipo_analisis ta
        JOIN tipo_muestra tm ON ta.id_tipo_muestra = tm.id_tipo_muestra
      `);
      return rows;
    } catch (error) {
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
          r.hora_emision,
          r.observaciones,
          te.nombre_estado,
          m.fecha_toma,
          m.hora_toma
        FROM muestra m
        JOIN animal a ON m.id_animal = a.id_animal
        JOIN propietario p ON a.id_propietario = p.id_propietario
        JOIN especie e ON a.id_especie = e.id_especie
        JOIN raza ra ON a.id_raza = ra.id_raza
        JOIN tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
        JOIN resultado r ON m.id_muestra = r.id_muestra
        JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
        JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
        WHERE m.id_muestra = ?
      `, [id]);
      
      
      if (rows[0]) {
        // Descifrar los datos sensibles antes de devolver
        return decryptObject(rows[0], SENSITIVE_FIELDS);
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener análisis para PDF: ${error.message}`);
    }
  }

  // Obtener análisis de un animal específico para validaciones
  static async findByAnimal(animalId) {
    try {
      const [rows] = await db.query(`
        SELECT 
          r.id_resultado,
          r.id_estado,
          te.nombre_estado,
          m.fecha_toma,
          ta.nombre_analisis
        FROM resultado r
        JOIN muestra m ON r.id_muestra = m.id_muestra
        JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
        JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
        WHERE m.id_animal = ?
        ORDER BY m.fecha_toma DESC
      `, [animalId]);
      
      return rows;
    } catch (error) {
      throw new Error(`Error al buscar análisis del animal: ${error.message}`);
    }
  }
}

module.exports = Analysis;
