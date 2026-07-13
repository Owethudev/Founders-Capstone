require('dotenv').config();

const { Queue } = require('bullmq');
const createRedisConnection = require('./src/queue/redis');
const { queueNames, buildCleanupJobData } = require('./src/queue/queueManager');

async function startScheduler() {
  const queue = new Queue(queueNames.cleanup, {
    connection: createRedisConnection(),
    prefix: '{founders-capstone}',
  });

  await queue.add(
    'daily-cleanup',
    buildCleanupJobData({ daysToKeep: 90 }),
    {
      repeat: {
        pattern: '0 0 * * *',
        tz: 'UTC',
      },
      jobId: 'daily-cleanup',
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  console.log('BullMQ scheduler started');

  return queue;
}

if (require.main === module) {
  startScheduler().catch((error) => {
    console.error('Failed to start scheduler:', error.message);
    process.exit(1);
  });
}

module.exports = {
  startScheduler,
};
