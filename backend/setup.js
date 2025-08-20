#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🚀 Configurando Sistema de Gestión Veterinaria...\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  try {
    // Verificar si ya existe .env
    if (fs.existsSync('.env')) {
      console.log('⚠️  El archivo .env ya existe. ¿Deseas sobrescribirlo? (y/n)');
      const overwrite = await question('Respuesta: ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('✅ Configuración cancelada. El archivo .env se mantiene intacto.');
        rl.close();
        return;
      }
    }

    console.log('📝 Configurando variables de entorno...\n');

    // Obtener configuración del usuario
    const dbHost = await question('Host de la base de datos (localhost): ') || 'localhost';
    const dbUser = await question('Usuario de MySQL (root): ') || 'root';
    const dbPassword = await question('Contraseña de MySQL: ');
    const dbName = await question('Nombre de la base de datos (veterilab2): ') || 'veterilab2';
    const dbPort = await question('Puerto de MySQL (3306): ') || '3306';
    const serverPort = await question('Puerto del servidor (3001): ') || '3001';
    
    // Generar JWT secret aleatorio
    const jwtSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Crear contenido del archivo .env
    const envContent = `# Configuración de la Base de Datos
DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}
DB_PORT=${dbPort}

# Configuración del Servidor
PORT=${serverPort}
JWT_SECRET=${jwtSecret}

# Configuración de CORS (opcional)
CORS_ORIGIN=http://localhost:3000
`;

    // Escribir archivo .env
    fs.writeFileSync('.env', envContent);
    console.log('✅ Archivo .env creado exitosamente!');

    // Crear archivo de configuración de base de datos
    const dbConfigContent = `const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a la base de datos usando variables de entorno
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'veterilab2',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const db = mysql.createPool(dbConfig);

// Probar la conexión
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Conexión exitosa a la base de datos MySQL');
    connection.release();
  } catch (error) {
    console.error('Error conectando a la base de datos:', error.message);
    process.exit(1);
  }
}

// Ejecutar prueba de conexión
testConnection();

module.exports = db;
`;

    fs.writeFileSync('config/db.js', dbConfigContent);
    console.log('✅ Archivo de configuración de base de datos actualizado!');

    console.log('\n🎉 Configuración completada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Crear la base de datos en MySQL');
    console.log('2. Ejecutar: npm install');
    console.log('3. Ejecutar: node server.js');
    console.log('\n📖 Para más información, consulta el README.md');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
  } finally {
    rl.close();
  }
}

setup(); 