import express from 'express';
import { subscribeNewsletter, getSubscribers } from '../controllers/newsletter.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.get('/subscribers', protect, adminOnly, getSubscribers);

export default router;
