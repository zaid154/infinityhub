import express from 'express';
import {
  getPublicSettings,
  getSettings,
  updateSettings,
  revertSettings,
  getDeliveryZones,
  checkPincodeDelivery,
  addDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone
} from '../controllers/settings.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public sanitized settings endpoint (Cached 60s)
router.get('/public', getPublicSettings);

// Full settings endpoint (Backward-compatibility & Admin)
router.get('/', getSettings);

// Admin-only modification endpoints
router.put('/', protect, adminOnly, updateSettings);
router.post('/revert', protect, adminOnly, revertSettings);

// Delivery Zones
router.get('/delivery-zones', getDeliveryZones);
router.get('/delivery-zones/check/:pincode', checkPincodeDelivery);
router.post('/delivery-zones', protect, adminOnly, addDeliveryZone);
router.put('/delivery-zones/:id', protect, adminOnly, updateDeliveryZone);
router.delete('/delivery-zones/:id', protect, adminOnly, deleteDeliveryZone);

export default router;
