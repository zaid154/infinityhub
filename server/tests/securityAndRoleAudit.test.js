import http from 'http';
import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

// Ensure robust DNS resolution on Windows environments for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore fallback
}

const BASE_URL = 'http://127.0.0.1:5001';

// Helper for making HTTP requests
function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

// Simple test harness
const results = [];
async function test(name, fn) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    results.push({ name, passed: false, error: err.message });
    console.log(`  ✗ FAIL: ${name}`);
    console.log(`        Error: ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

async function runAllTests() {
  console.log('\n================================================================');
  console.log('   NOVA INFOTECH MASTER ENGINEERING & SECURITY AUDIT SUITE v2   ');
  console.log('   Lead Auditor: 25-Year Veteran Executive Director of Engg     ');
  console.log('================================================================\n');

  let customerTokenA = null;
  let customerTokenB = null;
  let adminToken = null;
  let testProductId = null;
  let testSaleProductId = null;
  let testRentalProductId = null;
  let testOrderId = null;
  let testRentalId = null;
  let testInquiryId = null;
  let createdProductIds = [];
  let createdUserIds = [];
  let createdOrderIds = [];
  let createdRentalIds = [];
  let createdInquiryIds = [];

  // ── 1. PUBLIC & GUEST ENDPOINTS ──────────────────────────────────────
  console.log('--- 1. Guest Visitor Public API Tests ---');

  await test('GET /api/health should return status online', async () => {
    const res = await request('GET', '/api/health');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.status === 'online', 'Expected status: online');
  });

  await test('GET /api/products should return catalog array', async () => {
    const res = await request('GET', '/api/products?limit=20');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Expected success: true');
    assert(Array.isArray(res.body.products), 'Expected products array');
    assert(res.body.products.length > 0, 'Expected at least 1 product');
    const rentalItem = res.body.products.find((p) => (p.rental_stock || 0) > 0 && p.available_for === 'rent');
    const saleItem = res.body.products.find((p) => (p.sale_stock || 0) > 0 && p.available_for === 'sale');
    testRentalProductId = rentalItem ? rentalItem._id : res.body.products[0]._id;
    testSaleProductId = saleItem ? saleItem._id : res.body.products[0]._id;
    testProductId = testSaleProductId;
  });

  await test('GET /api/settings should return corporate legal settings', async () => {
    const res = await request('GET', '/api/settings');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Expected success: true');
  });

  await test('POST /api/inquiries validation: missing phone should return 400', async () => {
    const res = await request('POST', '/api/inquiries', {
      company_name: 'Test Corp',
      contact_person: 'John Doe'
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    assert(res.body.success === false, 'Expected success: false');
  });

  await test('POST /api/inquiries with valid RFQ should return 201', async () => {
    const res = await request('POST', '/api/inquiries', {
      company_name: '[TEST-AUDIT] TechNova Enterprise',
      contact_person: 'Audit Lead',
      phone: '+91 98100 00000',
      email: 'audit-rfq@novainfotech.com',
      inquiry_type: 'rental',
      quantity: '25 Units',
      message: 'Automated test RFQ for fleet lease.'
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.success === true, 'Expected success: true');
    testInquiryId = res.body.inquiryId;
    if (testInquiryId) createdInquiryIds.push(testInquiryId);
  });

  // ── 2. AUTHENTICATION & MULTI-USER ISOLATION ─────────────────────────
  console.log('\n--- 2. Authentication & Credential Security ---');

  const testEmailA = `audit-client-a-${Date.now()}@novainfotech.com`;
  const testEmailB = `audit-client-b-${Date.now()}@novainfotech.com`;
  let verificationTokenA = null;
  let verificationTokenB = null;

  await test('POST /api/auth/register should create Customer A account with token', async () => {
    const res = await request('POST', '/api/auth/register', {
      name: 'Client Alpha Signatory',
      email: testEmailA,
      password: 'Client@Secure123',
      phone: '+91 98765 00001',
      company_name: '[TEST-AUDIT] Client Alpha Corp'
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.userId, 'Expected userId');
    createdUserIds.push(res.body.userId);
    verificationTokenA = res.body.verificationToken;
  });

  await test('POST /api/auth/register should create Customer B account with token', async () => {
    const res = await request('POST', '/api/auth/register', {
      name: 'Client Beta Signatory',
      email: testEmailB,
      password: 'Client@Secure123',
      phone: '+91 98765 00002',
      company_name: '[TEST-AUDIT] Client Beta Ltd'
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.userId, 'Expected userId');
    createdUserIds.push(res.body.userId);
    verificationTokenB = res.body.verificationToken;
  });

  await test('GET /api/auth/verify-email should verify Customer A email', async () => {
    const res = await request('GET', `/api/auth/verify-email/${verificationTokenA}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Expected email verified');
  });

  await test('GET /api/auth/verify-email should verify Customer B email', async () => {
    const res = await request('GET', `/api/auth/verify-email/${verificationTokenB}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Expected email verified');
  });

  await test('POST /api/auth/login with wrong password must return 401', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: testEmailA,
      password: 'WrongPassword999'
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('POST /api/auth/login as Customer A should return customer JWT', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: testEmailA,
      password: 'Client@Secure123'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.token, 'Expected JWT token');
    assert(res.body.user.role === 'customer', 'Expected customer role');
    customerTokenA = res.body.token;
  });

  await test('POST /api/auth/login as Customer B should return customer JWT', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: testEmailB,
      password: 'Client@Secure123'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    customerTokenB = res.body.token;
  });

  await test('POST /api/auth/login as Admin should return admin JWT token', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: process.env.ADMIN_EMAIL || 'zaidm1323@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'Zaid@9999201255'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.user.role === 'admin', 'Expected admin role');
    adminToken = res.body.token;
  });

  // ── 3. ACCESS CONTROL & ROLE BOUNDARIES ──────────────────────────────
  console.log('\n--- 3. Safety & Security Boundary Enforcement ---');

  await test('SECURITY: Unauthenticated GET /api/admin/analytics must return 401', async () => {
    const res = await request('GET', '/api/admin/analytics');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('SECURITY: Customer token calling GET /api/admin/analytics must return 403', async () => {
    const res = await request('GET', '/api/admin/analytics', null, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  });

  await test('SECURITY: Customer token calling POST /api/products (Create Product) must return 403', async () => {
    const res = await request('POST', '/api/products', { title: 'Unauthorized' }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  });

  await test('SECURITY: Forged/Tampered token must return 401', async () => {
    const res = await request('GET', '/api/admin/analytics', null, {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token'
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  // ── 4. INPUT INJECTION & FINANCIAL TAMPERING PROTECTIONS ──────────────
  console.log('\n--- 4. Input Injection & Financial Tampering Protections ---');

  await test('SECURITY: Order with negative quantity (-5) must return 400', async () => {
    const res = await request('POST', '/api/orders', {
      items: [{ product_id: testProductId, quantity: -5 }],
      shipping_address: { street: 'Main St', phone: '+919810000000' },
      payment_method: 'po'
    }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    assert(res.body.message.includes('Invalid quantity'), 'Expected invalid quantity message');
  });

  await test('SECURITY: Order with zero quantity (0) must return 400', async () => {
    const res = await request('POST', '/api/orders', {
      items: [{ product_id: testProductId, quantity: 0 }],
      shipping_address: { street: 'Main St', phone: '+919810000000' },
      payment_method: 'po'
    }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('SECURITY: Order quantity exceeding available sale_stock must return 400', async () => {
    const res = await request('POST', '/api/orders', {
      items: [{ product_id: testProductId, quantity: 999999 }],
      shipping_address: { street: 'Main St', phone: '+919810000000' },
      payment_method: 'po'
    }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('SECURITY: Rental with negative quantity (-2) must return 400', async () => {
    const res = await request('POST', '/api/rentals', {
      product_id: testRentalProductId,
      quantity: -2,
      tenure: '6_months'
    }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('SECURITY: Rental with tampered monthly_rate: 1 must be sanitized to verified DB rate', async () => {
    const res = await request('POST', '/api/rentals', {
      product_id: testRentalProductId,
      quantity: 1,
      tenure: '6_months',
      monthly_rate: 1 // Malicious client attempt to pay ₹1/month
    }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.rental.monthly_rate > 100, `Rate should be verified DB rate, got ₹${res.body.rental.monthly_rate}`);
    testRentalId = res.body.rental._id;
    if (testRentalId) createdRentalIds.push(testRentalId);
  });

  // ── 5. CORPORATE CUSTOMER WORKFLOWS & IDOR TESTS ──────────────────────
  console.log('\n--- 5. Corporate Customer Workflows & IDOR Protection ---');

  await test('CUSTOMER A: Create Corporate Purchase Order (Net-30 PO)', async () => {
    const res = await request('POST', '/api/orders', {
      items: [{ product_id: testProductId, quantity: 1 }],
      shipping_address: {
        company_name: '[TEST-AUDIT] Client Alpha Corp',
        contact_person: 'Alpha Lead',
        phone: '+91 98765 00001',
        street: 'Tower A, Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        gst_number: '07AAAAA0000A1Z5'
      },
      payment_method: 'po'
    }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.order._id, 'Expected order._id');
    assert(res.body.order.order_status === 'placed', 'Expected order_status: placed');
    testOrderId = res.body.order._id;
    if (testOrderId) createdOrderIds.push(testOrderId);

    // Verify GST 18% math accuracy down to the exact rupee
    const o = res.body.order;
    const expectedGst = Math.round((o.subtotal * 18) / 100);
    assert(o.total_gst === expectedGst, `Expected GST ${expectedGst}, got ${o.total_gst}`);
    assert(o.grand_total === o.subtotal + o.total_gst + o.delivery_charges, 'Grand total must equal subtotal + gst + delivery');
  });

  await test('IDOR PROTECTION: Customer B attempting GET /api/orders/:id of Customer A must return 403', async () => {
    const res = await request('GET', `/api/orders/${testOrderId}`, null, {
      Authorization: `Bearer ${customerTokenB}`
    });
    assert(res.status === 403, `Expected 403 Forbidden for unauthorized customer, got ${res.status}`);
  });

  await test('CUSTOMER A: Allowed GET /api/orders/:id of own order should return 200', async () => {
    const res = await request('GET', `/api/orders/${testOrderId}`, null, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.order._id === testOrderId, 'Order ID must match');
  });

  await test('CUSTOMER A: Fetch My Orders (/dashboard/orders)', async () => {
    const res = await request('GET', '/api/orders/my-orders', null, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.orders.length > 0, 'Expected at least 1 order');
  });

  await test('CUSTOMER A: Fetch My Rentals (/dashboard/rentals)', async () => {
    const res = await request('GET', '/api/rentals/my-rentals', null, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.rentals.length > 0, 'Expected at least 1 rental');
  });

  // ── 6. ADMIN OPERATIONS & INVENTORY SEGREGATION ───────────────────────
  console.log('\n--- 6. Super Admin Operations & Inventory Segregation ---');

  await test('ADMIN: GET /api/admin/analytics should return operational metrics', async () => {
    const res = await request('GET', '/api/admin/analytics', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.stats, 'Expected stats object');
    assert(typeof res.body.stats.totalProducts === 'number', 'Expected totalProducts count');
  });

  let createdAuditProduct = null;
  await test('ADMIN: Create hardware product with segregated stock pools', async () => {
    const res = await request('POST', '/api/products', {
      title: `[TEST-AUDIT] Dell Precision Workstation ${Date.now()}`,
      brand: 'Dell',
      category: 'laptop',
      condition: 'grade_a_plus',
      available_for: 'both',
      sale_price: 68500,
      rental_price_monthly: 3200,
      sale_stock: 10,
      rental_stock: 5,
      gst_rate: 18,
      specs: {
        processor: 'Intel Xeon W-10855M',
        ram: '32GB ECC DDR4',
        storage: '1TB NVMe Gen3',
        display: '15.6" UHD 4K Calibrated'
      },
      description: 'Audit test enterprise workstation with dedicated NVIDIA Quadro RTX 4000 GPU.'
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.product.sale_stock === 10, 'Expected sale_stock 10');
    assert(res.body.product.rental_stock === 5, 'Expected rental_stock 5');
    createdAuditProduct = res.body.product;
    createdProductIds.push(createdAuditProduct._id);
  });

  await test('DUAL-STOCK SEGREGATION: Purchase order decrements sale_stock WITHOUT affecting rental_stock', async () => {
    const res = await request('POST', '/api/orders', {
      items: [{ product_id: createdAuditProduct._id, quantity: 2 }],
      shipping_address: { street: 'Main St', phone: '+919810000000' },
      payment_method: 'po'
    }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    if (res.body.order?._id) createdOrderIds.push(res.body.order._id);

    // Verify stock counters via admin fetch
    const prodRes = await request('GET', `/api/products/${createdAuditProduct.slug}`);
    assert(prodRes.status === 200, 'Expected 200 fetching product');
    const p = prodRes.body.product;
    assert(p.sale_stock === 8, `Expected sale_stock to be 8 (10-2), got ${p.sale_stock}`);
    assert(p.rental_stock === 5, `Expected rental_stock to remain 5, got ${p.rental_stock}`);
  });

  await test('DUAL-STOCK SEGREGATION: Rental lease decrements rental_stock WITHOUT affecting sale_stock', async () => {
    const res = await request('POST', '/api/rentals', {
      product_id: createdAuditProduct._id,
      quantity: 1,
      tenure: '6_months'
    }, {
      Authorization: `Bearer ${customerTokenA}`
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    if (res.body.rental?._id) createdRentalIds.push(res.body.rental._id);

    const prodRes = await request('GET', `/api/products/${createdAuditProduct.slug}`);
    assert(prodRes.status === 200, 'Expected 200 fetching product');
    const p = prodRes.body.product;
    assert(p.rental_stock === 4, `Expected rental_stock to be 4 (5-1), got ${p.rental_stock}`);
    assert(p.sale_stock === 8, `Expected sale_stock to remain 8, got ${p.sale_stock}`);
  });

  await test('ADMIN: Update customer PO status to shipped with tracking number', async () => {
    const res = await request('PUT', `/api/orders/${testOrderId}/status`, {
      order_status: 'shipped',
      tracking_number: 'BLUEDART-EXP-992011'
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.order.order_status === 'shipped', 'Expected shipped status');
  });

  await test('ADMIN: Update rental status to active with contract note', async () => {
    const res = await request('PUT', `/api/rentals/${testRentalId}/status`, {
      status: 'active',
      admin_notes: 'Enterprise SLA 24h replacement active.'
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('ADMIN: Update RFQ inquiry status to contacted', async () => {
    const res = await request('PUT', `/api/inquiries/${testInquiryId}`, {
      status: 'contacted'
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.inquiry.status === 'contacted', 'Expected contacted');
  });

  // ── 7. POST-AUDIT CLEAN TEARDOWN ──────────────────────────────────────
  console.log('\n--- 7. Post-Audit Database Teardown & Sanitization ---');

  await test('TEARDOWN: Clean up temporary test products, orders, rentals, users & inquiries', async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/al-tooba-ecommerce');
    const db = mongoose.connection.db;

    if (createdProductIds.length > 0) {
      await db.collection('products').deleteMany({
        $or: [{ _id: { $in: createdProductIds.map(id => new mongoose.Types.ObjectId(id)) } }, { title: /TEST-AUDIT/i }]
      });
    }
    if (createdOrderIds.length > 0) {
      await db.collection('orders').deleteMany({
        _id: { $in: createdOrderIds.map(id => new mongoose.Types.ObjectId(id)) }
      });
    }
    if (createdRentalIds.length > 0) {
      await db.collection('rentals').deleteMany({
        _id: { $in: createdRentalIds.map(id => new mongoose.Types.ObjectId(id)) }
      });
    }
    if (createdUserIds.length > 0) {
      await db.collection('users').deleteMany({
        _id: { $in: createdUserIds.map(id => new mongoose.Types.ObjectId(id)) }
      });
    }
    if (createdInquiryIds.length > 0) {
      await db.collection('inquiries').deleteMany({
        _id: { $in: createdInquiryIds.map(id => new mongoose.Types.ObjectId(id)) }
      });
    }
    // Restore seed product stock decremented during test purchase/rental orders
    if (testSaleProductId) {
      await db.collection('products').updateOne(
        { _id: new mongoose.Types.ObjectId(testSaleProductId) },
        { $set: { sale_stock: 10, stock_quantity: 10 } }
      );
    }
    if (testRentalProductId) {
      await db.collection('products').updateOne(
        { _id: new mongoose.Types.ObjectId(testRentalProductId) },
        { $set: { rental_stock: 5, stock_quantity: 5 } }
      );
    }
    await mongoose.disconnect();
    console.log('    ✓ All test records safely sanitized from MongoDB');
  });

  // ── FINAL SUMMARY ────────────────────────────────────────────────────
  console.log('\n================================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`MASTER AUDIT RESULT: ${passed}/${total} TESTS PASSED (${failed} FAILED)`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error('[FATAL AUDIT ERROR]', err);
  process.exit(1);
});
