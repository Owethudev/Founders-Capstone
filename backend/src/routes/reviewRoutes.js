const express = require('express');
const { createReview, getReviewsByOwner } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { createReviewValidation, getReviewsValidation } = require('../validators/reviewValidator');

const router = express.Router();

router.post('/:borrowRequestId', protect, createReviewValidation, createReview);
router.get('/owner/:ownerId', protect, getReviewsValidation, getReviewsByOwner);

module.exports = router;
