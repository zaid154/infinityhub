import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry
} from '../controllers/inquiry.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, adminOnly, getInquiries);
router.put('/:id', protect, adminOnly, updateInquiry);
router.delete('/:id', protect, adminOnly, deleteInquiry);

export default router;
