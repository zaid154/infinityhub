import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import SiteSettings from '../models/SiteSettings.js';
import DeliveryZone from '../models/DeliveryZone.js';

dotenv.config({ path: 'server/.env' });
dotenv.config();

const seed = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected.');

    // 1. Seed Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'zaidm1323@gmail.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Zaid@9999201255';
    const adminName = process.env.ADMIN_NAME || 'Nova Infotech Administrator';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        email_verified: true,
        phone: process.env.DEFAULT_PHONE || '+919876543210',
        company_name: 'Nova Infotech'
      });
      console.log(`[Seed] ✅ Admin user created: ${adminEmail}`);
    } else {
      admin.name = adminName;
      admin.password = adminPassword;
      admin.role = 'admin';
      admin.email_verified = true;
      await admin.save();
      console.log(`[Seed] ✅ Admin user verified & updated: ${adminEmail}`);
    }

    // 2. Seed Default Categories
    const categoriesData = [
      { name: 'Corporate Laptops', slug: 'laptops', default_gst_rate: 18, icon: 'laptop', sort_order: 1 },
      { name: 'Commercial Desktops', slug: 'desktops', default_gst_rate: 18, icon: 'monitor', sort_order: 2 },
      { name: 'Business Monitors', slug: 'monitors', default_gst_rate: 18, icon: 'tv', sort_order: 3 },
      { name: 'RAM (DDR4 / DDR5)', slug: 'ram', default_gst_rate: 18, icon: 'cpu', sort_order: 4 },
      { name: 'Workstation GPUs', slug: 'gpu', default_gst_rate: 18, icon: 'zap', sort_order: 5 },
      { name: 'CPUs & Processors', slug: 'cpu', default_gst_rate: 18, icon: 'layers', sort_order: 6 },
      { name: 'Peripherals & Accessories', slug: 'other', default_gst_rate: 18, icon: 'box', sort_order: 7 }
    ];

    for (const cat of categoriesData) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }
    console.log('[Seed] ✅ Default categories checked/seeded.');

    // 3. Seed Default Site Settings
    const existingSettings = await SiteSettings.findOne();
    if (!existingSettings) {
      await SiteSettings.create({
        company_name: process.env.DEFAULT_COMPANY_NAME || 'TechNova IT Solutions',
        tagline: 'Commercial IT Hardware, Bulk Rentals & Component Trading',
        phone: process.env.DEFAULT_PHONE || '+91 98765 43210',
        whatsapp: process.env.DEFAULT_WHATSAPP || '+91 98765 43210',
        email: process.env.DEFAULT_EMAIL || 'sales@technovait.com',
        address: process.env.DEFAULT_ADDRESS || 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR',
        gst_number: '07AAAAA0000A1Z5',
        invoice_prefix: 'INV'
      });
      console.log('[Seed] ✅ Default site settings created.');
    }

    // 4. Seed Default Delivery Zones
    const existingZone = await DeliveryZone.findOne();
    if (!existingZone) {
      await DeliveryZone.create({
        zone_name: 'Delhi NCR (Local Hub)',
        cities: ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'],
        delivery_charge: 0,
        is_active: true
      });
      await DeliveryZone.create({
        zone_name: 'Tier-1 Metro Cities',
        cities: ['Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'],
        delivery_charge: 450,
        is_active: true
      });
      await DeliveryZone.create({
        zone_name: 'Rest of India',
        cities: ['All other cities and towns'],
        delivery_charge: 750,
        is_active: true
      });
      console.log('[Seed] ✅ Default delivery zones created.');
    }

    console.log('[Seed] 🎉 All database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seed();
