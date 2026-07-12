const AppError = require('./appError');

function requireOwner(userId, resourceOwnerId, message = 'You do not have permission to access this resource') {
  if (!userId || !resourceOwnerId) {
    throw new AppError(message, 403);
  }

  if (userId.toString() !== resourceOwnerId.toString()) {
    throw new AppError(message, 403);
  }
}

module.exports = {
  requireOwner,
};
