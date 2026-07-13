const { Worker } = require('bullmq');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { queueNames } = require('./queueManager');
const createRedisConnection = require('./redis');
const { sendMail } = require('../services/email/mailService');

function buildLogger(prefix) {
  return {
    info: (message, meta = {}) => console.info(`[${prefix}] ${message}`, meta),
    error: (message, meta = {}) => console.error(`[${prefix}] ${message}`, meta),
  };
}

async function createWorkers() {
  const logger = buildLogger('bullmq');

  const notificationWorker = new Worker(
    queueNames.notification,
    async (job) => {
      logger.info('processing notification job', { jobId: job.id, data: job.data });
      try {
        await Notification.create({
          recipientId: job.data.recipientId,
          type: job.data.type,
          title: job.data.title,
          body: job.data.body,
          entityType: job.data.entityType,
          entityId: job.data.entityId,
          actionUrl: job.data.actionUrl,
        });
      } catch (error) {
        logger.error('notification persistence failed', { jobId: job.id, error: error.message });
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  const emailWorker = new Worker(
    queueNames.email,
    async (job) => {
      logger.info('processing email job', { jobId: job.id, data: job.data });
      const recipient = job.data.to;
      let recipientEmail = typeof recipient === 'string' && recipient.includes('@')
        ? recipient
        : null;

      if (!recipientEmail) {
        const user = await User.findById(recipient).lean();
        recipientEmail = user?.email || null;
      }

      if (!recipientEmail) {
        throw new Error('Recipient email not found');
      }

      try {
        await sendMail({
          to: recipientEmail,
          subject: job.data.subject,
          html: job.data.html,
          text: job.data.text || '',
        });
        logger.info('email job complete', { to: recipientEmail });
      } catch (error) {
        logger.error('email send failed', { to: recipientEmail, error: error.message });
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 2,
    }
  );

  const cleanupWorker = new Worker(
    queueNames.cleanup,
    async (job) => {
      logger.info('running cleanup job', { jobId: job.id, daysToKeep: job.data.daysToKeep });
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (job.data.daysToKeep || 90));
      await Notification.deleteMany({ createdAt: { $lt: cutoffDate }, isRead: true });
      logger.info('cleanup job complete', { cutoffDate });
    },
    {
      connection: createRedisConnection(),
      concurrency: 1,
    }
  );

  const attachLifecycleListeners = (worker, workerName) => {
    worker.on('completed', (job) => {
      logger.info(`${workerName} job completed`, { jobId: job.id });
    });

    worker.on('failed', (job, error) => {
      logger.error(`${workerName} job failed`, { jobId: job?.id, error: error.message });
    });

    worker.on('error', (error) => {
      logger.error(`${workerName} worker error`, { error: error.message });
    });

    worker.on('ready', () => {
      logger.info(`${workerName} worker ready`);
    });
  };

  attachLifecycleListeners(notificationWorker, 'notification');
  attachLifecycleListeners(emailWorker, 'email');
  attachLifecycleListeners(cleanupWorker, 'cleanup');

  return { notificationWorker, emailWorker, cleanupWorker };
}

module.exports = {
  createWorkers,
};
