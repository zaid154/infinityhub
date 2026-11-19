import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const DEFAULT_SETTINGS = {
  company_name: 'Nova Infotech Solutions',
  tagline: 'Certified Enterprise Hardware, Corporate Fleet Rentals & ITAD Solutions',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'procurement@novainfotech.in',
  address: 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India',
  google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000',
  logo_url: '',
  gst_number: '07AAACN8412K1Z9',
  invoice_prefix: 'INV',
  business_hours: 'Monday – Saturday: 9:30 AM – 7:30 PM IST',
  warehouse_locations: 'Electronic City Phase 1, Bangalore · Okhla Industrial Area, Delhi NCR · Mumbai, India',
  support_sla: 'Guaranteed 24–48h Hardware Standby Replacement SLA',
  
  // Manager & Authorized Signatory Details ("Manager ke Sign")
  signatory_name: 'Mohd Zaid',
  signatory_designation: 'Authorized Commercial Signatory / General Manager',
  signature_url: '',
  company_seal_url: '',

  // Category-wise GST Rates ("GST Rate according to Category")
  category_gst_rates: [
    { category_key: 'laptop', category_name: 'Corporate Laptops', hsn_sac: '8471 30 10', gst_rate: 18, description: 'Standard commercial notebooks & ultrabooks' },
    { category_key: 'desktop', category_name: 'Commercial Desktops', hsn_sac: '8471 41 90', gst_rate: 18, description: 'Tower PCs, all-in-one & micro desktops' },
    { category_key: 'server', category_name: 'Enterprise Servers', hsn_sac: '8471 49 00', gst_rate: 18, description: 'Rackmount & blade servers' },
    { category_key: 'monitor', category_name: 'Business Monitors', hsn_sac: '8528 52 00', gst_rate: 18, description: 'Commercial IPS displays & monitors' },
    { category_key: 'ram', category_name: 'RAM & Memory', hsn_sac: '8473 30 20', gst_rate: 18, description: 'DDR4 & DDR5 ECC / Non-ECC modules' },
    { category_key: 'storage', category_name: 'SSD & Storage', hsn_sac: '8471 70 20', gst_rate: 18, description: 'NVMe M.2 & SATA solid state drives' },
    { category_key: 'gpu', category_name: 'Workstation GPUs', hsn_sac: '8473 30 99', gst_rate: 18, description: 'Dedicated AI & 3D compute graphics cards' },
    { category_key: 'peripheral', category_name: 'Peripherals & Accessories', hsn_sac: '8471 60 60', gst_rate: 18, description: 'Docks, chargers, keyboards & networking' },
    { category_key: 'rental', category_name: 'Corporate Fleet Rentals', hsn_sac: '997311', gst_rate: 18, description: 'Operating leasing of computers & hardware' },
    { category_key: 'buyback', category_name: 'Asset Buyback / E-Waste', hsn_sac: '8471 90 00', gst_rate: 5, description: 'ITAD decommissioned electronics disposition' }
  ],
  default_gst_rate: 18,

  // Corporate Bank Account Details (for Invoices & Wire Transfers)
  bank_details: {
    bank_name: 'HDFC Bank Ltd',
    account_name: 'Nova Infotech Solutions Pvt. Ltd.',
    account_number: '50200084920194',
    ifsc_code: 'HDFC0000123',
    branch: 'Okhla Industrial Area / Electronic City',
    upi_id: 'novainfotech@hdfcbank'
  },

  social_links: {
    linkedin: '',
    instagram: '',
    twitter: ''
  }
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: true,
  error: null,
  refreshSettings: async () => {}
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.success && res.data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.data.settings,
          bank_details: {
            ...prev.bank_details,
            ...(res.data.settings.bank_details || {})
          },
          category_gst_rates:
            res.data.settings.category_gst_rates && res.data.settings.category_gst_rates.length > 0
              ? res.data.settings.category_gst_rates
              : prev.category_gst_rates
        }));
      }
    } catch (err) {
      console.error('[SettingsContext Error]', err);
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const value = {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;
