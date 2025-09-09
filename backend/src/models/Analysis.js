const db = require('../config/db');

class Analysis {
  static async create(analysisData) {
    try {
      console.log(' Modelo: Creando análisis...');
      const { id_animal, id_tipo_analisis, fecha_solicitud, id_propietario } = analysisData;
      
      console.log(' Datos para crear:', { id_animal, id_tipo_analisis, fecha_solicitud, id_propietario });
      
      // Crear la muestra (incluyendo id_tipo_muestra que es requerido)
      console.log(' Insertando muestra...');
      const [muestraResult] = await db.query(
        'INSERT INTO muestra (id_animal, id_estado, fecha_toma, id_tipo_muestra) VALUES (?, 1, ?, 1)',
        [id_animal, fecha_solicitud]
      );
      
      const id_muestra = muestraResult.insertId;
      console.log(' Muestra creada con ID:', id_muestra);
      
      // Crear el resultado (incluyendo id_animal que es requerido)
      console.log(' Insertando resultado...');
      await db.query(
        'INSERT INTO resultado (id_muestra, id_tipo_analisis, resultado, fecha_emision, id_animal) VALUES (?, ?, "Pendiente", ?, ?)',
        [id_muestra, id_tipo_analisis, fecha_solicitud, id_animal]
      );
      
      console.log(' Resultado creado exitosamente');
      return id_muestra;
    } catch (error) {
      console.error('❌ Error en modelo create:', error);
      throw new Error(`Error al crear análisis: ${error.message}`);
    }
  }

  static async findByOwner(ownerId) {
    try {
      console.log(' Modelo: Buscando análisis del propietario:', ownerId);
      
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
      
      console.log(' Análisis encontrados en modelo:', rows.length);
      return rows;
    } catch (error) {
      console.error('❌ Error en modelo findByOwner:', error);
      throw new Error(`Error al buscar análisis del propietario: ${error.message}`);
    }
  }

  static async getAnalysisTypes() {
    try {
      console.log(' Modelo: Obteniendo tipos de análisis...');
      const [rows] = await db.query('SELECT id_tipo_analisis, nombre_analisis, precio FROM tipo_analisis');
      console.log(' Tipos de análisis encontrados:', rows.length);
      return rows;
    } catch (error) {
      console.error('❌ Error en modelo getAnalysisTypes:', error);
      throw new Error(`Error al obtener tipos de análisis: ${error.message}`);
    }
  }

  static async getByIdForPDF(id) {
    try {
      console.log('📄 Modelo: Obteniendo análisis para PDF, ID:', id);
      
      // Corregir la consulta: usar JOIN con animal para obtener id_propietario
      const [rows] = await db.query(`
        SELECT 
          m.id_muestra,
          a.nombre_animal,
          a.edad,
          p.nombres as propietario_nombres,
          p.apellidos as propietario_apellidos,
          p.telefono as propietario_telefono,
          p.direccion as propietario_direccion,
          ta.nombre_analisis,
          ta.precio,
          r.resultado,
          r.fecha_emision,
          te.nombre_estado,
          m.fecha_toma,
          a.id_propietario
        FROM muestra m
        JOIN animal a ON m.id_animal = a.id_animal
        JOIN propietario p ON a.id_propietario = p.id_propietario
        JOIN resultado r ON m.id_muestra = r.id_muestra
        JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
        JOIN tipo_estado te ON m.id_estado = te.id_tipo_estado
        WHERE m.id_muestra = ?
      `, [id]);
      
      console.log(' Análisis para PDF encontrado:', rows.length > 0);
      return rows[0];
    } catch (error) {
      console.error('❌ Error en modelo getByIdForPDF:', error);
      throw new Error(`Error al obtener análisis para PDF: ${error.message}`);
    }
  }
}

module.exports = Analysis;
