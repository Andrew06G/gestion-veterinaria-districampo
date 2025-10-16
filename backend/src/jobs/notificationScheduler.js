const cron = require('node-cron');
const db = require('../config/db');
const Notification = require('../models/Notification');
const { decrypt } = require('../utils/crypto');

// Función para crear notificaciones de recordatorio de 24 horas
async function createReminderNotifications() {
  try {
    const now = new Date();
    // Buscar muestras en ventana de 23h a 25h desde ahora (tolerancia)
    const lower = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const upper = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    const lowerDate = lower.toISOString().slice(0, 19).replace('T', ' ');
    const upperDate = upper.toISOString().slice(0, 19).replace('T', ' ');

    const [samples] = await db.query(`
      SELECT 
        m.id_muestra,
        m.id_animal,
        a.id_propietario,
        a.nombre_animal,
        ta.nombre_analisis,
        CONCAT(m.fecha_toma, ' ', IFNULL(m.hora_toma, '00:00:00')) AS fecha_hora_toma
      FROM muestra m
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN resultado r ON m.id_muestra = r.id_muestra
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
      WHERE CONCAT(m.fecha_toma, ' ', IFNULL(m.hora_toma, '00:00:00')) BETWEEN ? AND ?
        AND te.nombre_estado = 'Pendiente'
        AND NOT EXISTS (
          SELECT 1 FROM notifications n 
          WHERE n.user_id = a.id_propietario 
            AND n.titulo = 'Próxima toma de muestra'
            AND (
              n.mensaje LIKE CONCAT('%ID:', m.id_muestra, '%')
              OR n.mensaje LIKE CONCAT('%', a.nombre_animal, '%')
            )
            AND TIMESTAMPDIFF(HOUR, n.fecha_creacion, NOW()) < 26
        )
    `, [lowerDate, upperDate]);

    // Crear notificaciones para cada muestra
    for (const sample of samples) {
      try {
        const nombreAnimalDesencriptado = decrypt(sample.nombre_animal);
        await Notification.create({
          user_id: sample.id_propietario,
          titulo: 'Próxima toma de muestra',
          mensaje: `Recuerda que mañana se realizará la toma de muestra de ${nombreAnimalDesencriptado}. [ID:${sample.id_muestra}]`,
          tipo: 'warning'
        });
      } catch (error) {
        console.error(`Error al crear notificación para muestra ${sample.id_muestra}:`, error);
      }
    }

    if (samples.length > 0) {
      console.log(`Se crearon ${samples.length} notificaciones de recordatorio (ventana 23-25h).`);
    }
    
    // Fallback: si faltan <24h y no hay notificación, crearla igualmente
    const [nearSamples] = await db.query(`
      SELECT 
        m.id_muestra,
        m.id_animal,
        a.id_propietario,
        a.nombre_animal,
        ta.nombre_analisis,
        CONCAT(m.fecha_toma, ' ', IFNULL(m.hora_toma, '00:00:00')) AS fecha_hora_toma
      FROM muestra m
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN resultado r ON m.id_muestra = r.id_muestra
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_estado te ON r.id_estado = te.id_tipo_estado
      WHERE CONCAT(m.fecha_toma, ' ', IFNULL(m.hora_toma, '00:00:00')) > NOW()
        AND TIMESTAMPDIFF(HOUR, NOW(), CONCAT(m.fecha_toma, ' ', IFNULL(m.hora_toma, '00:00:00'))) < 24
        AND te.nombre_estado = 'Pendiente'
        AND NOT EXISTS (
          SELECT 1 FROM notifications n 
          WHERE n.user_id = a.id_propietario 
            AND n.titulo = 'Próxima toma de muestra'
            AND (
              n.mensaje LIKE CONCAT('%ID:', m.id_muestra, '%')
              OR n.mensaje LIKE CONCAT('%', a.nombre_animal, '%')
            )
            AND TIMESTAMPDIFF(HOUR, n.fecha_creacion, NOW()) < 26
        )
    `);

    for (const sample of nearSamples) {
      try {
        const nombreAnimalDesencriptado = decrypt(sample.nombre_animal);
        await Notification.create({
          user_id: sample.id_propietario,
          titulo: 'Próxima toma de muestra',
          mensaje: `Recuerda que pronto (menos de 24h) se realizará la toma de muestra de ${nombreAnimalDesencriptado}. [ID:${sample.id_muestra}]`,
          tipo: 'warning'
        });
      } catch (error) {
        console.error(`Error al crear notificación fallback para muestra ${sample.id_muestra}:`, error);
      }
    }
    if (nearSamples.length > 0) {
      console.log(`Se crearon ${nearSamples.length} notificaciones de recordatorio (fallback <24h).`);
    }
  } catch (error) {
    console.error('Error en el scheduler de notificaciones:', error);
  }
}

// Iniciar el scheduler
function startNotificationScheduler() {
  // Ejecutar cada 5 minutos
  cron.schedule('*/5 * * * *', () => {
    console.log('Ejecutando scheduler de notificaciones (cada 5 minutos)...');
    createReminderNotifications();
  }, {
    scheduled: true,
    timezone: "America/Bogota"
  });

  console.log('Scheduler de notificaciones iniciado - cada 5 minutos');
}

module.exports = {
  startNotificationScheduler,
  createReminderNotifications
};
