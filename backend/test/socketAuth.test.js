const assert = require('assert');
const { extractJwtFromSocketHandshake } = require('../src/socket/socketAuth');

(async () => {
  const authToken = extractJwtFromSocketHandshake({
    handshake: {
      auth: { token: 'jwt-from-auth' },
      headers: {},
    },
  });

  assert.strictEqual(authToken, 'jwt-from-auth');

  const headerToken = extractJwtFromSocketHandshake({
    handshake: {
      auth: {},
      headers: { authorization: 'Bearer jwt-from-header' },
    },
  });

  assert.strictEqual(headerToken, 'jwt-from-header');

  console.log('socket auth helpers passed');
})();
