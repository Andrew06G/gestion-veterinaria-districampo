#!/usr/bin/env node

/**
 * Script para migrar contraseñas existentes a hash bcrypt
 * Este script convierte todas las contraseñas planas a hash seguros
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../src/config/db');

async function migratePasswords() {
  let connection;
  
  try {
    console.log('Iniciando migración de contraseñas...');
    console.log('Conectando a la base de datos...');
    
    // Conectar a la base de datos
    connection = await db.getConnection();
    console.log('Conexión exitosa a la base de datos');
    
    // Obtener todos los usuarios
    console.log('Obteniendo usuarios de la base de datos...');
    const [users] = await connection.execute('SELECT id_propietario, contraseña FROM propietario');
    
    if (users.length === 0) {
      console.log(' No hay usuarios para migrar');
      return;
    }
    
    console.log(`ncontrados ${users.length} usuarios`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    // Procesar cada usuario
    for (const user of users) {
      try {
        // Verificar si la contraseña ya está hasheada
        if (user.contraseña && user.contraseña.length > 20) {
          console.log(`Usuario ${user.id_propietario}: Contraseña ya hasheada, saltando...`);
          skippedCount++;
          continue;
        }
        
        // Hash de la contraseña actual
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(user.contraseña, saltRounds);
        
        // Actualizar en la base de datos
        await connection.execute(
          'UPDATE propietario SET contraseña = ? WHERE id_propietario = ?',
          [hashedPassword, user.id_propietario]
        );
        
        console.log(` Usuario ${user.id_propietario}: Contraseña migrada exitosamente`);
        migratedCount++;
        
      } catch (error) {
        console.error(` Error migrando usuario ${user.id_propietario}:`, error.message);
      }
    }
    
    // Resumen final
    console.log('\n RESUMEN DE MIGRACIÓN:');
    console.log(` Contraseñas migradas: ${migratedCount}`);
    console.log(` Contraseñas ya hasheadas: ${skippedCount}`);
    console.log(` Total de usuarios procesados: ${users.length}`);
    
    if (migratedCount > 0) {
      console.log('\n ¡Migración completada exitosamente!');
      console.log('Todas las contraseñas ahora están protegidas con hash bcrypt');
    } else {
      console.log('\n No se requirió migración - todas las contraseñas ya están hasheadas');
    }
    
  } catch (error) {
    console.error(' Error durante la migración:', error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
      console.log('Conexión a la base de datos liberada');
    }
  }
}

// Función para verificar el estado de las contraseñas
async function checkPasswordStatus() {
  let connection;
  
  try {
    console.log(' Verificando estado de las contraseñas...');
    
    connection = await db.getConnection();
    
    const [users] = await connection.execute('SELECT id_propietario, contraseña FROM propietario');
    
    let hashedCount = 0;
    let plainCount = 0;
    
    users.forEach(user => {
      if (user.contraseña && user.contraseña.length > 20) {
        hashedCount++;
      } else {
        plainCount++;
      }
    });
    
    console.log('\n ESTADO DE LAS CONTRASEÑAS:');
    console.log(` Contraseñas hasheadas: ${hashedCount}`);
    console.log(` Contraseñas planas: ${plainCount}`);
    console.log(` Total de usuarios: ${users.length}`);
    
    if (plainCount > 0) {
      console.log('\n ADVERTENCIA: Hay contraseñas planas que requieren migración');
      console.log(' Ejecuta: node migrate-passwords.js');
    } else {
      console.log('\n Todas las contraseñas están protegidas');
    }
    
  } catch (error) {
    console.error(' Error verificando contraseñas:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Ejecutar según el argumento
const command = process.argv[2];

if (command === 'check') {
  checkPasswordStatus();
} else if (command === 'migrate') {
  migratePasswords();
} else {
  console.log(' Script de Gestión de Contraseñas');
  console.log('\n Comandos disponibles:');
  console.log('  node migrate-passwords.js check    - Verificar estado de contraseñas');
  console.log('  node migrate-passwords.js migrate  - Migrar contraseñas a hash');
  console.log('\n Ejemplo: node migrate-passwords.js check');
}
