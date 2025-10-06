const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// Obtener notificaciones de un usuario
router.get('/:userId', authenticateToken, getNotifications);

// Obtener contador de notificaciones no leídas
router.get('/unread/count', authenticateToken, getUnreadCount);

// Crear una nueva notificación
router.post('/', authenticateToken, createNotification);

// Marcar notificación como leída
router.put('/:id/read', authenticateToken, markAsRead);

// Marcar todas las notificaciones como leídas
router.put('/mark-all-read', authenticateToken, markAllAsRead);

// Eliminar una notificación
router.delete('/:id', authenticateToken, deleteNotification);

module.exports = router;
