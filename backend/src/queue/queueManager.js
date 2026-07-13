const { Queue } = require('bullmq');
const createRedisConnection = require('./redis');

let queues = null;

const queueNames = {
  email: 'email',
  notification: 'notification',
  cleanup: 'cleanup',
};

function getConnection() {
  return createRedisConnection();
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

async function addNotificationJob(data, opts = {}) {
  return addJob(queueNames.notification, data, opts);
}

async function addEmailJob(data, opts = {}) {
  return addJob(queueNames.email, data, opts);
}

async function closeQueues() {
  if (queues) {
    await Promise.allSettled(Object.values(queues).map((queue) => queue.close()));
  }
  if (scheduler) {
    await scheduler.close();
  }
}

module.exports = {
  queueNames,
  getQueues,
  getConnection,
  scheduler,
  addJob,
  addNotificationJob,
  addEmailJob,
  closeQueues,
  buildNotificationJobData,
  buildEmailJobData,
  buildCleanupJobData,
};
