const fetch = require('node-fetch');

async function testLogin() {
  const testCases = [
    {
      email: 'Correo1@ejemplo.com',
      password: 'andrew',
      description: 'Usuario Andrew Loaiza'
    },
    {
      email: 'Correo2@ejemplo.com', 
      password: 'leandro',
      description: 'Usuario LEANDRO LEDESMA'
    },
    {
      email: 'andrewloaiza1234@gmail.com',
      password: 'andrewloaiza',
      description: 'Usuario Andrew Loaiza Guzmán'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Probando login: ${testCase.description}`);
    console.log(`📧 Email: ${testCase.email}`);
    console.log(`🔑 Contraseña: ${testCase.password}`);
    
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo_electronico: testCase.email,
          contrasena: testCase.password
        })
      });

      console.log(`📊 Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login exitoso!');
        console.log(`👤 Usuario: ${data.user.nombres} ${data.user.apellidos}`);
        console.log(`🎫 Token: ${data.token.substring(0, 20)}...`);
      } else {
        const errorData = await response.json();
        console.log('❌ Error en login:');
        console.log(`   Mensaje: ${errorData.message}`);
        if (errorData.error) {
          console.log(`   Error detallado: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.log('💥 Error de conexión:', error.message);
    }
  }
}

testLogin(); 