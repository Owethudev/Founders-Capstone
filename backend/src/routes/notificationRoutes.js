const express = require('express');
const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markNotificationAsRead);
router.patch('/read-all', protect, markAllNotificationsAsRead);

module.exports = router;
