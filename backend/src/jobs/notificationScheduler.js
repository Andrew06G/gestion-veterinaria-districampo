const cron = require('node-cron');
const db = require('../config/db');
const Notification = require('../models/Notification');

// Función para crear notificaciones de recordatorio de 24 horas
async function createReminderNotifications() {
  try {
    // Obtener la fecha de mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

    // Consultar muestras programadas para mañana
    const [samples] = await db.query(`
      SELECT 
        m.id_muestra,
        m.id_animal,
        a.id_propietario,
        a.nombre_animal,
        ta.nombre_analisis
      FROM muestra m
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN resultado r ON m.id_muestra = r.id_muestra
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
      WHERE m.fecha_toma = ? 
        AND te.nombre_estado = 'Pendiente'
        AND NOT EXISTS (
          SELECT 1 FROM notifications n 
          WHERE n.user_id = a.id_propietario 
            AND n.titulo = 'Próxima toma de muestra'
            AND n.mensaje LIKE CONCAT('%', a.nombre_animal, '%')
            AND DATE(n.fecha_creacion) = CURDATE()
        )
    `, [tomorrowDate]);

    // Crear notificaciones para cada muestra
    for (const sample of samples) {
      try {
        await Notification.create({
          user_id: sample.id_propietario,
          titulo: 'Próxima toma de muestra',
          mensaje: `Recuerda que mañana se realizará la toma de muestra de ${sample.nombre_animal}.`,
          tipo: 'warning'
        });
      } catch (error) {
        console.error(`Error al crear notificación para muestra ${sample.id_muestra}:`, error);
      }
    }

    if (samples.length > 0) {
      console.log(`Se crearon ${samples.length} notificaciones de recordatorio para mañana`);
    }
  } catch (error) {
    console.error('Error en el scheduler de notificaciones:', error);
  }
}

// Iniciar el scheduler
function startNotificationScheduler() {
  // Ejecutar todos los días a las 00:00
  cron.schedule('0 0 * * *', () => {
    console.log('Ejecutando scheduler de notificaciones...');
    createReminderNotifications();
  }, {
    scheduled: true,
    timezone: "America/Bogota"
  });

  console.log('Scheduler de notificaciones iniciado - se ejecutará diariamente a las 00:00');
}

module.exports = {
  startNotificationScheduler,
  createReminderNotifications
};
