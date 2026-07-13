const assert = require('assert');
const { queueNames, buildCleanupJobData, buildNotificationJobData } = require('../src/queue/queueManager');

(async () => {
  assert.deepStrictEqual(queueNames, {
    email: 'email',
    notification: 'notification',
    cleanup: 'cleanup',
  });

  const notificationPayload = buildNotificationJobData({
    recipientId: 'user-1',
    type: 'message',
    title: 'Hello',
    body: 'Body',
  });

  assert.strictEqual(notificationPayload.recipientId, 'user-1');
  assert.strictEqual(notificationPayload.type, 'message');

  const cleanupPayload = buildCleanupJobData({ daysToKeep: 90 });
  assert.strictEqual(cleanupPayload.daysToKeep, 90);

  console.log('queue helpers passed');
})();
