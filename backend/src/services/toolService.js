const Tool = require('../models/Tool');
const AppError = require('../utils/appError');

async function getTools(query = {}) {
  const { page = 1, limit = 20, category, isActive, search } = query;
  const filter = {};

  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  return Tool.find(filter)
    .populate('ownerId', 'name email avatarUrl reputationScore')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
}

async function getToolById(id) {
  const tool = await Tool.findById(id).populate('ownerId', 'name email avatarUrl reputationScore');

  if (!tool) {
    throw new AppError('Tool not found', 404);
  }

  return tool;
}

async function createTool(ownerId, payload) {
  const tool = await Tool.create({
    ...payload,
    ownerId,
  });

  return tool;
}

async function updateTool(ownerId, toolId, payload) {
  const tool = await Tool.findById(toolId);

  if (!tool) {
    throw new AppError('Tool not found', 404);
  }

  if (tool.ownerId.toString() !== ownerId.toString()) {
    throw new AppError('You can only edit your own tools', 403);
  }

  const allowedUpdates = ['title', 'description', 'category', 'subcategory', 'condition', 'priceType', 'priceAmount', 'depositAmount', 'location', 'availabilityStart', 'availabilityEnd', 'images', 'isActive'];
  const filteredUpdates = {};

  Object.keys(payload).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      filteredUpdates[key] = payload[key];
    }
  });

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

  if (tool.ownerId.toString() !== ownerId.toString()) {
    throw new AppError('You can only delete your own tools', 403);
  }

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
