import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus
} from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

router.get('/', protect, adminOnly, getAllOrdersAdmin);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
