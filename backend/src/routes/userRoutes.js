const express = require('express');
const { getUsers, getUserById, updateProfile, deleteAccount } = require('../controllers/userController');
const { getUsersValidation, getUserByIdValidation, updateProfileValidation } = require('../validators/userValidator');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsersValidation, getUsers);
router.get('/:id', protect, getUserByIdValidation, getUserById);
router.patch('/me', protect, updateProfileValidation, updateProfile);
router.delete('/me', protect, deleteAccount);

module.exports = router;
