const Review = require('../models/Review');
const BorrowRequest = require('../models/BorrowRequest');
const Tool = require('../models/Tool');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { createNotification } = require('./notificationService');

async function createReview(userId, borrowRequestId, payload) {
  const { rating, comment } = payload;

  const borrowRequest = await BorrowRequest.findById(borrowRequestId);
  if (!borrowRequest) {
    throw new AppError('Borrow request not found', 404);
  }

  if (borrowRequest.borrowerId.toString() !== userId.toString()) {
    throw new AppError('Only the borrower can leave a review for the tool owner', 403);
  }

  if (borrowRequest.status !== 'returned') {
    throw new AppError('Reviews can only be created after the borrow is marked as returned', 400);
  }

  const existingReview = await Review.findOne({ borrowRequestId });
  if (existingReview) {
    throw new AppError('A review for this completed borrow already exists', 409);
  }

  const review = await Review.create({
    borrowRequestId,
    reviewerId: userId,
    revieweeId: borrowRequest.ownerId,
    rating,
    comment,
  });

  await updateOwnerRatings(borrowRequest.ownerId, borrowRequest.toolId, rating);

  await createNotification({
    recipientId: borrowRequest.ownerId,
    type: 'review',
    title: 'New review received',
    body: `You received a ${rating}-star review for your tool listing.`,
    entityType: 'Review',
    entityId: review._id,
    actionUrl: `/reviews/owner/${borrowRequest.ownerId}`,
  });

  return review;
}

async function getReviewsByOwner(ownerId, query = {}) {
  const { page = 1, limit = 10 } = query;

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.min(50, Math.max(1, Number(limit)));

  return Review.find({ revieweeId: ownerId })
    .populate('reviewerId', 'name avatarUrl')
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);
}

async function updateOwnerRatings(ownerId, toolId, rating) {
  const owner = await User.findById(ownerId);
  if (owner) {
    const previousCount = owner.reviewCount || 0;
    const previousAverage = owner.averageRating || 0;
    const nextCount = previousCount + 1;
    const nextAverage = (previousAverage * previousCount + rating) / nextCount;

    owner.averageRating = Number(nextAverage.toFixed(1));
    owner.reviewCount = nextCount;
    await owner.save();
  }

  const tool = await Tool.findById(toolId);
  if (tool) {
    const previousCount = tool.reviewCount || 0;
    const previousAverage = tool.averageRating || 0;
    const nextCount = previousCount + 1;
    const nextAverage = (previousAverage * previousCount + rating) / nextCount;

    tool.averageRating = Number(nextAverage.toFixed(1));
    tool.reviewCount = nextCount;
    await tool.save();
  }
}

module.exports = {
  createReview,
  getReviewsByOwner,
};
