import SiteSettings from '../models/SiteSettings.js';
import DeliveryZone from '../models/DeliveryZone.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const fields = [
      'company_name',
      'tagline',
      'phone',
      'whatsapp',
      'email',
      'address',
      'google_maps_embed_url',
      'logo_url',
      'gst_number',
      'invoice_prefix',
      'business_hours',
      'warehouse_locations',
      'support_sla',
      'signatory_name',
      'signatory_designation',
      'signature_url',
      'company_seal_url',
      'category_gst_rates',
      'default_gst_rate',
      'bank_details',
      'social_links'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();
    res.status(200).json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    next(error);
  }
};

// Delivery Zones
export const getDeliveryZones = async (req, res, next) => {
  try {
    const zones = await DeliveryZone.find({ is_active: true });
    res.status(200).json({ success: true, count: zones.length, zones });
  } catch (error) {
    next(error);
  }
};

export const getAllDeliveryZonesAdmin = async (req, res, next) => {
  try {
    const zones = await DeliveryZone.find();
    res.status(200).json({ success: true, zones });
  } catch (error) {
    next(error);
  }
};

export const createDeliveryZone = async (req, res, next) => {
  try {
    const { zone_name, cities, delivery_charge } = req.body;
    const zone = await DeliveryZone.create({
      zone_name,
      cities: Array.isArray(cities) ? cities : cities.split(',').map((c) => c.trim()),
      delivery_charge: Number(delivery_charge) || 0
    });
    res.status(201).json({ success: true, zone });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryZone = async (req, res, next) => {
  try {
    const { zone_name, cities, delivery_charge, is_active } = req.body;
    const zone = await DeliveryZone.findById(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: 'Delivery zone not found' });

    if (zone_name) zone.zone_name = zone_name;
    if (cities) {
      zone.cities = Array.isArray(cities) ? cities : cities.split(',').map((c) => c.trim());
    }
    if (delivery_charge !== undefined) zone.delivery_charge = Number(delivery_charge);
    if (is_active !== undefined) zone.is_active = is_active;

    await zone.save();
    res.status(200).json({ success: true, zone });
  } catch (error) {
    next(error);
  }
};

export const deleteDeliveryZone = async (req, res, next) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: 'Delivery zone not found' });
    await zone.deleteOne();
    res.status(200).json({ success: true, message: 'Zone deleted' });
  } catch (error) {
    next(error);
  }
};
