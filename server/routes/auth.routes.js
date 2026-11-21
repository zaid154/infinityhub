import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Anti-bot rate limiters:
// Max 10 registrations per IP per 15 minutes
const registerLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many registration requests from this network. Please wait a few minutes before trying again.'
});

// Max 6 resend requests per IP per 15 minutes
const resendLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: 'Too many verification email requests. Please wait a few moments.'
});

// Max 15 login attempts per IP per 15 minutes to deter brute force
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many sign-in attempts. Please wait a few minutes before trying again.'
});

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendLimiter, resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
