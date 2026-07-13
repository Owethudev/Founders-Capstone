const Notification = require('../models/Notification');
const { addJob, buildNotificationJobData } = require('../queue/queueManager');

async function createNotification({ recipientId, type, title, body, entityType = null, entityId = null, actionUrl = null }) {
  if (!recipientId) {
    return null;
  }

  const payload = buildNotificationJobData({
    recipientId,
    type,
    title,
    body,
    entityType,
    entityId,
    actionUrl,
  });

  await addJob('notification', payload, { attempts: 3, backoffDelay: 1000 });
  return { queued: true, payload };
}

async function getNotifications(userId, query = {}) {
  const { page = 1, limit = 20, isRead } = query;
  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.min(100, Math.max(1, Number(limit)));
  const filter = { recipientId: userId };

  if (isRead !== undefined) {
    filter.isRead = isRead === 'true';
  }

  return Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);
}

async function markNotificationAsRead(userId, notificationId) {
  const notification = await Notification.findOne({ _id: notificationId, recipientId: userId });
  if (!notification) {
    return null;
  }

  notification.isRead = true;
  await notification.save();
  return notification;
}

async function markAllNotificationsAsRead(userId) {
  await Notification.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
  return { updatedCount: true };
}

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
