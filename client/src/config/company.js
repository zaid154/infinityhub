/**
 * Static Fallback Company Configuration
 * Serves as instantaneous offline / SSR fallback defaults before /api/settings/public loads.
 * Dynamic settings loaded from backend SiteSettings take full precedence at runtime.
 */
export const FALLBACK_COMPANY_SETTINGS = {
  brand_name: 'Demo Infotech',
  brand_name_short: 'Demo',
  company_name: 'Demo Infotech',
  tagline: 'Enterprise Hardware Solutions, Flexible Corporate Rentals & ITAD Lifecycle Management',
  tm_symbol: 'TM',
  is_tm_registered_confirmed: false,
  logo_url: '',
  favicon_url: '',
  website_url: 'http://localhost:5173',

  // Statutory Registrations (Indian Law)
  legal_name: 'Demo Infotech Private Limited [PLACEHOLDER]',
  cin_number: 'U72900DL2024PTC000000 [PLACEHOLDER]',
  gst_number: '07AAAAA0000A1Z5 [PLACEHOLDER]',
  registered_address: 'Unit No. 101, First Floor, Commercial Tower, Barakhamba Road, Connaught Place, New Delhi 110001, India [PLACEHOLDER]',
  operations_address: 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India [PLACEHOLDER]',
  address: 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India [PLACEHOLDER]',
  jurisdiction_city: 'New Delhi',
  iso_cert_number: '', // Left blank unless valid certification provided
  epr_registration_number: 'CPCB/EPR/2024/000000 [PLACEHOLDER]',

  // Corporate Contact & Hours
  phone: '+91 XXXXX XXXXX [PLACEHOLDER]',
  whatsapp: '+91 XXXXX XXXXX [PLACEHOLDER]',
  email: 'procurement@example.com [PLACEHOLDER]',
  support_email: 'support@example.com [PLACEHOLDER]',
  procurement_email: 'procurement@example.com [PLACEHOLDER]',
  business_hours: 'Monday – Saturday: 9:30 AM – 7:30 PM IST',
  warehouse_locations: 'Electronic City Phase 1, Bangalore · Okhla Industrial Area, Delhi NCR · Mumbai, India',
  support_sla: '24–48h Hardware Standby Replacement SLA (Subject to SLA Terms)',
  google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000',

  // Statutory Grievance Redressal (IT Rules 2021 & DPDP Act 2023)
  grievance_officer: {
    name: 'Statutory Grievance Officer [PLACEHOLDER]',
    designation: 'Head of Legal & Enterprise Compliance',
    email: 'grievance@example.com [PLACEHOLDER]',
    phone: '+91 XXXXX XXXXX [PLACEHOLDER]',
    address: 'Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001 [PLACEHOLDER]'
  },

  // Third-Party Trademark Disclaimer
  third_party_disclaimer: 'All third-party trademarks, logos, and brand names (including Dell, HP, Lenovo, ThinkPad, Latitude, EliteBook, Apple, Samsung, NVIDIA, Intel, and AMD) are the registered properties of their respective owners. Use of these names, trademarks, and brands does not imply endorsement, affiliation, or direct sponsorship unless explicitly stated.',

  // Manager & Signatory
  signatory_name: 'Authorized Signatory [PLACEHOLDER]',
  signatory_designation: 'Authorized Commercial Signatory / General Manager',

  // Invoicing
  invoice_prefix: 'INV',
  default_gst_rate: 18,

  // Social Links
  social_links: {
    linkedin: 'https://linkedin.com',
    instagram: '',
    twitter: 'https://x.com'
  },

  // Policy Version
  legal_version: '1.0',
  legal_last_updated: new Date().toISOString(),
  settings_version: 1
};

export default FALLBACK_COMPANY_SETTINGS;
