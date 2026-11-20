import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seedVisualQa() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const email = 'visualqa@demoinfotech.in';
  let user = await User.findOne({ email });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('VisualQA@123', salt);
    user = await User.create({
      name: 'Vikram Malhotra (Visual QA)',
      email,
      password: hashedPassword,
      phone: '+91 98765 43210',
      company_name: 'Nexus Tech Labs Pvt Ltd',
      company_size: '51-200',
      gstin: '07AAAAA0000A1Z5',
      role: 'customer',
      isEmailVerified: true
    });
    console.log('Created QA user:', user.email);
  } else {
    user.isEmailVerified = true;
    await user.save();
    console.log('Updated existing QA user to verified');
  }

  const product = await Product.findOne({ available_for: { $in: ['sale', 'both'] } }) || await Product.findOne({});
  if (!product) throw new Error('No product found');

  // Check if an order already exists for this user
  let order = await Order.findOne({ user: user._id });
  if (!order) {
    order = await Order.create({
      user: user._id,
      items: [{
        product: product._id,
        title: product.title,
        price: product.sale_price,
        quantity: 1,
        gst_rate: 18,
        gst_amount: Math.round(product.sale_price * 0.18),
        total: Math.round(product.sale_price * 1.18)
      }],
      subtotal: product.sale_price,
      total_gst: Math.round(product.sale_price * 0.18),
      delivery_charges: 0,
      grand_total: Math.round(product.sale_price * 1.18),
      shipping_address: {
        street: '402, DLF Cyber Park, Sector 20',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122008'
      },
      payment_method: 'po',
      payment_status: 'pending',
      order_status: 'shipped',
      courier_name: 'BlueDart Express Corporate Priority',
      tracking_number: 'BLUEDART-88992211-DL',
      admin_notes: 'Grade A+ certified diagnostic passed. Secure armored logistics transit.'
    });
    console.log('Created seeded order:', order._id);
  } else {
    order.order_status = 'shipped';
    order.courier_name = 'BlueDart Express Corporate Priority';
    order.tracking_number = 'BLUEDART-88992211-DL';
    order.admin_notes = 'Grade A+ certified diagnostic passed. Secure armored logistics transit.';
    await order.save();
    console.log('Updated existing seeded order:', order._id);
  }

  await mongoose.disconnect();
  console.log('Visual QA Seeding complete. User: visualqa@demoinfotech.in / VisualQA@123');
}

seedVisualQa().catch(console.error);
