const { Queue } = require('bullmq');
const IORedis = require('ioredis');

let connection = null;
let queues = null;

function normalizeRedisUrl() {
  const rawUrl = process.env.REDIS_URL || process.env.REDIS_HOST || 'redis://127.0.0.1:6379';
  const trimmedUrl = rawUrl.trim();

  if (!trimmedUrl) {
    return 'redis://127.0.0.1:6379';
  }

  if (trimmedUrl.startsWith('rediss://')) {
    return trimmedUrl.replace('rediss://', 'redis://');
  }

  return trimmedUrl;
}

const queueNames = {
  email: 'email',
  notification: 'notification',
  cleanup: 'cleanup',
};

function getConnection() {
  if (!connection) {
    const redisUrl = normalizeRedisUrl();
    console.log('Redis URL:', redisUrl);

    connection = new IORedis(redisUrl);

    connection.on('connect', () => {
      console.log('✅ Redis Connected');
    });

    connection.on('ready', () => {
      console.log('✅ Redis Ready');
    });

    connection.on('error', (err) => {
      console.error('❌ Redis Error:', err.message);
    });

    connection.on('close', () => {
      console.log('Redis Closed');
    });
  }

  return connection;
}

function getQueues() {
  if (!queues) {
    const redisConnection = getConnection();
    queues = {
      email: new Queue(queueNames.email, { connection: redisConnection, prefix: '{founders-capstone}' }),
      notification: new Queue(queueNames.notification, { connection: redisConnection, prefix: '{founders-capstone}' }),
      cleanup: new Queue(queueNames.cleanup, { connection: redisConnection, prefix: '{founders-capstone}' }),
    };
  }

  return queues;
}

const scheduler = null;

function buildNotificationJobData(payload) {
  return {
    recipientId: payload.recipientId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    entityType: payload.entityType || null,
    entityId: payload.entityId || null,
    actionUrl: payload.actionUrl || null,
    createdAt: new Date().toISOString(),
  };
}

function buildEmailJobData(payload) {
  return {
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text || '',
    createdAt: new Date().toISOString(),
  };
}

function buildCleanupJobData(payload = {}) {
  return {
    daysToKeep: payload.daysToKeep || 90,
    createdAt: new Date().toISOString(),
  };
}

async function addJob(queueName, data, opts = {}) {
  const queue = getQueues()[queueName];
  if (!queue) {
    throw new Error(`Unknown queue: ${queueName}`);
  }

  try {
    return await queue.add(queueName, data, {
      attempts: opts.attempts || 3,
      backoff: {
        type: 'exponential',
        delay: opts.backoffDelay || 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
      ...opts,
    });
  } catch (error) {
    console.error('Queue Error:', error);
    throw error;
  }
}

async function closeQueues() {
  if (queues) {
    await Promise.allSettled(Object.values(queues).map((queue) => queue.close()));
  }
  if (scheduler) {
    await scheduler.close();
  }
  if (connection) {
    await connection.quit();
  }
}

module.exports = {
  connection: getConnection,
  queueNames,
  getQueues,
  getConnection,
  scheduler,
  addJob,
  closeQueues,
  buildNotificationJobData,
  buildEmailJobData,
  buildCleanupJobData,
};
