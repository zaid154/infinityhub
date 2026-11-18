import express from 'express';
import { getDashboardAnalytics, getCustomers } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics', protect, adminOnly, getDashboardAnalytics);
router.get('/customers', protect, adminOnly, getCustomers);

export default router;
