import express from 'express';
import {
  createRental,
  getMyRentals,
  getAllRentalsAdmin,
  updateRentalStatus
} from '../controllers/rental.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createRental);
router.get('/my-rentals', protect, getMyRentals);

router.get('/', protect, adminOnly, getAllRentalsAdmin);
router.put('/:id/status', protect, adminOnly, updateRentalStatus);

export default router;
