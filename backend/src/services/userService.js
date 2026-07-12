const User = require('../models/User');
const AppError = require('../utils/appError');
const { requireOwner } = require('../utils/authorization');

async function getUsers(query = {}) {
  const { page = 1, limit = 20, role, isActive, search } = query;
  const filter = {};

  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter)
    .select('-passwordHash')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  return users;
}

async function getUserById(id) {
  const user = await User.findById(id).select('-passwordHash');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}

async function updateProfile(id, updates) {
  if (!id) {
    throw new AppError('User id is required', 400);
  }

  const allowedFields = ['name', 'phone', 'avatarUrl', 'bio', 'location'];
  const filteredUpdates = {};

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  const user = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  }).select('-passwordHash');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}

async function deleteAccount(id) {
  if (!id) {
    throw new AppError('User id is required', 400);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false, isSuspended: true },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { message: 'Account deactivated successfully' };
}

module.exports = {
  getUsers,
  getUserById,
  updateProfile,
  deleteAccount,
};
