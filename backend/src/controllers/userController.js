const userService = require('../services/userService');

async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers(req.query);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const result = await userService.deleteAccount(req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  deleteAccount,
};
