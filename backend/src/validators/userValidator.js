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

const getUserByIdValidation = [
  param('id').isMongoId().withMessage('Invalid user id'),
  validate,
];

const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().trim().isLength({ min: 7, max: 20 }).withMessage('Phone number must be between 7 and 20 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('avatarUrl').optional().isURL().withMessage('Avatar URL must be a valid URL'),
  validate,
];

const getUsersValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['user', 'moderator', 'admin']).withMessage('Invalid role'),
  query('isActive').optional().isIn(['true', 'false']).withMessage('isActive must be true or false'),
  validate,
];

module.exports = {
  getUsersValidation,
  getUserByIdValidation,
  updateProfileValidation,
};
