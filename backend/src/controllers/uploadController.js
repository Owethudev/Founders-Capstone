const uploadService = require('../services/uploadService');
const User = require('../models/User');
const Tool = require('../models/Tool');
const AppError = require('../utils/appError');

async function uploadProfilePicture(req, res, next) {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided', 400));
    }

    const result = await uploadService.uploadToCloudinary(req.file.buffer, 'toolsharing/profile-pictures');

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: result.secure_url },
      { new: true }
    ).select('-passwordHash');

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function uploadToolImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No image files provided', 400));
    }

    const uploadResults = await Promise.all(
      req.files.map((file) => uploadService.uploadToCloudinary(file.buffer, 'toolsharing/tool-images'))
    );

    const imageUrls = uploadResults.map((result) => result.secure_url);

    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      throw new AppError('Tool not found', 404);
    }

    if (tool.ownerId.toString() !== req.user._id.toString()) {
      throw new AppError('You can only upload images for your own tools', 403);
    }

    tool.images = [...tool.images, ...imageUrls];
    await tool.save();

    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadProfilePicture,
  uploadToolImages,
};
