const { Queue } = require('bullmq');
const IORedis = require('ioredis');

let connection = null;
let queues = null;

const queueNames = {
  email: 'email',
  notification: 'notification',
  cleanup: 'cleanup',
};

function getConnection() {
  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: null,
      enableOfflineQueue: true,
      connectTimeout: 1000,
      commandTimeout: 1000,
    });
  }

  return connection;
}

function getQueues() {
  if (!queues) {
    const redisConnection = getConnection();
    queues = {
      email: new Queue(queueNames.email, { connection: redisConnection }),
      notification: new Queue(queueNames.notification, { connection: redisConnection }),
      cleanup: new Queue(queueNames.cleanup, { connection: redisConnection }),
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

  return queue.add(queueName, data, {
    attempts: opts.attempts || 3,
    backoff: {
      type: 'exponential',
      delay: opts.backoffDelay || 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
    ...opts,
  });
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
