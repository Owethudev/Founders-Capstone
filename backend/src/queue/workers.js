const { Worker } = require('bullmq');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { connection, queueNames } = require('./queueManager');

function buildLogger(prefix) {
  return {
    info: (message, meta = {}) => console.info(`[${prefix}] ${message}`, meta),
    error: (message, meta = {}) => console.error(`[${prefix}] ${message}`, meta),
  };
}

function createWorkers() {
  const logger = buildLogger('bullmq');

  const notificationWorker = new Worker(
    queueNames.notification,
    async (job) => {
      logger.info('processing notification job', { jobId: job.id, data: job.data });
      await Notification.create({
        recipientId: job.data.recipientId,
        type: job.data.type,
        title: job.data.title,
        body: job.data.body,
        entityType: job.data.entityType,
        entityId: job.data.entityId,
        actionUrl: job.data.actionUrl,
      });
    },
    { connection, concurrency: 5 }
  );

  const emailWorker = new Worker(
    queueNames.email,
    async (job) => {
      logger.info('processing email job', { jobId: job.id, data: job.data });
      const user = await User.findById(job.data.to).lean();
      if (!user) {
        throw new Error('Recipient user not found');
      }
      logger.info('email job complete', { to: user.email });
    },
    { connection, concurrency: 2 }
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
    { connection, concurrency: 1 }
  );

  notificationWorker.on('failed', (job, err) => logger.error('notification worker failed', { jobId: job?.id, error: err.message }));
  emailWorker.on('failed', (job, err) => logger.error('email worker failed', { jobId: job?.id, error: err.message }));
  cleanupWorker.on('failed', (job, err) => logger.error('cleanup worker failed', { jobId: job?.id, error: err.message }));

  return { notificationWorker, emailWorker, cleanupWorker };
}

module.exports = {
  createWorkers,
};
