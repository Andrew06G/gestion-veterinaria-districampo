const db = require('../src/config/db');

async function setupNotificationsTable() {
  try {
    // Usar la conexión existente de db.js
    const connection = await db.getConnection();

    console.log('Configurando tabla de notificaciones...');

    // Crear la tabla de notificaciones
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        titulo VARCHAR(100) NOT NULL,
        mensaje TEXT NOT NULL,
        tipo ENUM('info','success','warning','error') DEFAULT 'info',
        leida BOOLEAN DEFAULT FALSE,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES propietario(id_propietario) ON DELETE CASCADE
      )
    `);

    console.log('Tabla notifications verificada/creada.');

    // Crear índices para mejorar el rendimiento (MySQL no soporta IF NOT EXISTS para índices)
    try {
      await connection.execute(`CREATE INDEX idx_notifications_user_id ON notifications(user_id)`);
    } catch (e) {
      // El índice ya existe, continuar
    }
    
    try {
      await connection.execute(`CREATE INDEX idx_notifications_leida ON notifications(leida)`);
    } catch (e) {
      // El índice ya existe, continuar
    }
    
    try {
      await connection.execute(`CREATE INDEX idx_notifications_fecha ON notifications(fecha_creacion)`);
    } catch (e) {
      // El índice ya existe, continuar
    }

    console.log('Índices verificados/creados.');

    // No insertar datos de prueba en entornos reales

    console.log('Configuración de notificaciones completada.');

  } catch (error) {
    console.error('❌ Error al configurar notificaciones:', error);
  } finally {
    // No necesitamos liberar la conexión ya que usamos el pool
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupNotificationsTable();
}

module.exports = setupNotificationsTable;
