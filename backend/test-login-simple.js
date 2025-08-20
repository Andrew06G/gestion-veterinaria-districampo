const http = require('http');

function testLogin(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      correo_electronico: email,
      contrasena: password
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/users/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: { message: 'Error parsing response', raw: data }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
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
      const result = await testLogin(testCase.email, testCase.password);
      
      console.log(`📊 Status: ${result.status}`);
      
      if (result.status === 200) {
        console.log('✅ Login exitoso!');
        console.log(`👤 Usuario: ${result.data.user.nombres} ${result.data.user.apellidos}`);
        console.log(`🎫 Token: ${result.data.token.substring(0, 20)}...`);
      } else {
        console.log('❌ Error en login:');
        console.log(`   Mensaje: ${result.data.message}`);
        if (result.data.error) {
          console.log(`   Error detallado: ${result.data.error}`);
        }
      }
    } catch (error) {
      console.log('💥 Error de conexión:', error.message);
    }
  }
}

runTests(); 