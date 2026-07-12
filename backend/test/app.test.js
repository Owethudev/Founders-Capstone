const assert = require('assert');
const http = require('http');
const { once } = require('events');

const app = require('../server');

async function startTestServer() {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  return { server, port };
}

async function requestJson(port, path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body: data });
        });
      }
    );

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

(async () => {
  const { server, port } = await startTestServer();

  try {
    const health = await requestJson(port, '/health');
    assert.strictEqual(health.statusCode, 200);

    const healthz = await requestJson(port, '/healthz');
    assert.strictEqual(healthz.statusCode, 200);

    const invalidRegister = await requestJson(port, '/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { name: '', email: 'bad', password: '123' },
    });
    assert.strictEqual(invalidRegister.statusCode, 400);

    const tools = await requestJson(port, '/api/tools');
    assert.strictEqual(tools.statusCode, 200);

    const protectedProfile = await requestJson(port, '/api/users/me', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: { name: 'Test User' },
    });
    assert.strictEqual(protectedProfile.statusCode, 401);

    const dashboardWithoutAuth = await requestJson(port, '/api/dashboard');
    assert.strictEqual(dashboardWithoutAuth.statusCode, 401);

    const missingRoute = await requestJson(port, '/api/does-not-exist');
    assert.strictEqual(missingRoute.statusCode, 404);
    const missingRouteBody = JSON.parse(missingRoute.body);
    assert.strictEqual(missingRouteBody.success, false);
    assert.match(missingRouteBody.message, /not found/i);

    console.log('backend smoke tests passed');
  } finally {
    server.close();
  }
})();
