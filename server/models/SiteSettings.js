import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      default: 'TechNova IT Solutions'
    },
    tagline: {
      type: String,
      default: 'Commercial IT Hardware, Bulk Rentals & Component Trading'
    },
    phone: {
      type: String,
      default: '+91 98765 43210'
    },
    whatsapp: {
      type: String,
      default: '+91 98765 43210'
    },
    email: {
      type: String,
      default: 'sales@technovait.com'
    },
    address: {
      type: String,
      default: 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR'
    },
    google_maps_embed_url: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000'
    },
    logo_url: {
      type: String,
      default: ''
    },
    gst_number: {
      type: String,
      default: '07AAAAA0000A1Z5'
    },
    invoice_prefix: {
      type: String,
      default: 'INV'
    },
    social_links: {
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
