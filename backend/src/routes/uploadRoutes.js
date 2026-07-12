const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { uploadProfilePicture, uploadToolImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/profile-picture', protect, upload.single('image'), uploadProfilePicture);
router.post('/tools/:id/images', protect, upload.array('images', 5), uploadToolImages);

module.exports = router;
