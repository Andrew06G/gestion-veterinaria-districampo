const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdminTable() {
  let connection;
  
  try {
    // Usar la misma configuración que la aplicación
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'veterilab2',
      port: process.env.DB_PORT || 3306
    };
    
    connection = await mysql.createConnection(dbConfig);

    console.log('Conectado a la base de datos');

    // Crear tabla admin
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`admin\` (
        \`id_admin\` int NOT NULL AUTO_INCREMENT,
        \`nombres\` varchar(50) NOT NULL,
        \`apellidos\` varchar(50) NOT NULL,
        \`correo_electronico\` varchar(500) NOT NULL,
        \`telefono\` varchar(500) DEFAULT NULL,
        \`direccion\` varchar(1000) DEFAULT NULL,
        \`contrasena\` varchar(255) NOT NULL,
        \`rol\` enum('admin','super_admin') DEFAULT 'admin',
        \`activo\` tinyint(1) DEFAULT 1,
        \`fecha_creacion\` timestamp DEFAULT CURRENT_TIMESTAMP,
        \`ultimo_acceso\` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (\`id_admin\`),
        UNIQUE KEY \`correo_electronico\` (\`correo_electronico\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    await connection.execute(createTableSQL);
    console.log('Tabla admin creada');

    // Verificar si ya existe un admin
    const [existingAdmins] = await connection.execute('SELECT COUNT(*) as count FROM admin');
    
    if (existingAdmins[0].count === 0) {
      // Insertar administrador inicial
      const insertAdminSQL = `
        INSERT INTO \`admin\` (
          \`nombres\`, 
          \`apellidos\`, 
          \`correo_electronico\`, 
          \`telefono\`, 
          \`direccion\`, 
          \`contrasena\`, 
          \`rol\`
        ) VALUES (
          'Administrador',
          'Sistema',
          'admin@districampo.com',
          '3001234567',
          'Calle Principal 123, Ciudad',
          '$2b$12$LBBcuYR9KH2ROAvMldSKG.zjg6sXt.dsNutUneWOJFh7rTJoIf0dO',
          'super_admin'
        );
      `;

      await connection.execute(insertAdminSQL);
      console.log('Administrador inicial creado');
    } else {
      console.log('Ya existen administradores en la tabla');
    }

    // Mostrar estructura de la tabla
    const [tableStructure] = await connection.execute('DESCRIBE admin');
    console.log('\nEstructura de la tabla admin:');
    console.table(tableStructure);

    // Mostrar administradores existentes
    const [admins] = await connection.execute('SELECT id_admin, nombres, apellidos, correo_electronico, rol, activo FROM admin');
    console.log('\nAdministradores en la base de datos:');
    console.table(admins);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nConexión cerrada');
    }
  }
}

// Ejecutar el script
createAdminTable();
