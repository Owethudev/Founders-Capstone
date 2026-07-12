const express = require('express');
const { createBorrowRequest, getBorrowRequests, getBorrowRequestById, updateBorrowRequestStatus } = require('../controllers/borrowRequestController');
const { createBorrowRequestValidation, getBorrowRequestsValidation, borrowRequestIdValidation, updateBorrowRequestStatusValidation } = require('../validators/borrowRequestValidator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBorrowRequestValidation, createBorrowRequest);
router.get('/', protect, getBorrowRequestsValidation, getBorrowRequests);
router.get('/:id', protect, borrowRequestIdValidation, getBorrowRequestById);
router.patch('/:id', protect, updateBorrowRequestStatusValidation, updateBorrowRequestStatus);

module.exports = router;
