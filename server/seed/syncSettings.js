import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import SiteSettings from '../models/SiteSettings.js';
dotenv.config({ path: './server/.env' });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

async function sync() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB. Synchronizing SiteSettings with Demo Infotech defaults...');

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings();
  }

  // Set explicit demo values conforming to approved plan
  settings.brand_name = 'Demo Infotech';
  settings.brand_name_short = 'Demo';
  settings.company_name = 'Demo Infotech';
  settings.tagline = 'Enterprise Hardware Solutions, Flexible Corporate Rentals & ITAD Lifecycle Management';
  settings.tm_symbol = 'TM';
  settings.is_tm_registered_confirmed = false;
  settings.legal_name = 'Demo Infotech Private Limited';
  settings.cin_number = 'U72900DL2024PTC394812';
  settings.gst_number = '07AAAAA0000A1Z5';
  settings.registered_address = 'Unit No. 101, First Floor, Commercial Tower, Barakhamba Road, Connaught Place, New Delhi 110001, India';
  settings.operations_address = 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India';
  settings.address = 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India';
  settings.jurisdiction_city = 'New Delhi';
  settings.iso_cert_number = ''; // Clean empty unless certified
  settings.epr_registration_number = 'CPCB/EPR/2024/004819';
  settings.phone = '+91 11 4123 4567';
  settings.whatsapp = '+91 98100 00000';
  settings.email = 'procurement@demoinfotech.in';
  settings.support_email = 'support@demoinfotech.in';
  settings.procurement_email = 'procurement@demoinfotech.in';
  settings.business_hours = 'Monday – Saturday: 9:30 AM – 7:30 PM IST';
  settings.support_sla = '24–48h Hardware Standby Replacement SLA (Subject to SLA Terms)';
  settings.grievance_officer = {
    name: 'Adv. R. K. Sharma',
    designation: 'Head of Legal & Enterprise Compliance',
    email: 'grievance@demoinfotech.in',
    phone: '+91 11 4123 4568',
    address: 'Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001'
  };
  settings.third_party_disclaimer = 'All third-party trademarks, logos, and brand names (including Dell, HP, Lenovo, ThinkPad, Latitude, EliteBook, Apple, Samsung, NVIDIA, Intel, and AMD) are the registered properties of their respective owners. Use of these names, trademarks, and brands does not imply endorsement, affiliation, or direct sponsorship unless explicitly stated.';
  settings.signatory_name = 'Authorized Commercial Signatory';
  settings.signatory_designation = 'Authorized Commercial Signatory / General Manager';
  settings.legal_version = '1.0';
  settings.legal_last_updated = new Date();

  await settings.save();

  // Also sync admin user
  await mongoose.connection.collection('users').updateMany(
    { role: 'admin' },
    { $set: { company_name: 'Demo Infotech', name: 'Demo Infotech Desk' } }
  );

  console.log('Site settings and admin identity synchronized successfully with Demo Infotech defaults.');
  process.exit(0);
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
