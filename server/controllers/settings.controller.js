import SiteSettings from '../models/SiteSettings.js';
import SettingsAuditLog from '../models/SettingsAuditLog.js';
import DeliveryZone from '../models/DeliveryZone.js';

// In-memory cache for public settings (60s TTL)
let publicSettingsCache = null;
let cacheExpiryTime = 0;

const invalidatePublicSettingsCache = () => {
  publicSettingsCache = null;
  cacheExpiryTime = 0;
};

// Filter only public-safe fields (sanitized against leaking banking or internal signatures)
const extractPublicSettings = (settings) => ({
  brand_name: settings.brand_name || 'Demo Infotech',
  brand_name_short: settings.brand_name_short || 'Demo',
  company_name: settings.company_name || settings.brand_name || 'Demo Infotech',
  tagline: settings.tagline || 'Enterprise Hardware Solutions, Flexible Corporate Rentals & ITAD Lifecycle Management',
  tm_symbol: settings.tm_symbol || 'TM',
  is_tm_registered_confirmed: Boolean(settings.is_tm_registered_confirmed),
  logo_url: settings.logo_url || '',
  favicon_url: settings.favicon_url || '',
  website_url: settings.website_url || 'http://localhost:5173',
  legal_name: settings.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]',
  cin_number: settings.cin_number || 'U72900DL2024PTC000000 [PLACEHOLDER]',
  gst_number: settings.gst_number || '07AAAAA0000A1Z5 [PLACEHOLDER]',
  registered_address: settings.registered_address || 'Unit No. 101, First Floor, Commercial Tower, Barakhamba Road, Connaught Place, New Delhi 110001, India [PLACEHOLDER]',
  operations_address: settings.operations_address || settings.address || 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India [PLACEHOLDER]',
  address: settings.address || 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India [PLACEHOLDER]',
  jurisdiction_city: settings.jurisdiction_city || 'New Delhi',
  iso_cert_number: settings.iso_cert_number || '',
  epr_registration_number: settings.epr_registration_number || 'CPCB/EPR/2024/000000 [PLACEHOLDER]',
  phone: settings.phone || '+91 XXXXX XXXXX [PLACEHOLDER]',
  whatsapp: settings.whatsapp || '+91 XXXXX XXXXX [PLACEHOLDER]',
  email: settings.email || settings.procurement_email || 'procurement@example.com [PLACEHOLDER]',
  support_email: settings.support_email || 'support@example.com [PLACEHOLDER]',
  procurement_email: settings.procurement_email || 'procurement@example.com [PLACEHOLDER]',
  business_hours: settings.business_hours || 'Monday – Saturday: 9:30 AM – 7:30 PM IST',
  warehouse_locations: settings.warehouse_locations || 'Electronic City Phase 1, Bangalore · Okhla Industrial Area, Delhi NCR · Mumbai, India',
  support_sla: settings.support_sla || '24–48h Hardware Standby Replacement SLA (Subject to SLA Terms)',
  google_maps_embed_url: settings.google_maps_embed_url || '',
  grievance_officer: settings.grievance_officer || {
    name: 'Statutory Grievance Officer [PLACEHOLDER]',
    designation: 'Head of Legal & Enterprise Compliance',
    email: 'grievance@example.com [PLACEHOLDER]',
    phone: '+91 XXXXX XXXXX [PLACEHOLDER]',
    address: 'Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001 [PLACEHOLDER]'
  },
  third_party_disclaimer: settings.third_party_disclaimer || '',
  invoice_prefix: settings.invoice_prefix || 'INV',
  default_gst_rate: settings.default_gst_rate || 18,
  category_gst_rates: settings.category_gst_rates || [],
  social_links: settings.social_links || {},
  legal_version: settings.legal_version || '1.0',
  legal_last_updated: settings.legal_last_updated || new Date(),
  settings_version: settings.settings_version || 1
});

// @desc    Get public sanitized company settings (Cached 60s)
// @route   GET /api/settings/public
// @access  Public
export const getPublicSettings = async (req, res, next) => {
  try {
    const now = Date.now();
    if (publicSettingsCache && now < cacheExpiryTime) {
      return res.status(200).json({ success: true, settings: publicSettingsCache, cached: true });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    const publicSafe = extractPublicSettings(settings);
    publicSettingsCache = publicSafe;
    cacheExpiryTime = now + 60 * 1000; // 60 seconds TTL

    res.status(200).json({ success: true, settings: publicSafe, cached: false });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full settings (Backward-compatible & Admin)
// @route   GET /api/settings or GET /api/admin/settings
// @access  Public (basic compatibility) or Admin (with audit history)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    // If caller is authenticated admin, include recent audit logs
    let recentAudits = [];
    if (req.user && req.user.role === 'admin') {
      recentAudits = await SettingsAuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    }

    res.status(200).json({
      success: true,
      settings,
      auditHistory: recentAudits
    });
  } catch (error) {
    next(error);
  }
};

// Validation patterns for Indian corporate compliance
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const CIN_REGEX = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

// @desc    Update settings with validation and audit logging
// @route   PUT /api/settings or PUT /api/admin/settings
// @access  Admin only
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const previousSnapshot = settings.toObject();
    const updates = req.body || {};

    // 1. Validation: GSTIN format (if real value provided, not placeholder)
    if (updates.gst_number && !updates.gst_number.includes('[PLACEHOLDER]')) {
      const cleanGst = updates.gst_number.trim().toUpperCase();
      if (!GSTIN_REGEX.test(cleanGst)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid GSTIN format. Standard Indian GSTIN must be 15 alphanumeric characters (e.g. 07AAAAA0000A1Z5).'
        });
      }
      updates.gst_number = cleanGst;
    }

    // 2. Validation: CIN format (if real value provided, not placeholder)
    if (updates.cin_number && !updates.cin_number.includes('[PLACEHOLDER]')) {
      const cleanCin = updates.cin_number.trim().toUpperCase();
      if (!CIN_REGEX.test(cleanCin)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Corporate Identity Number (CIN). Standard Indian CIN must be 21 characters (e.g. U72900DL2024PTC000000).'
        });
      }
      updates.cin_number = cleanCin;
    }

    // 3. Validation: Trademark Symbol Safeguard (Section 107 Trade Marks Act 1999)
    if (updates.tm_symbol === 'R' && !updates.is_tm_registered_confirmed) {
      return res.status(400).json({
        success: false,
        message: 'Statutory Restriction: Representing an unregistered trademark with the (R) registered symbol is prohibited under Section 107 of the Trade Marks Act 1999. Please confirm trademark registration or use TM.'
      });
    }

    // 4. Check if legal/registration fields changed to update legal_last_updated
    const legalFields = ['legal_name', 'cin_number', 'gst_number', 'registered_address', 'jurisdiction_city', 'grievance_officer'];
    let legalChanged = false;
    legalFields.forEach((lf) => {
      if (updates[lf] !== undefined && JSON.stringify(updates[lf]) !== JSON.stringify(settings[lf])) {
        legalChanged = true;
      }
    });

    if (legalChanged) {
      settings.legal_last_updated = new Date();
    }

    // Apply allowed updates
    const allowedFields = [
      'brand_name',
      'brand_name_short',
      'company_name',
      'tagline',
      'tm_symbol',
      'is_tm_registered_confirmed',
      'logo_url',
      'favicon_url',
      'website_url',
      'legal_name',
      'cin_number',
      'gst_number',
      'registered_address',
      'operations_address',
      'address',
      'jurisdiction_city',
      'iso_cert_number',
      'epr_registration_number',
      'phone',
      'whatsapp',
      'email',
      'support_email',
      'procurement_email',
      'business_hours',
      'warehouse_locations',
      'support_sla',
      'google_maps_embed_url',
      'grievance_officer',
      'third_party_disclaimer',
      'signatory_name',
      'signatory_designation',
      'signature_url',
      'company_seal_url',
      'invoice_prefix',
      'category_gst_rates',
      'default_gst_rate',
      'bank_details',
      'social_links',
      'legal_version'
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        settings[field] = updates[field];
      }
    });

    // Sync company_name with brand_name if brand_name updated
    if (updates.brand_name) {
      settings.company_name = updates.brand_name;
    }

    // Increment version
    const newVersion = (settings.settings_version || 1) + 1;
    settings.settings_version = newVersion;

    await settings.save();

    // Write audit log if user context exists
    if (req.user && req.user._id) {
      await SettingsAuditLog.create({
        modified_by: req.user._id,
        user_email: req.user.email || '',
        previous_values: previousSnapshot,
        updated_values: updates,
        version_number: newVersion,
        ip_address: req.ip || req.headers['x-forwarded-for'] || '',
        user_agent: req.headers['user-agent'] || ''
      });
    }

    // Invalidate public cache
    invalidatePublicSettingsCache();

    res.status(200).json({
      success: true,
      message: 'Company settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revert to previous settings version
// @route   POST /api/admin/settings/revert
// @access  Admin only
export const revertSettings = async (req, res, next) => {
  try {
    const latestAudit = await SettingsAuditLog.findOne().sort({ createdAt: -1 });
    if (!latestAudit || !latestAudit.previous_values) {
      return res.status(400).json({
        success: false,
        message: 'No previous settings version available to revert.'
      });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const currentSnapshot = settings.toObject();
    const restoreData = latestAudit.previous_values;

    // Apply restored fields
    Object.keys(restoreData).forEach((k) => {
      if (k !== '_id' && k !== '__v' && k !== 'createdAt' && k !== 'updatedAt') {
        settings[k] = restoreData[k];
      }
    });

    const newVersion = (settings.settings_version || 1) + 1;
    settings.settings_version = newVersion;
    settings.legal_last_updated = new Date();
    await settings.save();

    // Log the revert action
    if (req.user && req.user._id) {
      await SettingsAuditLog.create({
        modified_by: req.user._id,
        user_email: req.user.email || '',
        previous_values: currentSnapshot,
        updated_values: restoreData,
        version_number: newVersion,
        ip_address: req.ip || '',
        user_agent: 'One-Click Admin Revert'
      });
    }

    invalidatePublicSettingsCache();

    res.status(200).json({
      success: true,
      message: `Successfully reverted to version from ${new Date(latestAudit.createdAt).toLocaleString()}`,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// Delivery Zones
export const getDeliveryZones = async (req, res, next) => {
  try {
    const zones = await DeliveryZone.find({ is_active: true }).sort({ delivery_charge: 1 });
    res.status(200).json({ success: true, count: zones.length, zones });
  } catch (error) {
    next(error);
  }
};

export const checkPincodeDelivery = async (req, res, next) => {
  try {
    const { pincode } = req.params;
    if (!pincode) {
      return res.status(400).json({ success: false, message: 'Pincode is required' });
    }

    const zone = await DeliveryZone.findOne({
      pincodes: pincode,
      is_active: true
    });

    if (!zone) {
      return res.status(200).json({
        success: true,
        serviceable: false,
        message: `Pincode ${pincode} is currently served via Pan-India Carrier Surface Dispatch (5-7 business days). Contact desk for dedicated delivery.`
      });
    }

    res.status(200).json({
      success: true,
      serviceable: true,
      zone: {
        city: zone.city,
        state: zone.state,
        delivery_days: zone.delivery_days,
        shipping_charge: zone.shipping_charge,
        is_free_shipping: zone.is_free_shipping,
        cod_available: zone.cod_available
      }
    });
  } catch (error) {
    next(error);
  }
};

const sanitizeZoneBody = (body) => {
  const data = { ...body };
  if (typeof data.cities === 'string') {
    data.cities = data.cities.split(',').map((c) => c.trim()).filter(Boolean);
  }
  if (typeof data.states === 'string') {
    data.states = data.states.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (typeof data.pincode_prefixes === 'string') {
    data.pincode_prefixes = data.pincode_prefixes.split(',').map((p) => p.trim()).filter(Boolean);
  }
  return data;
};

export const addDeliveryZone = async (req, res, next) => {
  try {
    const zone = await DeliveryZone.create(sanitizeZoneBody(req.body));
    res.status(201).json({ success: true, zone });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryZone = async (req, res, next) => {
  try {
    const zone = await DeliveryZone.findByIdAndUpdate(req.params.id, sanitizeZoneBody(req.body), { new: true, runValidators: true });
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Delivery zone not found' });
    }
    res.status(200).json({ success: true, zone });
  } catch (error) {
    next(error);
  }
};

export const deleteDeliveryZone = async (req, res, next) => {
  try {
    const zone = await DeliveryZone.findByIdAndDelete(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Delivery zone not found' });
    }
    res.status(200).json({ success: true, message: 'Delivery zone removed' });
  } catch (error) {
    next(error);
  }
};
