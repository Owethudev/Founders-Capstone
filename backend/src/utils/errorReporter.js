function reportError(error, context = {}) {
  console.error(JSON.stringify({
    level: 'error',
    message: error.message || 'Unhandled error',
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  }));
}

module.exports = { reportError };
