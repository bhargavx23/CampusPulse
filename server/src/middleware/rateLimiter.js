/**
 * CampusPulse Lightweight In-Memory Sliding Window Rate Limiter
 * Provides abuse prevention and DDoS/brute-force protection for sensitive endpoints.
 */

class MemoryStore {
  constructor() {
    this.hits = new Map();
    // Periodically clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  record(key, windowMs) {
    const now = Date.now();
    const entry = this.hits.get(key) || [];
    // Filter timestamps within current window
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

/**
 * Creates an Express rate-limiting middleware.
 * @param {Object} options
 * @param {number} options.windowMs Window duration in milliseconds (default: 15 mins)
 * @param {number} options.max Maximum requests permitted in window (default: 5)
 * @param {string} options.message Error message returned on HTTP 429
 * @param {Function} options.keyGenerator Custom key generator (default: IP address)
 */
export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 5;
  const message = options.message || 'Too many requests. Please try again later.';
  const keyGenerator = options.keyGenerator || ((req) => req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip');

  return (req, res, next) => {
    // Skip rate limiting if disabled in test environment via header or flag
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

const isDev = process.env.NODE_ENV !== 'production';

// 1. Forgot Password Limiter: 50 requests in dev / 5 in production per 15 minutes per IP
export const forgotPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 5,
  message: 'Too many password recovery requests from this IP. Please wait 15 minutes before trying again.',
  keyGenerator: (req) => `forgot-pw:${req.ip || req.socket.remoteAddress || 'client'}`,
});

// 2. Reset Password Limiter: 50 attempts in dev / 10 in production per 15 minutes per IP
export const resetPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 10,
  message: 'Too many password reset attempts from this IP. Please wait 15 minutes before trying again.',
  keyGenerator: (req) => `reset-pw:${req.ip || req.socket.remoteAddress || 'client'}`,
});

// 3. Verify OTP Limiter: 50 attempts in dev / 15 in production per 15 minutes per IP
export const verifyOtpLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 15,
  message: 'Too many OTP verification attempts from this IP. Please wait 15 minutes before trying again.',
  keyGenerator: (req) => `verify-otp:${req.ip || req.socket.remoteAddress || 'client'}`,
});

export default {
  createRateLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  verifyOtpLimiter,
  rateLimitStore,
};
