const Tool = require('../models/Tool');
const BorrowRequest = require('../models/BorrowRequest');
const Notification = require('../models/Notification');

async function getDashboardData(userId) {
  const [myTools, borrowRequests, currentLoans, returnedTools, notifications, statistics] = await Promise.all([
    getMyTools(userId),
    getBorrowRequests(userId),
    getCurrentLoans(userId),
    getReturnedTools(userId),
    getNotifications(userId),
    getStatistics(userId),
  ]);

  return {
    myTools,
    borrowRequests,
    currentLoans,
    returnedTools,
    notifications,
    statistics,
  };
}

async function getMyTools(userId) {
  return Tool.find({ ownerId: userId })
    .select('title category condition isActive priceType priceAmount createdAt')
    .sort({ createdAt: -1 })
    .limit(10);
}

async function getBorrowRequests(userId) {
  return BorrowRequest.find({
    $or: [{ borrowerId: userId }, { ownerId: userId }],
  })
    .populate('toolId', 'title category')
    .select('status startDate endDate toolId borrowerId ownerId createdAt')
    .sort({ createdAt: -1 })
    .limit(10);
}

async function getCurrentLoans(userId) {
  return BorrowRequest.find({
    $or: [{ borrowerId: userId }, { ownerId: userId }],
    status: 'accepted',
  })
    .populate('toolId', 'title category')
    .select('status startDate endDate toolId borrowerId ownerId createdAt')
    .sort({ startDate: 1 })
    .limit(10);
}

async function getReturnedTools(userId) {
  return BorrowRequest.find({
    $or: [{ borrowerId: userId }, { ownerId: userId }],
    status: 'returned',
  })
    .populate('toolId', 'title category')
    .select('status startDate endDate toolId borrowerId ownerId createdAt')
    .sort({ completedAt: -1 })
    .limit(10);
}

async function getNotifications(userId) {
  return Notification.find({ recipientId: userId })
    .select('title body type isRead createdAt')
    .sort({ createdAt: -1 })
    .limit(10);
}

async function getStatistics(userId) {
  const [toolsCount, activeBorrowRequests, acceptedLoans, returnedCount, unreadNotifications] = await Promise.all([
    Tool.countDocuments({ ownerId: userId }),
    BorrowRequest.countDocuments({ $or: [{ borrowerId: userId }, { ownerId: userId }], status: 'pending' }),
    BorrowRequest.countDocuments({ $or: [{ borrowerId: userId }, { ownerId: userId }], status: 'accepted' }),
    BorrowRequest.countDocuments({ $or: [{ borrowerId: userId }, { ownerId: userId }], status: 'returned' }),
    Notification.countDocuments({ recipientId: userId, isRead: false }),
  ]);

  return {
    toolsCount,
    pendingRequests: activeBorrowRequests,
    activeLoans: acceptedLoans,
    returnedCount,
    unreadNotifications,
  };
}

module.exports = {
  getDashboardData,
  getMyTools,
  getBorrowRequests,
  getCurrentLoans,
  getReturnedTools,
  getNotifications,
  getStatistics,
};
