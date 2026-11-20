import express from 'express';
import {
  verifyPayment,
  handleRazorpayWebhook,
  getPaymentAuditLogs
} from '../controllers/payment.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Customer/Admin payment verification
router.post('/verify', protect, verifyPayment);

// Server-to-server cryptographically verified webhook
router.post('/webhook', handleRazorpayWebhook);

// Admin-only financial audit trails & anomaly detection
router.get('/audit-logs', protect, adminOnly, getPaymentAuditLogs);

export default router;
