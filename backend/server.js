require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const sanitizeInput = require('./src/middleware/sanitizeInput');
const connectDB = require('./src/config/db');
const { validateEnvironment } = require('./src/config/env');
const requestLogger = require('./src/middleware/requestLogger');
const { attachMonitoring } = require('./src/middleware/monitoring');
const { initializeMonitoring } = require('./src/utils/monitoring');
const { runSmokeTest } = require('./src/utils/smokeTest');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const toolRoutes = require('./src/routes/toolRoutes');
const borrowRequestRoutes = require('./src/routes/borrowRequestRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const AppError = require('./src/utils/appError');

validateEnvironment();
initializeMonitoring();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(requestLogger);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeInput);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
attachMonitoring(app);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/borrow-requests', borrowRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Set it in your environment for production.');
}

async function startServer() {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  if (process.env.NODE_ENV === 'production') {
    setTimeout(() => {
      runSmokeTest(`http://127.0.0.1:${PORT}`)
        .then(() => console.log('Smoke test passed'))
        .catch((error) => console.error('Smoke test failed:', error.message));
    }, 2000);
  }

  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
}

module.exports = app;
