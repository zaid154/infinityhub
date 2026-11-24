import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  sendRegisterOtp,
  verifyRegisterOtp,
  magicVerify,
  sendResetOtp,
  verifyResetOtp
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import {
  createIpRateLimiter,
  checkDisposableEmail
} from '../middleware/securityMiddleware.js';

const router = express.Router();

// Sliding-window IP Rate Limiter: max 10 OTP requests per hour per IP
const otpRateLimiter = createIpRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10
});

// Modern 6-Digit OTP & 1-Click Magic Link Endpoints (SaveZonix-grade)
router.post('/send-register-otp', otpRateLimiter, checkDisposableEmail, sendRegisterOtp);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/send-reset-otp', otpRateLimiter, sendResetOtp);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/magic-verify', magicVerify);

// Standard & Legacy Endpoints (Fully Backward-Compatible)
router.post('/register', otpRateLimiter, checkDisposableEmail, register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', otpRateLimiter, resendVerification);
router.post('/forgot-password', otpRateLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Authenticated User Endpoints
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
