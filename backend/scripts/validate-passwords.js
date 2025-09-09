#!/usr/bin/env node

/**
 * Script para validar la fortaleza de las contraseñas
 * Este script verifica que las contraseñas cumplan con los estándares de seguridad
 */

require('dotenv').config();
const db = require('../src/config/db');

// Función para validar fortaleza de contraseña
function validatePasswordStrength(password) {
  const validations = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(validations).filter(Boolean).length;
  const maxScore = Object.keys(validations).length;
  
  let strength = 'Débil';
  if (score >= 4) strength = 'Fuerte';
  else if (score >= 3) strength = 'Media';
  
  return {
    score,
    maxScore,
    strength,
    validations,
    percentage: Math.round((score / maxScore) * 100)
  };
}

// Función para verificar contraseñas comunes
function isCommonPassword(password) {
  const commonPasswords = [
    '123456', 'password', '123456789', '12345678', '12345', 'qwerty',
    'abc123', '111111', '123123', 'admin', 'letmein', 'welcome',
    'monkey', '1234567890', 'dragon', 'baseball', 'football',
    'shadow', 'master', 'jordan', 'superman', 'harley', 'hunter'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
}

async function validateAllPasswords() {
  let connection;
  
  try {
    console.log('Validando fortaleza de todas las contraseñas...');
    
    connection = await db.getConnection();
    
    // Obtener usuarios con contraseñas planas (para validación)
    const [users] = await connection.execute('SELECT id_propietario, nombres, apellidos, contraseña FROM propietario');
    
    if (users.length === 0) {
      console.log('No hay usuarios para validar');
      return;
    }
    
    console.log(`Encontrados ${users.length} usuarios`);
    
    let strongPasswords = 0;
    let mediumPasswords = 0;
    let weakPasswords = 0;
    let commonPasswords = 0;
    let hashedPasswords = 0;
    
    console.log('\nANÁLISIS DE CONTRASEÑAS:\n');
    
    for (const user of users) {
      if (user.contraseña && user.contraseña.length > 20) {
        // Contraseña hasheada
        hashedPasswords++;
        console.log(`${user.nombres} ${user.apellidos} (ID: ${user.id_propietario}): Contraseña hasheada`);
      } else {
        // Contraseña plana - validar fortaleza
        const validation = validatePasswordStrength(user.contraseña);
        const isCommon = isCommonPassword(user.contraseña);
        
        if (isCommon) {
          commonPasswords++;
        }
        
        switch (validation.strength) {
          case 'Fuerte':
            strongPasswords++;
            break;
          case 'Media':
            mediumPasswords++;
            break;
          case 'Débil':
            weakPasswords++;
            break;
        }
        
        const status = isCommon ? 'COMÚN' : validation.strength.toUpperCase();
        console.log(`${user.nombres} ${user.apellidos} (ID: ${user.id_propietario}): ${status} (${validation.percentage}%)`);
        
        if (validation.strength === 'Débil' || isCommon) {
          console.log(`   Recomendaciones:`);
          if (!validation.validations.length) console.log(`   - Mínimo 8 caracteres`);
          if (!validation.validations.lowercase) console.log(`   - Incluir minúsculas`);
          if (!validation.validations.uppercase) console.log(`   - Incluir mayúsculas`);
          if (!validation.validations.numbers) console.log(`   - Incluir números`);
          if (!validation.validations.special) console.log(`   - Incluir caracteres especiales`);
          if (isCommon) console.log(`   - Evitar contraseñas comunes`);
        }
        console.log('');
      }
    }
    
    // Resumen final
    console.log('RESUMEN DE VALIDACIÓN:');
    console.log(`Contraseñas hasheadas: ${hashedPasswords}`);
    console.log(`Contraseñas fuertes: ${strongPasswords}`);
    console.log(`Contraseñas medianas: ${mediumPasswords}`);
    console.log(`Contraseñas débiles: ${weakPasswords}`);
    console.log(`Contraseñas comunes: ${commonPasswords}`);
    console.log(`Total de usuarios: ${users.length}`);
    
    // Recomendaciones
    if (weakPasswords > 0 || commonPasswords > 0) {
      console.log('\nRECOMENDACIONES DE SEGURIDAD:');
      if (weakPasswords > 0) {
        console.log(`- ${weakPasswords} usuarios tienen contraseñas débiles`);
      }
      if (commonPasswords > 0) {
        console.log(`- ${commonPasswords} usuarios tienen contraseñas comunes`);
      }
      if (hashedPasswords < users.length) {
        console.log('- Migrar todas las contraseñas a hash bcrypt');
        console.log('  Ejecuta: node migrate-passwords.js migrate');
      }
    } else {
      console.log('\nExcelente! Todas las contraseñas cumplen con los estándares de seguridad');
    }
    
  } catch (error) {
    console.error('Error durante la validación:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Función para validar una contraseña específica
function validateSinglePassword(password) {
  console.log('Validando contraseña específica...\n');
  
  const validation = validatePasswordStrength(password);
  const isCommon = isCommonPassword(password);
  
  console.log(`Contraseña: ${'*'.repeat(password.length)}`);
  console.log(`Puntuación: ${validation.score}/${validation.maxScore} (${validation.percentage}%)`);
  console.log(`Fortaleza: ${validation.strength}`);
  console.log(`Contraseña común: ${isCommon ? 'SÍ' : 'NO'}`);
  
  console.log('\nDetalles de validación:');
  console.log(`Longitud mínima (8+): ${validation.validations.length ? 'SÍ' : 'NO'}`);
  console.log(`Minúsculas: ${validation.validations.lowercase ? 'SÍ' : 'NO'}`);
  console.log(`Mayúsculas: ${validation.validations.uppercase ? 'SÍ' : 'NO'}`);
  console.log(`Números: ${validation.validations.numbers ? 'SÍ' : 'NO'}`);
  console.log(`Caracteres especiales: ${validation.validations.special ? 'SÍ' : 'NO'}`);
  
  if (validation.strength === 'Débil' || isCommon) {
    console.log('\nRecomendaciones para mejorar:');
    if (!validation.validations.length) console.log('- Aumentar a mínimo 8 caracteres');
    if (!validation.validations.lowercase) console.log('- Incluir al menos una minúscula');
    if (!validation.validations.uppercase) console.log('- Incluir al menos una mayúscula');
    if (!validation.validations.numbers) console.log('- Incluir al menos un número');
    if (!validation.validations.special) console.log('- Incluir al menos un carácter especial');
    if (isCommon) console.log('- Evitar contraseñas comunes o predecibles');
  }
}

// Ejecutar según el argumento
const command = process.argv[2];
const password = process.argv[3];

if (command === 'test' && password) {
  validateSinglePassword(password);
} else if (command === 'validate') {
  validateAllPasswords();
} else {
  console.log('Script de Validación de Contraseñas');
  console.log('\nComandos disponibles:');
  console.log('  node validate-passwords.js validate           - Validar todas las contraseñas');
  console.log('  node validate-passwords.js test "password"   - Validar contraseña específica');
  console.log('\nEjemplos:');
  console.log('  node validate-passwords.js validate');
  console.log('  node validate-passwords.js test "MiContraseña123!"');
}


