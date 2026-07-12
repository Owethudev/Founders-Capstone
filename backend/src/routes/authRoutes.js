const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ success: true, message: 'Admin access granted' });
});

module.exports = router;
