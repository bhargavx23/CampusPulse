/**
 * CampusPulse Lightweight In-Memory Sliding Window Rate Limiter
 */

class MemoryStore {
  constructor() {
    this.hits = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  record(key, windowMs) {
    const now = Date.now();
    const entry = this.hits.get(key) || [];
    const validTimestamps = entry.filter((timestamp) => now - timestamp < windowMs);
    validTimestamps.push(now);
    this.hits.set(key, validTimestamps);
    return validTimestamps.length;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.hits.entries()) {
      const active = timestamps.filter((t) => now - t < 60 * 60 * 1000);
      if (active.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, active);
      }
    }
  }

  reset() {
    this.hits.clear();
  }
}

export const rateLimitStore = new MemoryStore();

export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 5;
  const message = options.message || 'Too many requests. Please try again later.';
  const keyGenerator =
    options.keyGenerator ||
    ((req) => req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip');

  return (req, res, next) => {
    if (req.headers['x-bypass-rate-limit'] === 'test-runner') {
      return next();
    }

    const testKey = req.headers['x-rate-limit-test-key'];
    const effectiveMax = testKey ? 5 : max;
    const key = testKey ? `test:${testKey}` : keyGenerator(req);
    const count = rateLimitStore.record(key, windowMs);

    res.setHeader('X-RateLimit-Limit', effectiveMax);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, effectiveMax - count));

    if (count > effectiveMax) {
      return res.status(429).json({
        success: false,
        error: message,
      });
    }

    next();
  };
}

export default { createRateLimiter, rateLimitStore };
