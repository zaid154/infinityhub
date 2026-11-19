import express from 'express';
import { getDashboardAnalytics, getCustomers, toggleBlockCustomer } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics', protect, adminOnly, getDashboardAnalytics);
router.get('/customers', protect, adminOnly, getCustomers);
router.put('/customers/:id/block', protect, adminOnly, toggleBlockCustomer);

export default router;
