import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function sanitizeCustomers() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB.');

  const User = (await import('../models/User.js')).default;

  // 1. Remove ephemeral test accounts
  const deleteResult = await User.deleteMany({
    $or: [
      { email: { $regex: /^audit-client-/i } },
      { email: { $regex: /^lifecycle_/i } },
      { email: { $regex: /^billing_cust_/i } },
      { email: { $regex: /^e2e_/i } }
    ]
  });
  console.log(`Deleted ${deleteResult.deletedCount} ephemeral test accounts.`);

  // 2. Ensure Nexus Tech Labs Pvt Ltd has perfectly matching domain and complete profile
  let nexusUser = await User.findOne({ company_name: 'Nexus Tech Labs Pvt Ltd' });
  if (nexusUser) {
    nexusUser.name = 'Vikram Malhotra';
    nexusUser.email = 'vikram.malhotra@nexustechlabs.com';
    nexusUser.designation = 'VP of IT Infrastructure & Procurement';
    nexusUser.company_size = '51-200';
    nexusUser.city = 'Gurugram, Cyber City';
    nexusUser.gstin = '07AAAAA0000A1Z5';
    nexusUser.email_verified = true;
    nexusUser.phone = '+91 98765 43210';
    await nexusUser.save();
    console.log('Updated Nexus Tech Labs customer: vikram.malhotra@nexustechlabs.com');
  }

  // 3. Ensure Demo Infotech Internal Fleet Account matches Demo Infotech brand
  let internalUser = await User.findOne({ email: 'visualqa@demoinfotech.in' });
  if (!internalUser) {
    const bcrypt = (await import('bcryptjs')).default;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('VisualQA@123', salt);
    await User.create({
      name: 'Vikram Malhotra (Lead QA)',
      email: 'visualqa@demoinfotech.in',
      password: hash,
      phone: '+91 98765 43210',
      company_name: 'Demo Infotech Corporate Operations',
      company_size: '51-200',
      designation: 'Enterprise Fleet Administrator',
      city: 'New Delhi, Connaught Place',
      gstin: '07AAAAA0000A1Z5',
      role: 'customer',
      email_verified: true
    });
    console.log('Created Demo Infotech corporate account: visualqa@demoinfotech.in');
  } else {
    internalUser.company_name = 'Demo Infotech Corporate Operations';
    internalUser.designation = 'Enterprise Fleet Administrator';
    internalUser.company_size = '51-200';
    internalUser.city = 'New Delhi, Connaught Place';
    internalUser.email_verified = true;
    await internalUser.save();
    console.log('Updated Demo Infotech corporate account: visualqa@demoinfotech.in');
  }

  // 4. Ensure Apex Systems India Pvt Ltd is verified
  let apexUser = await User.findOne({ company_name: /Apex Systems/i });
  if (apexUser) {
    apexUser.email_verified = true;
    apexUser.designation = 'Director of Corporate Infrastructure';
    apexUser.company_size = '200+';
    apexUser.city = 'Bengaluru, Electronic City';
    apexUser.gstin = '29AAAAA0000A1Z5';
    await apexUser.save();
    console.log('Updated Apex Systems customer profile.');
  }

  // 5. Ensure Acme Technologies Ltd is verified
  let acmeUser = await User.findOne({ company_name: /Acme Technologies/i });
  if (acmeUser) {
    acmeUser.email_verified = true;
    acmeUser.designation = 'Head of Hardware Procurement';
    acmeUser.company_size = '51-200';
    acmeUser.city = 'Mumbai, BKC';
    acmeUser.gstin = '27AAAAA0000A1Z5';
    await acmeUser.save();
    console.log('Updated Acme Technologies customer profile.');
  }

  await mongoose.disconnect();
  console.log('Customer Directory Sanitization Complete.');
}

sanitizeCustomers().catch(console.error);
