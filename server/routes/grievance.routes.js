import express from 'express';
import { submitGrievance, getAdminGrievances } from '../controllers/grievance.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public submission
router.post('/submit', submitGrievance);

// Admin oversight
router.get('/', protect, adminOnly, getAdminGrievances);

export default router;
