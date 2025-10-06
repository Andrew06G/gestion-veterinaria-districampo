const Notification = require('../models/Notification');

// Obtener notificaciones de un usuario
async function getNotifications(req, res) {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.getByUserId(userId);
    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Crear una nueva notificación
async function createNotification(req, res) {
  try {
    const { user_id, titulo, mensaje, tipo } = req.body;
    
    if (!user_id || !titulo || !mensaje) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos requeridos' 
      });
    }

    const notificationId = await Notification.create({
      user_id,
      titulo,
      mensaje,
      tipo: tipo || 'info'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Notificación creada exitosamente',
      notificationId 
    });
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Marcar notificación como leída
async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_propietario; // Asumiendo que viene del middleware de auth

    const success = await Notification.markAsRead(id, userId);
    
    if (success) {
      res.json({ success: true, message: 'Notificación marcada como leída' });
    } else {
      res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    }
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Marcar todas las notificaciones como leídas
async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id_propietario; // Asumiendo que viene del middleware de auth
    const count = await Notification.markAllAsRead(userId);
    
    res.json({ 
      success: true, 
      message: `${count} notificaciones marcadas como leídas` 
    });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Eliminar una notificación
async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id_propietario; // Asumiendo que viene del middleware de auth

    const success = await Notification.delete(id, userId);
    
    if (success) {
      res.json({ success: true, message: 'Notificación eliminada exitosamente' });
    } else {
      res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Obtener contador de notificaciones no leídas
async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id_propietario; // Asumiendo que viene del middleware de auth
    const count = await Notification.getUnreadCount(userId);
    
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error al obtener contador de notificaciones:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};

