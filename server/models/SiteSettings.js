import mongoose from 'mongoose';

const DEFAULT_CATEGORY_GST_RATES = [
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
];

const siteSettingsSchema = new mongoose.Schema(
  {
    // Brand & Public Identity
    brand_name: {
      type: String,
      default: 'Demo Infotech'
    },
    brand_name_short: {
      type: String,
      default: 'Demo'
    },
    company_name: {
      type: String,
      default: 'Demo Infotech'
    },
    tagline: {
      type: String,
      default: 'Enterprise Hardware Solutions, Flexible Corporate Rentals & ITAD Lifecycle Management'
    },
    tm_symbol: {
      type: String,
      enum: ['none', 'TM', 'R'],
      default: 'TM'
    },
    is_tm_registered_confirmed: {
      type: Boolean,
      default: false
    },
    logo_url: {
      type: String,
      default: ''
    },
    favicon_url: {
      type: String,
      default: ''
    },
    website_url: {
      type: String,
      default: 'http://localhost:5173'
    },

    // Statutory Corporate Registrations (Indian Law)
    legal_name: {
      type: String,
      default: 'Demo Infotech Private Limited'
    },
    cin_number: {
      type: String,
      default: 'U72900DL2024PTC394812'
    },
    gst_number: {
      type: String,
      default: '07AAAAA0000A1Z5'
    },
    registered_address: {
      type: String,
      default: 'Unit No. 101, First Floor, Commercial Tower, Barakhamba Road, Connaught Place, New Delhi 110001, India'
    },
    operations_address: {
      type: String,
      default: 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India'
    },
    address: {
      type: String,
      default: 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India'
    },
    jurisdiction_city: {
      type: String,
      default: 'New Delhi'
    },
    iso_cert_number: {
      type: String,
      default: '' // Empty by default! Kept only if admin explicitly provides valid certificate number
    },
    epr_registration_number: {
      type: String,
      default: 'CPCB/EPR/2024/004819'
    },

    // Corporate Communications & Operating Hours
    phone: {
      type: String,
      default: '+91 11 4123 4567'
    },
    whatsapp: {
      type: String,
      default: '+91 98100 00000'
    },
    email: {
      type: String,
      default: 'procurement@demoinfotech.in'
    },
    support_email: {
      type: String,
      default: 'support@demoinfotech.in'
    },
    procurement_email: {
      type: String,
      default: 'procurement@demoinfotech.in'
    },
    business_hours: {
      type: String,
      default: 'Monday – Saturday: 9:30 AM – 7:30 PM IST'
    },
    warehouse_locations: {
      type: String,
      default: 'Electronic City Phase 1, Bangalore · Okhla Industrial Area, Delhi NCR · Mumbai, India'
    },
    support_sla: {
      type: String,
      default: '24–48h Hardware Standby Replacement SLA (Subject to SLA Terms)'
    },
    google_maps_embed_url: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000'
    },

    // Statutory Grievance Redressal (IT Act, IT Rules 2021 & DPDP Act 2023)
    grievance_officer: {
      name: {
        type: String,
        default: 'Adv. R. K. Sharma'
      },
      designation: {
        type: String,
        default: 'Head of Legal & Enterprise Compliance'
      },
      email: {
        type: String,
        default: 'grievance@demoinfotech.in'
      },
      phone: {
        type: String,
        default: '+91 11 4123 4568'
      },
      address: {
        type: String,
        default: 'Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001'
      }
    },

    // Third-Party Trademark Disclaimer
    third_party_disclaimer: {
      type: String,
      default: 'All third-party trademarks, logos, and brand names (including Dell, HP, Lenovo, ThinkPad, Latitude, EliteBook, Apple, Samsung, NVIDIA, Intel, and AMD) are the registered properties of their respective owners. Use of these names, trademarks, and brands does not imply endorsement, affiliation, or direct sponsorship unless explicitly stated.'
    },

    // Manager & Authorized Signatory Details
    signatory_name: {
      type: String,
      default: 'Authorized Commercial Signatory'
    },
    signatory_designation: {
      type: String,
      default: 'Authorized Commercial Signatory / General Manager'
    },
    signature_url: {
      type: String,
      default: ''
    },
    company_seal_url: {
      type: String,
      default: ''
    },

    // Invoicing & Tax Architecture
    invoice_prefix: {
      type: String,
      default: 'INV'
    },
    default_gst_rate: {
      type: Number,
      default: 18
    },
    category_gst_rates: {
      type: [
        {
          category_key: { type: String, required: true },
          category_name: { type: String, required: true },
          hsn_sac: { type: String, default: '' },
          gst_rate: { type: Number, default: 18 },
          description: { type: String, default: '' }
        }
      ],
      default: DEFAULT_CATEGORY_GST_RATES
    },

    // Corporate Bank Account Details (Protected for Invoices & B2B Wire)
    bank_details: {
      bank_name: { type: String, default: 'HDFC Bank Ltd' },
      account_name: { type: String, default: 'Demo Infotech Private Limited [PLACEHOLDER]' },
      account_number: { type: String, default: '50200000000000' },
      ifsc_code: { type: String, default: 'HDFC0000000' },
      branch: { type: String, default: 'Connaught Place / Electronic City' },
      upi_id: { type: String, default: 'demoinfotech@hdfcbank' }
    },

    // Social Links
    social_links: {
      linkedin: { type: String, default: 'https://linkedin.com' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: 'https://x.com' }
    },

    // Versioning & Policy Timestamps
    legal_version: {
      type: String,
      default: '1.0'
    },
    legal_last_updated: {
      type: Date,
      default: Date.now
    },
    settings_version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
