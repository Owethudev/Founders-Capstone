const reviewService = require('../services/reviewService');

async function createReview(req, res, next) {
  try {
    const review = await reviewService.createReview(req.user._id, req.params.borrowRequestId, req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

async function getReviewsByOwner(req, res, next) {
  try {
    const reviews = await reviewService.getReviewsByOwner(req.params.ownerId, req.query);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReview,
  getReviewsByOwner,
};
