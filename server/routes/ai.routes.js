import express from 'express';
import { chatWithAI, generateProductDescription } from '../controllers/ai.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', chatWithAI);
router.post('/generate-description', protect, adminOnly, generateProductDescription);

export default router;
