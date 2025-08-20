const db = require('./config/db');

async function testDatabase() {
  try {
    console.log('Probando conexión a la base de datos...');
    
    // Probar conexión básica
    const connection = await db.getConnection();
    console.log('✅ Conexión exitosa a la base de datos');
    connection.release();
    
    // Verificar si la tabla propietario existe
    console.log('\nVerificando estructura de la tabla propietario...');
    const [tables] = await db.query('SHOW TABLES LIKE "propietario"');
    if (tables.length === 0) {
      console.log('❌ La tabla "propietario" no existe');
      return;
    }
    console.log('✅ La tabla "propietario" existe');
    
    // Verificar estructura de la tabla
    const [columns] = await db.query('DESCRIBE propietario');
    console.log('\nEstructura de la tabla propietario:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });
    
    // Verificar si hay usuarios en la tabla
    const [users] = await db.query('SELECT COUNT(*) as count FROM propietario');
    console.log(`\nNúmero de usuarios en la tabla: ${users[0].count}`);
    
    // Mostrar algunos usuarios de ejemplo
    const [sampleUsers] = await db.query('SELECT id_propietario, nombres, apellidos, correo_electronico FROM propietario LIMIT 5');
    console.log('\nUsuarios de ejemplo:');
    sampleUsers.forEach(user => {
      console.log(`- ID: ${user.id_propietario}, Nombre: ${user.nombres} ${user.apellidos}, Email: ${user.correo_electronico}`);
    });
    
    // Probar consulta específica de login
    console.log('\nProbando consulta de login...');
    const [loginTest] = await db.query('SELECT * FROM propietario WHERE correo_electronico = ?', ['test@test.com']);
    if (loginTest.length > 0) {
      console.log('✅ Usuario de prueba encontrado');
      console.log(`- Contraseña almacenada: ${loginTest[0].contraseña}`);
    } else {
      console.log('❌ Usuario de prueba no encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba de base de datos:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    process.exit(0);
  }
}

testDatabase(); 