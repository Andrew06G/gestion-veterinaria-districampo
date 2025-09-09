const db = require('../src/config/db');

async function fixPasswordColumn() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Obtener conexión del pool
    const connection = await db.getConnection();
    console.log('Conectado a la base de datos');
    
    // Verificar el tamaño actual de la columna
    console.log('Verificando tamaño actual de la columna contraseña...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'propietario' AND COLUMN_NAME = 'contraseña'
    `, [process.env.DB_NAME || 'veterilab2']);
    
    if (columns.length > 0) {
      console.log(`Tamaño actual: ${columns[0].DATA_TYPE}(${columns[0].CHARACTER_MAXIMUM_LENGTH})`);
    }
    
    // Modificar la columna para que pueda almacenar contraseñas hasheadas
    console.log('Modificando columna contraseña a VARCHAR(255)...');
    await connection.execute(`
      ALTER TABLE propietario 
      MODIFY COLUMN contraseña VARCHAR(255) NOT NULL
    `);
    
    console.log('Columna modificada exitosamente');
    
    // Verificar el nuevo tamaño
    console.log('Verificando nuevo tamaño...');
    const [newColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'propietario' AND COLUMN_NAME = 'contraseña'
    `, [process.env.DB_NAME || 'veterilab2']);
    
    if (newColumns.length > 0) {
      console.log(`Nuevo tamaño: ${newColumns[0].DATA_TYPE}(${newColumns[0].CHARACTER_MAXIMUM_LENGTH})`);
    }
    
    console.log('Columna de contraseña actualizada correctamente');
    console.log('Ahora puedes registrar usuarios con contraseñas hasheadas');
    
  } catch (error) {
    console.error('Error al modificar la columna:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
      console.log('Conexión liberada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixPasswordColumn();
}

module.exports = { fixPasswordColumn };
