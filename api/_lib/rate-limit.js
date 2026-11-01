'use strict';

// Best-effort per-visitor limiter. State is an in-memory Map, so it is PER FUNCTION
// INSTANCE: Fluid Compute reuses instances across requests, which makes this meaningful,
// but it is not global across instances or regions. Pair with a Vercel firewall rate
// limit rule for a hard cap.
function createRateLimiter({ max, windowMs, maxKeys = 5000 }) {
  const hits = new Map(); // key -> array of timestamps within the window

  function prune(now) {
    for (const [key, times] of hits) {
      if (!times.length || now - times[times.length - 1] >= windowMs) hits.delete(key);
    }
  }

  // Returns { allowed, retryAfterSec }. Counts the request only when allowed.
  function check(key, now = Date.now()) {
    if (hits.size >= maxKeys) prune(now);
    const times = (hits.get(key) || []).filter(t => now - t < windowMs);
    if (times.length >= max) {
      hits.set(key, times);
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((times[0] + windowMs - now) / 1000)) };
    }
    times.push(now);
    hits.set(key, times);
    return { allowed: true, retryAfterSec: 0 };
  }

  return { check, prune, size: () => hits.size };
}

// First entry of x-forwarded-for, else x-real-ip, else the socket address.
function clientIp(req) {
  const h = (req && req.headers) || {};
  const xff = h['x-forwarded-for'];
  const first = (Array.isArray(xff) ? xff[0] : String(xff || '')).split(',')[0].trim();
  const real = Array.isArray(h['x-real-ip']) ? h['x-real-ip'][0] : h['x-real-ip'];
  return first || String(real || '').trim() || (req && req.socket && req.socket.remoteAddress) || 'unknown';
}

module.exports = { createRateLimiter, clientIp };
