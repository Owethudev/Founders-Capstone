function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === 'object') {
    const sanitized = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      if (typeof key === 'string' && (key.startsWith('$') || key.includes('.'))) {
        continue;
      }

      sanitized[key] = sanitizeValue(nestedValue);
    }

    return sanitized;
  }

  if (typeof value === 'string') {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  return value;
}

function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    req.body = sanitizeValue(req.body);
  }

  next();
}

module.exports = sanitizeInput;
