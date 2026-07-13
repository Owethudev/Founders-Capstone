require('dotenv').config();

const { createWorkers } = require('./src/queue/workers');
const createRedisConnection = require('./src/queue/redis');

async function main() {
  const workers = await createWorkers();

  const shutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down workers...`);

    await Promise.allSettled(
      Object.values(workers).map((worker) => worker.close())
    );

    const redisConnections = Object.values(workers)
      .map((worker) => worker.opts?.connection)
      .filter(Boolean);

    await Promise.allSettled(
      redisConnections.map((connection) => connection.quit())
    );

    process.exit(0);
  };

  process.on('SIGINT', () => {
    shutdown('SIGINT').catch((error) => {
      console.error('Worker shutdown error:', error.message);
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    shutdown('SIGTERM').catch((error) => {
      console.error('Worker shutdown error:', error.message);
      process.exit(1);
    });
  });

  console.log('BullMQ workers started');
}

main().catch((error) => {
  console.error('Failed to start workers:', error.message);
  process.exit(1);
});
