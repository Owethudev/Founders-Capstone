let Sentry;

try {
  Sentry = require('@sentry/node');
} catch (error) {
  Sentry = null;
}

function initializeMonitoring() {
  if (!process.env.SENTRY_DSN || !Sentry) {
    if (process.env.SENTRY_DSN && !Sentry) {
      console.warn('Sentry monitoring disabled because @sentry/node is not installed.');
    }
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
}

function captureException(error, context = {}) {
  if (!process.env.SENTRY_DSN || !Sentry) {
    return;
  }

  Sentry.captureException(error, { extra: context });
}

module.exports = {
  initializeMonitoring,
  captureException,
};
