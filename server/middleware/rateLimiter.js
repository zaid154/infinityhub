// Simple, high-performance in-memory sliding window rate limiter
const ipRequestCounts = new Map();

// Periodic cleanup every 10 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipRequestCounts.entries()) {
    if (now > record.resetTime) {
      ipRequestCounts.delete(key);
    }
  }
}, 10 * 60 * 1000);

export const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 15, message = 'Too many requests from this IP. Please try again shortly.' } = {}) => {
  return (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString();
    const key = `${ip}:${req.baseUrl || req.path}`;
    const now = Date.now();

    let record = ipRequestCounts.get(key);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      ipRequestCounts.set(key, record);
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      const waitSeconds = Math.ceil((record.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        message: `${message} (Try again in ${waitSeconds}s)`
      });
    }

    next();
  };
};
