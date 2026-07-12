const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((error) => ({ field: error.path, message: error.msg })),
    });
  }
  next();
};

const createReviewValidation = [
  param('borrowRequestId').isMongoId().withMessage('Invalid borrow request id'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 2000 }).withMessage('Comment cannot exceed 2000 characters'),
  validate,
];

const getReviewsValidation = [
  param('ownerId').isMongoId().withMessage('Invalid owner id'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  validate,
];

module.exports = {
  createReviewValidation,
  getReviewsValidation,
};
