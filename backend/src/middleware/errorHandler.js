const { reportError } = require('../utils/errorReporter');
const { captureException } = require('../utils/monitoring');

function errorHandler(err, req, res, next) {
  reportError(err, {
    path: req.originalUrl,
    method: req.method,
    requestId: req.requestId,
  });
  captureException(err, {
    path: req.originalUrl,
    method: req.method,
    requestId: req.requestId,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
