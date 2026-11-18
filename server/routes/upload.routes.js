import express from 'express';
import { uploadImages, deleteImage } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Allow up to 6 images in a single upload
router.post('/images', protect, adminOnly, upload.array('images', 6), uploadImages);
router.delete('/images', protect, adminOnly, deleteImage);

export default router;
