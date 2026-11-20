import express from 'express';
import {
  getCustomerDemands,
  updateCustomerDemand,
  deleteCustomerDemand,
  logSearchQuery
} from '../controllers/demand.controller.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public route to log catalog searches (authenticated if user has token)
router.post('/log-search', optionalAuth, logSearchQuery);

// Admin-only routes
router.get('/', protect, adminOnly, getCustomerDemands);
router.put('/:id', protect, adminOnly, updateCustomerDemand);
router.delete('/:id', protect, adminOnly, deleteCustomerDemand);

export default router;
