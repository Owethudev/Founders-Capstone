const jwt = require('jsonwebtoken');

function extractJwtFromSocketHandshake(socket) {
  const authToken = socket?.handshake?.auth?.token;
  if (authToken) {
    return authToken;
  }

  const headerValue = socket?.handshake?.headers?.authorization || '';
  if (typeof headerValue === 'string' && headerValue.startsWith('Bearer ')) {
    return headerValue.slice(7).trim();
  }

  return null;
}

async function authenticateSocket(socket, next) {
  const token = extractJwtFromSocketHandshake(socket);

  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    return next();
  } catch (error) {
    return next(new Error('Authentication error'));
  }
}

module.exports = {
  authenticateSocket,
  extractJwtFromSocketHandshake,
};
