const db = require('../config/db');

class Notification {
  // Obtener notificaciones de un usuario
  static async getByUserId(userId) {
    try {
      const [rows] = await db.query(`
        SELECT id, titulo, mensaje, tipo, leida, fecha_creacion
        FROM notifications 
        WHERE user_id = ? 
        ORDER BY fecha_creacion DESC
      `, [userId]);
      return rows;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  // Crear una nueva notificación
  static async create(notificationData) {
    try {
      const { user_id, titulo, mensaje, tipo = 'info' } = notificationData;
      const [result] = await db.query(`
        INSERT INTO notifications (user_id, titulo, mensaje, tipo)
        VALUES (?, ?, ?, ?)
      `, [user_id, titulo, mensaje, tipo]);
      return result.insertId;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  }

  // Marcar notificación como leída
  static async markAsRead(notificationId, userId) {
    try {
      const [result] = await db.query(`
        UPDATE notifications 
        SET leida = TRUE 
        WHERE id = ? AND user_id = ?
      `, [notificationId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      throw error;
    }
  }

  // Marcar todas las notificaciones como leídas
  static async markAllAsRead(userId) {
    try {
      const [result] = await db.query(`
        UPDATE notifications 
        SET leida = TRUE 
        WHERE user_id = ? AND leida = FALSE
      `, [userId]);
      return result.affectedRows;
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  }

  // Eliminar una notificación
  static async delete(notificationId, userId) {
    try {
      const [result] = await db.query(`
        DELETE FROM notifications 
        WHERE id = ? AND user_id = ?
      `, [notificationId, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  }

  // Obtener contador de notificaciones no leídas
  static async getUnreadCount(userId) {
    try {
      const [rows] = await db.query(`
        SELECT COUNT(*) as count
        FROM notifications 
        WHERE user_id = ? AND leida = FALSE
      `, [userId]);
      return rows[0].count;
    } catch (error) {
      console.error('Error al obtener contador de notificaciones:', error);
      throw error;
    }
  }
}

module.exports = Notification;

