function pickAllowedFields(payload, allowedFields) {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  return Object.keys(payload).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = payload[key];
    }
    return acc;
  }, {});
}

module.exports = {
  pickAllowedFields,
};
