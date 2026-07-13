const { Server } = require('socket.io');
const { authenticateSocket } = require('./socketAuth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const messageService = require('../services/messageService');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 20000,
    pingInterval: 10000,
  });

  const connectedUsers = new Map();

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    connectedUsers.set(userId, {
      socketId: socket.id,
      connectedAt: new Date(),
    });

    socket.join(`user:${userId}`);
    socket.broadcast.emit('presence:update', { userId, status: 'online' });

    socket.on('join:conversation', async (conversationId) => {
      if (!conversationId) {
        return;
      }

      socket.join(`conversation:${conversationId}`);
      socket.emit('conversation:joined', { conversationId });
    });

    socket.on('message:send', async (payload) => {
      try {
        const { recipientId, body, attachments = [] } = payload || {};
        if (!recipientId || !body) {
          socket.emit('message:error', { message: 'Recipient and message body are required' });
          return;
        }

        const message = await messageService.createMessage(userId, recipientId, { body, attachments });
        const conversation = await Conversation.findById(message.conversationId);
        const conversationId = conversation?._id?.toString();

        const populatedMessage = await Message.findById(message._id).populate('senderId', 'name avatarUrl');

        io.to(`conversation:${conversationId}`).emit('message:new', {
          conversationId,
          message: populatedMessage,
        });

        const recipientSocket = connectedUsers.get(recipientId.toString());
        if (recipientSocket) {
          io.to(recipientSocket.socketId).emit('notification:new', {
            type: 'message',
            title: 'New message',
            body: body.slice(0, 80),
            conversationId,
          });
        } else {
          await Notification.create({
            recipientId,
            type: 'message',
            title: 'New message',
            body: body.slice(0, 80),
            entityType: 'conversation',
            entityId: conversationId,
          });
        }

        socket.emit('message:sent', { conversationId, message: populatedMessage });
      } catch (error) {
        socket.emit('message:error', { message: error.message || 'Unable to send message' });
      }
    });

    socket.on('message:read', async ({ conversationId, messageIds = [] }) => {
      try {
        if (!conversationId) {
          return;
        }

        await Message.updateMany(
          { _id: { $in: messageIds }, conversationId, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );

        socket.to(`conversation:${conversationId}`).emit('message:read', {
          conversationId,
          userId,
          messageIds,
        });
      } catch (error) {
        socket.emit('message:error', { message: error.message || 'Unable to mark messages as read' });
      }
    });

    socket.on('typing:start', ({ conversationId }) => {
      if (!conversationId) {
        return;
      }
      socket.to(`conversation:${conversationId}`).emit('typing:start', { conversationId, userId });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      if (!conversationId) {
        return;
      }
      socket.to(`conversation:${conversationId}`).emit('typing:stop', { conversationId, userId });
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      socket.broadcast.emit('presence:update', { userId, status: 'offline' });
    });
  });

  return io;
}

module.exports = {
  initializeSocket,
};
