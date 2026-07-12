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

const createBorrowRequestValidation = [
  body('toolId').isMongoId().withMessage('Invalid tool id'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('message').optional().trim().isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  body('pickupLocation').optional().trim().isLength({ max: 200 }).withMessage('Pickup location cannot exceed 200 characters'),
  validate,
];

const getBorrowRequestsValidation = [
  query('status').optional().isIn(['pending', 'accepted', 'rejected', 'returned', 'cancelled']).withMessage('Invalid status'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate,
];

const borrowRequestIdValidation = [
  param('id').isMongoId().withMessage('Invalid borrow request id'),
  validate,
];

const updateBorrowRequestStatusValidation = [
  param('id').isMongoId().withMessage('Invalid borrow request id'),
  body('status').isIn(['accepted', 'rejected', 'returned', 'cancelled']).withMessage('Invalid status'),
  body('responseMessage').optional().trim().isLength({ max: 1000 }).withMessage('Response message cannot exceed 1000 characters'),
  validate,
];

module.exports = {
  createBorrowRequestValidation,
  getBorrowRequestsValidation,
  borrowRequestIdValidation,
  updateBorrowRequestStatusValidation,
};
