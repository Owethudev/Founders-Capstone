const express = require('express');
const { createMessage, getConversations, getMessages, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.get('/unread-count', protect, getUnreadCount);
router.post('/:userId', protect, createMessage);

module.exports = router;
