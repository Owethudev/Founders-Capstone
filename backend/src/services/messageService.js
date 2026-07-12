const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const AppError = require('../utils/appError');

async function getOrCreateConversation(currentUserId, otherUserId) {
  if (currentUserId.toString() === otherUserId.toString()) {
    throw new AppError('You cannot start a conversation with yourself', 400);
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, otherUserId], $size: 2 },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [currentUserId, otherUserId],
    });
  }

  return conversation;
}

async function createMessage(currentUserId, otherUserId, payload) {
  const { body, attachments = [] } = payload;
  const conversation = await getOrCreateConversation(currentUserId, otherUserId);

  const message = await Message.create({
    conversationId: conversation._id,
    senderId: currentUserId,
    body,
    attachments,
    readBy: [currentUserId],
  });

  conversation.lastMessageId = message._id;
  conversation.lastMessageAt = message.createdAt;
  conversation.unreadCountByUser = conversation.unreadCountByUser || {};

  const otherParticipantId = otherUserId.toString();
  const currentUnread = conversation.unreadCountByUser.get ? conversation.unreadCountByUser.get(otherParticipantId) || 0 : 0;
  conversation.unreadCountByUser.set(otherParticipantId, currentUnread + 1);

  await conversation.save();
  return message;
}

async function getConversations(userId) {
  return Conversation.find({ participants: userId })
    .populate('participants', 'name avatarUrl')
    .populate('lastMessageId', 'body createdAt senderId')
    .sort({ lastMessageAt: -1, updatedAt: -1 });
}

async function getMessages(userId, conversationId, query = {}) {
  const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  const { page = 1, limit = 50 } = query;
  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.min(100, Math.max(1, Number(limit)));

  const messages = await Message.find({ conversationId })
    .populate('senderId', 'name avatarUrl')
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  await Message.updateMany(
    { conversationId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );

  conversation.unreadCountByUser.set(userId.toString(), 0);
  await conversation.save();

  return messages.reverse();
}

async function getUnreadCount(userId) {
  const conversation = await Conversation.find({ participants: userId });
  const total = conversation.reduce((sum, item) => {
    const unread = item.unreadCountByUser && item.unreadCountByUser.get ? item.unreadCountByUser.get(userId.toString()) || 0 : 0;
    return sum + unread;
  }, 0);

  return { unreadCount: total };
}

module.exports = {
  getOrCreateConversation,
  createMessage,
  getConversations,
  getMessages,
  getUnreadCount,
};
