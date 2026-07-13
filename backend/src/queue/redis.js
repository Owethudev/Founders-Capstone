const IORedis = require('ioredis');
require('dotenv').config();

function createRedisConnection() {
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST || 'redis://127.0.0.1:6379';

  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  connection.on('connect', () => {
    console.log('✅ Redis Connected');
  });

  connection.on('ready', () => {
    console.log('✅ Redis Ready');
  });

  connection.on('error', (error) => {
    console.error('❌ Redis Error:', error.message);
  });

  connection.on('close', () => {
    console.log('Redis Closed');
  });

  return connection;
}

module.exports = createRedisConnection;
