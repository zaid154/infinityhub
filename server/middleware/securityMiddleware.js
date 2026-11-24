import crypto from 'crypto';

// Curated list of common temporary/disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', 'temp-mail.io', 'guerrillamail.com', 'guerrillamail.net',
  'guerrillamail.org', '10minutemail.com', '10minutemail.net', 'mailinator.com', 'yopmail.com',
  'yopmail.fr', 'trashmail.com', 'trashmail.net', 'sharklasers.com', 'dispostable.com',
  'throwawaymail.com', 'getnada.com', 'burnermail.io', 'fakeinbox.com', 'tempinbox.com',
  'generator.email', 'crazymailing.com', 'mohmal.com', 'mytemp.email', 'dropmail.me'
]);

/**
 * Check if the email uses a disposable / temporary email domain
 */
export function isDisposableEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * Middleware: Block requests containing disposable emails
 */
export function checkDisposableEmail(req, res, next) {
  const email = req.body && req.body.email;
  if (email && isDisposableEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Temporary or disposable email addresses are not permitted. Please use your corporate or permanent email address.'
    });
  }
  next();
}

/**
 * In-memory sliding window IP Rate Limiter for sensitive endpoints like OTP dispatch
 * Default: 10 requests per 60 minutes per client IP
 */
const ipRequestHistory = new Map();

export function createIpRateLimiter({ windowMs = 60 * 60 * 1000, maxRequests = 10 } = {}) {
  // Periodically clean up stale records every 15 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of ipRequestHistory.entries()) {
      const active = timestamps.filter(t => now - t < windowMs);
      if (active.length === 0) {
        ipRequestHistory.delete(ip);
      } else {
        ipRequestHistory.set(ip, active);
      }
    }
  }, 15 * 60 * 1000).unref();

  return function (req, res, next) {
    const clientIp = (
      req.headers['x-forwarded-for'] ||
      req.headers['cf-connecting-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'unknown-ip'
    ).toString().split(',')[0].trim();

    const now = Date.now();
    const timestamps = (ipRequestHistory.get(clientIp) || []).filter(t => now - t < windowMs);

    if (timestamps.length >= maxRequests) {
      const oldest = timestamps[0];
      const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
      return res.status(429).json({
        success: false,
        error: `Too many verification requests from this network. Please wait ${Math.ceil(retryAfterSec / 60)} minutes before trying again.`
      });
    }

    timestamps.push(now);
    ipRequestHistory.set(clientIp, timestamps);
    next();
  };
}

/**
 * Compute HMAC-SHA256 hash using the server pepper secret.
 * Prevents rainbow-table cracking of 6-digit OTPs even if the DB is compromised.
 */
export function hashWithPepper(data) {
  const pepper = process.env.OTP_SECRET || process.env.JWT_SECRET || 'demoinfotech_pepper_secret_2026_x9k2';
  return crypto.createHmac('sha256', pepper).update(String(data)).digest('hex');
}

/**
 * Generate a 6-digit numeric OTP code
 */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a cryptographically secure random token (e.g. for 1-Click Magic Links)
 */
export function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}
