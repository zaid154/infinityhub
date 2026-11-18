import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured/list', getFeaturedProducts);
router.get('/:slug', getProductBySlug);

router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
