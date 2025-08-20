const db = require('./config/db');

async function checkUsers() {
  try {
    console.log('Verificando usuarios existentes...\n');
    
    const [users] = await db.query('SELECT id_propietario, nombres, apellidos, correo_electronico, contraseña FROM propietario');
    
    console.log('Usuarios disponibles para login:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id_propietario}`);
      console.log(`   Nombre: ${user.nombres} ${user.apellidos}`);
      console.log(`   Email: ${user.correo_electronico}`);
      console.log(`   Contraseña: ${user.contraseña}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkUsers(); 