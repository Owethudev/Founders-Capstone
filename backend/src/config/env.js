const requiredProductionVars = ['JWT_SECRET', 'MONGODB_URI'];

function validateEnvironment() {
  const env = process.env;
  const missing = requiredProductionVars.filter((name) => !env[name]);

  if (env.NODE_ENV === 'production' && missing.length > 0) {
    throw new Error(`Missing required environment variables for production: ${missing.join(', ')}`);
  }

  if (!env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not set. Set it in your environment for production.');
  }

  if (!env.JWT_EXPIRES_IN) {
    process.env.JWT_EXPIRES_IN = '7d';
  }

  if (!env.BCRYPT_SALT_ROUNDS) {
    process.env.BCRYPT_SALT_ROUNDS = '12';
  }

  if (!env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN = 'http://localhost:5173';
  }

  return {
    isProduction: env.NODE_ENV === 'production',
  };
}

module.exports = {
  validateEnvironment,
};
