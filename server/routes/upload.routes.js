import express from 'express';
import { uploadImages, deleteImage } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Allow up to 10 photos or videos in a single upload
router.post('/images', protect, adminOnly, upload.array('images', 10), uploadImages);
router.post('/media', protect, adminOnly, upload.array('media', 10), uploadImages);
router.delete('/images', protect, adminOnly, deleteImage);
router.delete('/media', protect, adminOnly, deleteImage);

export default router;
