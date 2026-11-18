import express from 'express';
import {
  createBuybackRequest,
  getBuybackRequests,
  updateBuybackRequest
} from '../controllers/buyback.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createBuybackRequest);
router.get('/', protect, adminOnly, getBuybackRequests);
router.put('/:id', protect, adminOnly, updateBuybackRequest);

export default router;
