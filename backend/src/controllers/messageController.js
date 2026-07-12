const messageService = require('../services/messageService');

async function createMessage(req, res, next) {
  try {
    const message = await messageService.createMessage(req.user._id, req.params.userId, req.body);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

async function getConversations(req, res, next) {
  try {
    const conversations = await messageService.getConversations(req.user._id);
    res.status(200).json({ success: true, count: conversations.length, data: conversations });
  } catch (error) {
    next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const messages = await messageService.getMessages(req.user._id, req.params.conversationId, req.query);
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
}

async function getUnreadCount(req, res, next) {
  try {
    const unread = await messageService.getUnreadCount(req.user._id);
    res.status(200).json({ success: true, data: unread });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMessage,
  getConversations,
  getMessages,
  getUnreadCount,
};
