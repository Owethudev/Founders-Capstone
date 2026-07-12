const express = require('express');
const {
  getDashboard,
  getMyTools,
  getBorrowRequests,
  getCurrentLoans,
  getReturnedTools,
  getNotifications,
  getStatistics,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getDashboard);
router.get('/my-tools', protect, getMyTools);
router.get('/borrow-requests', protect, getBorrowRequests);
router.get('/current-loans', protect, getCurrentLoans);
router.get('/returned-tools', protect, getReturnedTools);
router.get('/notifications', protect, getNotifications);
router.get('/statistics', protect, getStatistics);

module.exports = router;
