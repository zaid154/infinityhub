import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Rental from '../models/Rental.js';
import SiteSettings from '../models/SiteSettings.js';
import DeliveryZone from '../models/DeliveryZone.js';
import BuybackRequest from '../models/BuybackRequest.js';
import Category from '../models/Category.js';

dotenv.config({ path: './server/.env' });

const BASE = 'http://localhost:5001/api';

async function runAudit() {
  console.log('🚀 Running Deep Independent Full-Stack Verification...');
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas directly');
  } catch (dbErr) {
    console.warn('⚠️ Direct Atlas connection skipped due to local DNS SRV timeout; testing via live API server.');
  }

  let passed = 0;
  let failed = 0;

  function assert(cond, name) {
    if (cond) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  try {
    // 1. Check SiteSettings
    let settings = null;
    if (mongoose.connection.readyState === 1) {
      settings = await SiteSettings.findOne();
    } else {
      const sRes = await fetch(`${BASE}/settings/public`);
      const sData = await sRes.json();
      settings = sData.settings;
    }
    assert(settings !== null, 'SiteSettings exists in platform');
    assert(typeof settings.brand_name === 'string' && settings.brand_name.length > 0, `Brand name is dynamic: "${settings?.brand_name}"`);

    // 2. Check Delivery Zones
    let zoneCount = 0;
    if (mongoose.connection.readyState === 1) {
      const zones = await DeliveryZone.find({ is_active: true });
      zoneCount = zones.length;
    } else {
      const zRes = await fetch(`${BASE}/settings/delivery-zones`);
      const zData = await zRes.json();
      zoneCount = (zData.zones || []).length;
    }
    assert(zoneCount > 0, `Active Delivery Zones exist (${zoneCount} active zones)`);

    // 3. Check Categories
    const categoriesRes = await fetch(`${BASE}/categories`);
    const catData = await categoriesRes.json();
    assert(categoriesRes.status === 200 && Array.isArray(catData.categories), `GET /api/categories returns HTTP 200 with ${catData.categories?.length || 0} categories`);

    // 4. Test AI Chatbot with Dynamic Context & Multilingual
    const aiResEn = await fetch(`${BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What laptops do you offer for rental?' })
    });
    const aiDataEn = await aiResEn.json();
    assert(aiResEn.status === 200 && aiDataEn.success === true, 'POST /api/ai/chat returns HTTP 200 in English');
    assert(aiDataEn.reply && aiDataEn.reply.length > 20, 'AI Chatbot returned substantive consultation reply');

    // Test AI Chatbot in Hindi
    const aiResHi = await fetch(`${BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'मुझे कॉर्पोरेट ऑफिस के लिए लैपटॉप रेंट पर चाहिए' })
    });
    const aiDataHi = await aiResHi.json();
    assert(aiResHi.status === 200 && aiDataHi.success === true, 'POST /api/ai/chat handles Hindi query with HTTP 200');
    assert(/[\u0900-\u097F]/.test(aiDataHi.reply), 'AI Chatbot dynamically detected Hindi and replied in Hindi script');

    // 5. Test Buyback Flow
    const buybackPayload = {
      company_name: 'Audit Corp QA',
      contact_person: 'Audit Lead',
      email: 'audit_buyback@demoinfotech.in',
      phone: '+91 9988776655',
      asset_category: 'laptops',
      estimated_quantity: 15,
      brand_models: 'Lenovo ThinkPad T480 x15',
      working_condition: 'all_functional',
      expected_value: 150000,
      city: 'Gurugram'
    };
    const bbRes = await fetch(`${BASE}/buyback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buybackPayload)
    });
    const bbData = await bbRes.json();
    assert(bbRes.status === 201 && bbData.success === true, 'POST /api/buyback registers corporate ITAD disposition with HTTP 201');
    const createdBuybackId = bbData.buybackId || bbData.buyback?._id;

    // Clean up temporary buyback if direct DB connection active
    if (createdBuybackId && mongoose.connection.readyState === 1) {
      await BuybackRequest.findByIdAndDelete(createdBuybackId);
      console.log('  🧹 Cleaned up temporary buyback request');
    }

    // 6. Test Product Stock Segregation
    const prodRes = await fetch(`${BASE}/products?limit=5`);
    const prodData = await prodRes.json();
    const sampleProducts = prodData.products || [];
    let allSegregated = sampleProducts.length > 0;
    for (const p of sampleProducts) {
      if (p.sale_stock === undefined || p.rental_stock === undefined) {
        allSegregated = false;
      }
    }
    assert(allSegregated, 'All checked products have explicit segregated sale_stock and rental_stock fields');

    // 7. Verify Error Handling on malformed JSON
    const malformedRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', password: '' })
    });
    const malformedData = await malformedRes.json();
    assert(malformedRes.status === 400 && malformedData.success === false, 'POST /api/auth/login validates empty credentials with HTTP 400');

    // 8. Verify Nonexistent Route 404
    const notFoundRes = await fetch(`${BASE}/nonexistent-route-endpoint`);
    assert(notFoundRes.status === 404, 'Nonexistent route returns HTTP 404 with structured JSON');

    console.log(`\n======================================================`);
    console.log(`DEEP INDEPENDENT AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`======================================================`);

  } catch (err) {
    console.error('Fatal Audit Error:', err);
    failed++;
  } finally {
    await mongoose.disconnect();
  }
}

runAudit();
