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

const getToolByIdValidation = [
  param('id').isMongoId().withMessage('Invalid tool id'),
  validate,
];

const createToolValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 120 }).withMessage('Title must be between 3 and 120 characters'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('priceType').optional().isIn(['free', 'hourly', 'daily', 'negotiable']).withMessage('Invalid price type'),
  body('priceAmount').optional().isFloat({ min: 0 }).withMessage('Price amount must be a non-negative number'),
  body('depositAmount').optional().isFloat({ min: 0 }).withMessage('Deposit amount must be a non-negative number'),
  body('condition').optional().isIn(['new', 'excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  validate,
];

const updateToolValidation = [
  param('id').isMongoId().withMessage('Invalid tool id'),
  body('title').optional().trim().isLength({ min: 3, max: 120 }).withMessage('Title must be between 3 and 120 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('priceType').optional().isIn(['free', 'hourly', 'daily', 'negotiable']).withMessage('Invalid price type'),
  body('priceAmount').optional().isFloat({ min: 0 }).withMessage('Price amount must be a non-negative number'),
  body('depositAmount').optional().isFloat({ min: 0 }).withMessage('Deposit amount must be a non-negative number'),
  body('condition').optional().isIn(['new', 'excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  validate,
];

const getToolsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().trim().notEmpty(),
  query('location').optional().trim().notEmpty(),
  query('owner').optional().isMongoId().withMessage('Owner must be a valid MongoDB id'),
  query('availability').optional().isIn(['available']).withMessage('Availability must be available'),
  query('sortBy').optional().isIn(['createdAt', 'priceAmount', 'title', 'averageRating']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
  query('isActive').optional().isIn(['true', 'false']).withMessage('isActive must be true or false'),
  validate,
];

module.exports = {
  getToolsValidation,
  getToolByIdValidation,
  createToolValidation,
  updateToolValidation,
};
