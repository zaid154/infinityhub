import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Rental from '../models/Rental.js';
import Inquiry from '../models/Inquiry.js';
import BuybackRequest from '../models/BuybackRequest.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config({ path: 'server/.env' });

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for operational data seeding...');

    const user = await User.findOne();
    if (!user) {
      console.error('No user found to associate data with.');
      process.exit(1);
    }

    const products = await Product.find();
    if (products.length === 0) {
      console.error('No products found.');
      process.exit(1);
    }

    const thinkpad = products.find((p) => p.title.includes('ThinkPad')) || products[0];
    const latitude = products.find((p) => p.title.includes('Latitude')) || products[1];
    const elitebook = products.find((p) => p.title.includes('EliteBook')) || products[2];
    const monitor = products.find((p) => p.title.includes('P2419H')) || products[3];
    const rtx = products.find((p) => p.title.includes('RTX 3060')) || products[5];

    // Seed Orders if count is 0
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      const order1Subtotal = thinkpad.sale_price * 5;
      const order1Gst = Math.round(order1Subtotal * 0.18);
      const order1Total = order1Subtotal + order1Gst;

      await Order.create({
        user: user._id,
        items: [
          {
            product: thinkpad._id,
            title: thinkpad.title,
            price: thinkpad.sale_price,
            quantity: 5,
            gst_rate: 18,
            gst_amount: order1Gst,
            total: order1Total
          }
        ],
        subtotal: order1Subtotal,
        total_gst: order1Gst,
        delivery_charges: 0,
        grand_total: order1Total,
        shipping_address: {
          company_name: 'Apex Infotech Solutions Pvt Ltd',
          contact_person: 'Vikramaditya Rathore',
          phone: '+91 98101 23456',
          street: 'Tower 4, Cyber City Phase 2',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122002',
          gst_number: '06AAACA9876Q1Z2'
        },
        payment_status: 'paid',
        order_status: 'shipped',
        invoice_number: 'INV-2026-8812'
      });

      const order2Item1Total = monitor.sale_price * 2;
      const order2Item2Total = rtx.sale_price * 1;
      const order2Subtotal = order2Item1Total + order2Item2Total;
      const order2Gst = Math.round(order2Subtotal * 0.18);
      const order2Total = order2Subtotal + order2Gst;

      await Order.create({
        user: user._id,
        items: [
          {
            product: monitor._id,
            title: monitor.title,
            price: monitor.sale_price,
            quantity: 2,
            gst_rate: 18,
            gst_amount: Math.round(order2Item1Total * 0.18),
            total: order2Item1Total + Math.round(order2Item1Total * 0.18)
          },
          {
            product: rtx._id,
            title: rtx.title,
            price: rtx.sale_price,
            quantity: 1,
            gst_rate: 18,
            gst_amount: Math.round(order2Item2Total * 0.18),
            total: order2Item2Total + Math.round(order2Item2Total * 0.18)
          }
        ],
        subtotal: order2Subtotal,
        total_gst: order2Gst,
        delivery_charges: 500,
        grand_total: order2Total + 500,
        shipping_address: {
          company_name: 'Starlight Media Studios',
          contact_person: 'Pooja Verma',
          phone: '+91 98200 98765',
          street: 'Andheri West Link Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053',
          gst_number: '27AAACS1234M1Z9'
        },
        payment_status: 'pending',
        order_status: 'placed',
        invoice_number: 'INV-2026-9043'
      });
      console.log('Seeded 2 realistic enterprise orders.');
    }

    // Seed Rentals if count is 0
    const rentalCount = await Rental.countDocuments();
    if (rentalCount === 0) {
      await Rental.create({
        user: user._id,
        product: thinkpad._id,
        quantity: 15,
        tenure: '6_months',
        monthly_rate: 19245,
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        payment_status: 'paid',
        admin_notes: 'Delivered batch of 15 ThinkPad T490 laptops. 24h standby swap agreement signed.'
      });

      await Rental.create({
        user: user._id,
        product: elitebook._id,
        quantity: 8,
        tenure: '12_months',
        monthly_rate: 11400,
        start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'active',
        payment_status: 'paid',
        admin_notes: '12-month corporate lease with 15% long-term rebate. GSTR-2B invoiced.'
      });
      console.log('Seeded 2 corporate rental leases.');
    }

    // Seed Inquiries if count is < 3
    const inquiryCount = await Inquiry.countDocuments();
    if (inquiryCount <= 1) {
      await Inquiry.create({
        company_name: 'Infosys BPO Regional Hub',
        contact_person: 'Rajiv Saxena',
        phone: '+91 98112 34567',
        email: 'procurement@infosysbpo.in',
        inquiry_type: 'rental',
        quantity: '40 Laptops',
        message: 'Looking for 40 units Core i5/16GB laptops on 12-month lease with on-site warranty in Bangalore.',
        status: 'quoted',
        admin_notes: 'Proforma quote sent at ₹1,250/unit/month + 18% GST. Awaiting PO approval.'
      });

      await Inquiry.create({
        company_name: 'Zeta AI Solutions',
        contact_person: 'Neha Kulkarni',
        phone: '+91 98223 45678',
        email: 'it@zeta-ai.io',
        inquiry_type: 'bulk_purchase',
        quantity: '10 GPUs + 10 Displays',
        message: 'Need 10x RTX 3060 12GB workstation GPUs and 10x Dell IPS monitors dispatched to Pune office.',
        status: 'new',
        admin_notes: 'Immediate inventory verification requested.'
      });
      console.log('Seeded 2 qualified enterprise inquiries.');
    }

    // Seed Buyback Requests if count is 0
    const buybackCount = await BuybackRequest.countDocuments();
    if (buybackCount === 0) {
      await BuybackRequest.create({
        company_name: 'TCS Okhla Delivery Center',
        contact_person: 'Sunil Manchanda',
        phone: '+91 98711 00223',
        email: 'asset-disposal@tcs.com',
        asset_type: '85x Mixed Laptops & Desktops',
        approx_quantity: 85,
        city: 'New Delhi',
        description: 'Decommissioning 50x Dell OptiPlex Micro PCs and 35x ThinkPad T470 laptops. Need DOD wipe certificate.',
        status: 'quoted',
        offered_price: 680000,
        admin_notes: 'Quotation of ₹6,80,000 provided with cryptographic wipe guarantee.'
      });

      await BuybackRequest.create({
        company_name: 'Cognizant Gurugram Special Economic Zone',
        contact_person: 'Amitav Ghosh',
        phone: '+91 98990 44556',
        email: 'it-infra@cognizant.com',
        asset_type: '30x Lenovo L480 Laptops',
        approx_quantity: 30,
        city: 'Gurugram',
        description: 'End-of-lease refresh of 30x Lenovo L480 Core i5 8th gen laptops.',
        status: 'inspected',
        offered_price: 240000,
        admin_notes: 'Inspected Grade A- condition. Pickup scheduled for Friday.'
      });
      console.log('Seeded 2 buyback liquidation requests.');
    }

    console.log('Operational data seeding finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedData();
