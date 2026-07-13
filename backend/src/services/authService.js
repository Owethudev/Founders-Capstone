const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { addJob, buildEmailJobData } = require('../queue/queueManager');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('./email/mailService');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function registerUser({ name, email, password, role = 'user' }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
  });

  const token = signToken({ id: user._id, role: user.role });

  addJob('email', buildEmailJobData({
    to: user._id.toString(),
    subject: 'Welcome to Founders Capstone',
    html: `<p>Welcome ${user.name}, thanks for joining.</p>`,
    text: `Welcome ${user.name}, thanks for joining.`,
  })).catch((error) => console.warn('Welcome email queue failed', error.message));

  sendWelcomeEmail({ email: user.email, name: user.name }).catch((error) => console.warn('Welcome email send failed', error.message));

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive || user.isSuspended) {
    throw new AppError('Account is inactive or suspended', 403);
  }

  const token = signToken({ id: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
  signToken,
};
