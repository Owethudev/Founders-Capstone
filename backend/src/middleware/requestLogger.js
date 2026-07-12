function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  console.info(JSON.stringify({
    level: 'info',
    event: 'request',
    requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
  }));

  res.on('finish', () => {
    console.info(JSON.stringify({
      level: 'info',
      event: 'response',
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    }));
  });

  next();
}

module.exports = requestLogger;
