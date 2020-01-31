const express = require('express');

const NotificationController = require('../controllers/controlNotification');

// Middleware - JWT verification
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// /api/v1/notifications
router.get('/', NotificationController.getNotifications);
router.post('/', checkAuth, NotificationController.addNotification);

// /api/v1/notifications/:id
router.get('/:notificationID', NotificationController.getNotification);
router.patch('/:notificationID', checkAuth, NotificationController.patchNotification);
router.delete('/:notificationID', checkAuth, NotificationController.deleteNotification);

module.exports = router;