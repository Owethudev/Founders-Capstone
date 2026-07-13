const BorrowRequest = require('../models/BorrowRequest');
const Tool = require('../models/Tool');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { requireOwner } = require('../utils/authorization');
const { pickAllowedFields } = require('../utils/validatePayload');
const { createNotification } = require('./notificationService');
const { sendBorrowRequestReceivedEmail, sendBorrowRequestAcceptedEmail, sendToolReturnedEmail } = require('./email/mailService');

async function createBorrowRequest(borrowerId, payload) {
  const safePayload = pickAllowedFields(payload, ['toolId', 'startDate', 'endDate', 'message', 'pickupLocation']);
  const { toolId, startDate, endDate, message, pickupLocation } = safePayload;

  const tool = await Tool.findById(toolId);
  if (!tool) {
    throw new AppError('Tool not found', 404);
  }

  if (!tool.isActive) {
    throw new AppError('This tool is not currently available', 400);
  }

  if (tool.ownerId.toString() === borrowerId.toString()) {
    throw new AppError('You cannot borrow your own tool', 403);
  }

  const existingRequest = await BorrowRequest.findOne({
    toolId,
    borrowerId,
    status: { $in: ['pending', 'accepted'] },
  });

  if (existingRequest) {
    throw new AppError('You already have a pending or accepted request for this tool', 409);
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new AppError('End date must be after start date', 400);
  }

  const borrowRequest = await BorrowRequest.create({
    toolId,
    borrowerId,
    ownerId: tool.ownerId,
    startDate,
    endDate,
    message,
    pickupLocation,
    totalAmount: tool.priceAmount || 0,
    depositAmount: tool.depositAmount || 0,
  });

  await createNotification({
    recipientId: tool.ownerId,
    type: 'borrow_request',
    title: 'New borrow request',
    body: `A borrower requested to borrow your tool: ${tool.title}`,
    entityType: 'BorrowRequest',
    entityId: borrowRequest._id,
    actionUrl: `/borrow-requests/${borrowRequest._id}`,
  });

  const borrower = await User.findById(borrowerId).select('name email');
  if (borrower) {
    sendBorrowRequestReceivedEmail(borrower, { toolName: tool.title }).catch((error) => console.warn('Borrow request received email failed', error.message));
  }

  return borrowRequest;
}

async function getBorrowRequests(userId, query = {}) {
  const { status, page = 1, limit = 20 } = query;
  const filter = {
    $or: [{ borrowerId: userId }, { ownerId: userId }],
  };

  if (status) {
    filter.status = status;
  }

  return BorrowRequest.find(filter)
    .populate('toolId', 'title category priceType priceAmount depositAmount')
    .populate('borrowerId', 'name email avatarUrl')
    .populate('ownerId', 'name email avatarUrl')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
}

async function getBorrowRequestById(userId, requestId) {
  const borrowRequest = await BorrowRequest.findById(requestId)
    .populate('toolId', 'title category priceType priceAmount depositAmount')
    .populate('borrowerId', 'name email avatarUrl')
    .populate('ownerId', 'name email avatarUrl');

  if (!borrowRequest) {
    throw new AppError('Borrow request not found', 404);
  }

  if (borrowRequest.borrowerId._id.toString() !== userId.toString() && borrowRequest.ownerId._id.toString() !== userId.toString()) {
    throw new AppError('You do not have access to this borrow request', 403);
  }

  return borrowRequest;
}

async function updateBorrowRequestStatus(userId, requestId, payload) {
  const { status, responseMessage } = payload;
  const borrowRequest = await BorrowRequest.findById(requestId);

  if (!borrowRequest) {
    throw new AppError('Borrow request not found', 404);
  }

  requireOwner(userId, borrowRequest.ownerId, 'Only the tool owner can change the request status');

  const allowedStatuses = ['accepted', 'rejected', 'returned', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    throw new AppError('Invalid status transition', 400);
  }

  if (borrowRequest.status === 'cancelled' || borrowRequest.status === 'returned') {
    throw new AppError('This borrow request is already closed', 400);
  }

  if (status === 'accepted' && borrowRequest.status !== 'pending') {
    throw new AppError('Only pending requests can be accepted', 400);
  }

  if (status === 'rejected' && borrowRequest.status !== 'pending') {
    throw new AppError('Only pending requests can be rejected', 400);
  }

  if (status === 'returned' && borrowRequest.status !== 'accepted') {
    throw new AppError('Only accepted requests can be marked as returned', 400);
  }

  if (status === 'cancelled') {
    if (borrowRequest.status === 'accepted') {
      throw new AppError('Accepted requests cannot be cancelled directly', 400);
    }
  }

  borrowRequest.status = status;
  borrowRequest.responseMessage = responseMessage || borrowRequest.responseMessage;

  if (status === 'accepted') {
    borrowRequest.acceptedAt = new Date();
  }

  if (status === 'returned') {
    borrowRequest.completedAt = new Date();
  }

  await borrowRequest.save();

  const statusText = {
    accepted: 'accepted',
    rejected: 'rejected',
    returned: 'returned',
  };

  if (statusText[status]) {
    await createNotification({
      recipientId: borrowRequest.borrowerId,
      type: 'borrow_request',
      title: `Borrow request ${statusText[status]}`,
      body: `Your borrow request for ${borrowRequest.toolId} was ${statusText[status]}.`,
      entityType: 'BorrowRequest',
      entityId: borrowRequest._id,
      actionUrl: `/borrow-requests/${borrowRequest._id}`,
    });

    const borrower = await User.findById(borrowRequest.borrowerId).select('name email');
    const tool = await Tool.findById(borrowRequest.toolId).select('title');

    if (borrower && tool) {
      if (status === 'accepted') {
        sendBorrowRequestAcceptedEmail(borrower, { toolName: tool.title }).catch((error) => console.warn('Borrow request accepted email failed', error.message));
      }

      if (status === 'returned') {
        sendToolReturnedEmail(borrower, { name: tool.title }).catch((error) => console.warn('Tool returned email failed', error.message));
      }
    }
  }

  return borrowRequest;
}

module.exports = {
  createBorrowRequest,
  getBorrowRequests,
  getBorrowRequestById,
  updateBorrowRequestStatus,
};
