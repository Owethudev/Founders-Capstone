const http = require('http');

function runSmokeTest(baseUrl) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${baseUrl}/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ ok: true, body: data });
        } else {
          reject(new Error(`Health check failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
  });
}

module.exports = { runSmokeTest };
