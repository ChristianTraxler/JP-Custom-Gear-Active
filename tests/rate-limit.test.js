const test = require('node:test');
const assert = require('node:assert/strict');
const { createRateLimiter, clientIp } = require('../api/_lib/rate-limit.js');

test('allows max requests per window, then blocks with a retry time', () => {
  const rl = createRateLimiter({ max: 10, windowMs: 600000 });
  for (let i = 0; i < 10; i++) assert.equal(rl.check('1.1.1.1', 1000 + i).allowed, true);
  const r = rl.check('1.1.1.1', 2000);
  assert.equal(r.allowed, false);
  assert.ok(r.retryAfterSec > 0 && r.retryAfterSec <= 600);
});

test('keys are independent and the window slides', () => {
  const rl = createRateLimiter({ max: 2, windowMs: 1000 });
  assert.ok(rl.check('a', 0).allowed);
  assert.ok(rl.check('a', 10).allowed);
  assert.ok(!rl.check('a', 20).allowed);
  assert.ok(rl.check('b', 20).allowed);
  assert.ok(rl.check('a', 1001).allowed, 'first hit expired');
});

test('prune drops idle keys', () => {
  const rl = createRateLimiter({ max: 1, windowMs: 1000, maxKeys: 2 });
  rl.check('a', 0); rl.check('b', 0);
  rl.check('c', 5000); // map is full, so stale keys are pruned first
  assert.equal(rl.size(), 1);
});

test('clientIp prefers the first x-forwarded-for entry, then x-real-ip', () => {
  assert.equal(clientIp({ headers: { 'x-forwarded-for': '9.9.9.9, 10.0.0.1', 'x-real-ip': '8.8.8.8' } }), '9.9.9.9');
  assert.equal(clientIp({ headers: { 'x-real-ip': '8.8.8.8' } }), '8.8.8.8');
  assert.equal(clientIp({ headers: {}, socket: { remoteAddress: '::1' } }), '::1');
  assert.equal(clientIp({ headers: {} }), 'unknown');
});
