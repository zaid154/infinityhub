import http from 'http';

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
    console.log(`  PASS: ${name}`);
  } catch (err) {
    results.push({ name, passed: false, error: err.message });
    console.log(`  FAIL: ${name}`);
    console.log(`        Error: ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('   NOVA INFOTECH MASTER SECURITY & ROLE AUDIT SUITE   ');
  console.log('======================================================\n');

  let customerToken = null;
  let adminToken = null;
  let testProductId = null;
  let testOrderId = null;
  let testRentalId = null;
  let testInquiryId = null;

  // ── 1. PUBLIC / GUEST ENDPOINTS ──────────────────────────────────────
  console.log('\n--- 1. Guest Visitor Public API Tests ---');

  await test('GET /api/health should return status online', async () => {
    const res = await request('GET', '/api/health');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.status === 'online', 'Expected status: online');
  });

  await test('GET /api/products should return catalog array', async () => {
    const res = await request('GET', '/api/products?limit=5');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Expected success: true');
    assert(Array.isArray(res.body.products), 'Expected products array');
    assert(res.body.products.length > 0, 'Expected at least 1 product');
    testProductId = res.body.products[0]._id;
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
  });

  // ── 2. AUTHENTICATION & SESSIONS ─────────────────────────────────────
  console.log('\n--- 2. Authentication & Credential Security ---');

  const testEmail = `audit-client-${Date.now()}@novainfotech.com`;
  let verificationToken = null;

  await test('POST /api/auth/register should create customer account with verification token', async () => {
    const res = await request('POST', '/api/auth/register', {
      name: 'Audit Client Signatory',
      email: testEmail,
      password: 'Client@Secure123',
      phone: '+91 98765 00000',
      company_name: '[TEST-AUDIT] Global FinTech Ltd'
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.userId, 'Expected userId in response');
    verificationToken = res.body.verificationToken;
  });

  await test('GET /api/auth/verify-email should verify the customer email', async () => {
    assert(verificationToken, 'Verification token must be present');
    const res = await request('GET', `/api/auth/verify-email/${verificationToken}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, 'Expected email verified');
  });

  await test('POST /api/auth/login with wrong password should return 401', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'WrongPassword999'
    });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('POST /api/auth/login as verified Customer should return customer JWT token', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'Client@Secure123'
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.token, 'Expected JWT token');
    assert(res.body.user.role === 'customer', 'Expected customer role');
    customerToken = res.body.token;
  });

  await test('POST /api/auth/login as Admin should return admin JWT token', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: 'admin@technova.com',
      password: 'Admin@123'
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
      Authorization: `Bearer ${customerToken}`
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  });

  await test('SECURITY: Forged/Tampered token must return 401', async () => {
    const res = await request('GET', '/api/admin/analytics', null, {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.token'
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  // ── 4. INPUT INJECTION & TAMPERING RESISTANCE ─────────────────────────
  console.log('\n--- 4. Input Injection & Rate Tampering Protections ---');

  await test('SECURITY: Order with negative quantity (-5) must return 400', async () => {
    const res = await request('POST', '/api/orders', {
      items: [{ product_id: testProductId, quantity: -5 }],
      shipping_address: { street: 'Main St', phone: '+919810000000' },
      payment_method: 'po'
    }, {
      Authorization: `Bearer ${customerToken}`
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
      Authorization: `Bearer ${customerToken}`
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('SECURITY: Order quantity exceeding sale_stock must return 400', async () => {
    const res = await request('POST', '/api/orders', {
      items: [{ product_id: testProductId, quantity: 999999 }],
      shipping_address: { street: 'Main St', phone: '+919810000000' },
      payment_method: 'po'
    }, {
      Authorization: `Bearer ${customerToken}`
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('SECURITY: Rental with negative quantity (-2) must return 400', async () => {
    const res = await request('POST', '/api/rentals', {
      product_id: testProductId,
      quantity: -2,
      tenure: '6_months'
    }, {
      Authorization: `Bearer ${customerToken}`
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test('SECURITY: Rental with tampered monthly_rate: 1 should be sanitized by server', async () => {
    const res = await request('POST', '/api/rentals', {
      product_id: testProductId,
      quantity: 1,
      tenure: '6_months',
      monthly_rate: 1 // Malicious client attempt to pay ₹1/month
    }, {
      Authorization: `Bearer ${customerToken}`
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.rental.monthly_rate > 100, `Rate should be verified DB rate, got ₹${res.body.rental.monthly_rate}`);
    testRentalId = res.body.rental._id;
  });

  // ── 5. CUSTOMER END-TO-END WORKFLOWS ─────────────────────────────────
  console.log('\n--- 5. Corporate Customer Full Workflows ---');

  await test('CUSTOMER: Create Corporate Purchase Order (Net-30 PO)', async () => {
    const res = await request('POST', '/api/orders', {
      items: [{ product_id: testProductId, quantity: 1 }],
      shipping_address: {
        company_name: '[TEST-AUDIT] Global FinTech Ltd',
        contact_person: 'Audit Lead',
        phone: '+91 98765 00000',
        street: 'Building 4, Tech Park, Gurugram',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        gst_number: '07AAAAA0000A1Z5'
      },
      payment_method: 'po'
    }, {
      Authorization: `Bearer ${customerToken}`
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    assert(res.body.order._id, 'Expected order._id');
    assert(res.body.order.order_status === 'placed', 'Expected order_status: placed');
    testOrderId = res.body.order._id;
  });

  await test('CUSTOMER: Fetch My Orders (/dashboard/orders)', async () => {
    const res = await request('GET', '/api/orders/my-orders', null, {
      Authorization: `Bearer ${customerToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.orders.length > 0, 'Expected at least 1 order');
  });

  await test('CUSTOMER: Fetch My Rentals (/dashboard/rentals)', async () => {
    const res = await request('GET', '/api/rentals/my-rentals', null, {
      Authorization: `Bearer ${customerToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.rentals.length > 0, 'Expected at least 1 rental');
  });

  // ── 6. ADMIN WORKFLOWS & MANAGEMENT ──────────────────────────────────
  console.log('\n--- 6. Super Admin Operations & Management ---');

  await test('ADMIN: GET /api/admin/analytics should return dashboard metrics', async () => {
    const res = await request('GET', '/api/admin/analytics', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.stats, 'Expected stats object');
    assert(typeof res.body.stats.totalProducts === 'number', 'Expected totalProducts');
  });

  await test('ADMIN: Create new hardware product with segregated stock', async () => {
    const res = await request('POST', '/api/products', {
      title: `[TEST-AUDIT] Dell Precision 7550 Workstation ${Date.now()}`,
      brand: 'Dell',
      category: 'laptop',
      condition: 'grade_a_plus',
      available_for: 'both',
      sale_price: 68500,
      rental_price_monthly: 3200,
      sale_stock: 8,
      rental_stock: 4,
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
    assert(res.body.product.sale_stock === 8, 'Expected sale_stock 8');
    assert(res.body.product.rental_stock === 4, 'Expected rental_stock 4');
  });

  await test('ADMIN: Update customer PO status to shipped', async () => {
    const res = await request('PUT', `/api/orders/${testOrderId}/status`, {
      order_status: 'shipped'
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.order.order_status === 'shipped', 'Expected shipped');
  });

  await test('ADMIN: Update rental status to active', async () => {
    const res = await request('PUT', `/api/rentals/${testRentalId}/status`, {
      status: 'active'
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  await test('ADMIN: Update inquiry status to contacted', async () => {
    const res = await request('PUT', `/api/inquiries/${testInquiryId}`, {
      status: 'contacted'
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.inquiry.status === 'contacted', 'Expected contacted');
  });

  // ── FINAL SUMMARY ────────────────────────────────────────────────────
  console.log('\n======================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`AUDIT RESULT: ${passed}/${total} TESTS PASSED (${failed} FAILED)`);
  console.log('======================================================\n');

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
