const { runSmokeTest } = require('./smokeTest');

const baseUrl = process.env.SMOKE_TEST_URL || 'http://127.0.0.1:5000';

runSmokeTest(baseUrl)
  .then(() => {
    console.log(`Smoke test passed for ${baseUrl}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`Smoke test failed for ${baseUrl}: ${error.message}`);
    process.exit(1);
  });
