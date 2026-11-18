import express from 'express';
import {
  getSettings,
  updateSettings,
  getDeliveryZones,
  getAllDeliveryZonesAdmin,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone
} from '../controllers/settings.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, adminOnly, updateSettings);

router.get('/delivery-zones', getDeliveryZones);
router.get('/delivery-zones/all', protect, adminOnly, getAllDeliveryZonesAdmin);
router.post('/delivery-zones', protect, adminOnly, createDeliveryZone);
router.put('/delivery-zones/:id', protect, adminOnly, updateDeliveryZone);
router.delete('/delivery-zones/:id', protect, adminOnly, deleteDeliveryZone);

export default router;
