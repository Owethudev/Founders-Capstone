const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const AppError = require('../utils/appError');
const { requireOwner } = require('../utils/authorization');
const { pickAllowedFields } = require('../utils/validatePayload');

async function getTools(query = {}) {
  const {
    page = 1,
    limit = 20,
    category,
    isActive,
    search,
    location,
    owner,
    availability,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const filter = {};

  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (location) {
    filter.$or = [
      ...(filter.$or || []),
      { 'location.formattedAddress': { $regex: location, $options: 'i' } },
    ];
  }

  if (owner) {
    filter.ownerId = owner;
  }

  if (availability === 'available') {
    filter.isActive = true;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  if (mongoose.connection.readyState !== 1) {
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      return [];
    }

    throw new AppError('Database unavailable', 503);
  }

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.min(100, Math.max(1, Number(limit)));

  return Tool.find(filter)
    .populate('ownerId', 'name email avatarUrl reputationScore')
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .sort(sortOptions);
}

async function getToolById(id) {
  const tool = await Tool.findById(id).populate('ownerId', 'name email avatarUrl reputationScore');

  if (!tool) {
    throw new AppError('Tool not found', 404);
  }

  return tool;
}

async function createTool(ownerId, payload) {
  const allowedFields = ['title', 'description', 'category', 'subcategory', 'condition', 'priceType', 'priceAmount', 'depositAmount', 'location', 'availabilityStart', 'availabilityEnd', 'images', 'isActive'];
  const safePayload = pickAllowedFields(payload, allowedFields);

  const tool = await Tool.create({
    ...safePayload,
    ownerId,
  });

  return tool;
}

async function updateTool(ownerId, toolId, payload) {
  const tool = await Tool.findById(toolId);

  if (!tool) {
    throw new AppError('Tool not found', 404);
  }

  requireOwner(ownerId, tool.ownerId, 'You can only edit your own tools');

  const allowedUpdates = ['title', 'description', 'category', 'subcategory', 'condition', 'priceType', 'priceAmount', 'depositAmount', 'location', 'availabilityStart', 'availabilityEnd', 'images', 'isActive'];
  const filteredUpdates = pickAllowedFields(payload, allowedUpdates);

  const updatedTool = await Tool.findByIdAndUpdate(toolId, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate('ownerId', 'name email avatarUrl reputationScore');

  return updatedTool;
}

async function deleteTool(ownerId, toolId) {
  const tool = await Tool.findById(toolId);

  if (!tool) {
    throw new AppError('Tool not found', 404);
  }

  requireOwner(ownerId, tool.ownerId, 'You can only delete your own tools');

  await Tool.findByIdAndDelete(toolId);

  return { message: 'Tool deleted successfully' };
}

module.exports = {
  getTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
};
