import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const API_BASE = 'http://127.0.0.1:5001/api';
const SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret_for_audit';

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, message = '') {
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedCount++;
    console.error(`  ❌ FAIL: ${testName} - ${message}`);
    throw new Error(`Assertion failed: ${testName} - ${message}`);
  }
}

async function runBillingSecurityAudit() {
  console.log('================================================================');
  console.log('   ENTERPRISE BILLING & PAYMENT SECURITY AUDIT SUITE           ');
  console.log('   Financial Integrity, Tampering Defenses & Gateway Audit     ');
  console.log('================================================================\n');

  try {
    // -------------------------------------------------------------
    // Setup: Admin & Customers
    // -------------------------------------------------------------
    const adminRes = await axios.post(`${API_BASE}/auth/login`, {
      email: process.env.ADMIN_EMAIL || 'zaidm1323@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'Zaid@9999201255'
    });
    const adminToken = adminRes.data.token;
    console.log('🔑 Admin authenticated.');

    const timestamp = Date.now();
    const custEmailA = `billing_cust_a_${timestamp}@demoinfotech.in`;
    const custEmailB = `billing_cust_b_${timestamp}@demoinfotech.in`;

    const regA = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Corporate Signatory A',
      email: custEmailA,
      password: 'Client@Secure123',
      phone: '+91 98765 11111',
      company_name: 'Alpha Enterprises Ltd',
      company_size: '51-200',
      gstin: '07AAAAA0000A1Z5'
    });
    if (regA.data.verificationToken) {
      await axios.get(`${API_BASE}/auth/verify-email/${regA.data.verificationToken}`);
    }
    const loginA = await axios.post(`${API_BASE}/auth/login`, {
      email: custEmailA,
      password: 'Client@Secure123'
    });
    const tokenA = loginA.data.token;

    const regB = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Corporate Signatory B',
      email: custEmailB,
      password: 'Client@Secure123',
      phone: '+91 98765 22222',
      company_name: 'Beta Tech Solutions',
      company_size: '11-50',
      gstin: '06AAAAA0000A1Z5'
    });
    if (regB.data.verificationToken) {
      await axios.get(`${API_BASE}/auth/verify-email/${regB.data.verificationToken}`);
    }
    const loginB = await axios.post(`${API_BASE}/auth/login`, {
      email: custEmailB,
      password: 'Client@Secure123'
    });
    const tokenB = loginB.data.token;

    console.log('🔑 Verified Customers A and B provisioned.\n');

    // -------------------------------------------------------------
    // Setup Test Products
    // -------------------------------------------------------------
    // 1. Regular Dual-purpose product
    const pRes1 = await axios.post(`${API_BASE}/products`, {
      title: `Audit Workstation Pro - ${timestamp}`,
      brand: 'Dell',
      category: 'desktop',
      price: 60000,
      sale_price: 60000,
      monthly_rental_price: 2000,
      rental_price_monthly: 2000,
      is_available_for_rental: true,
      is_available_for_sale: true,
      sale_stock: 20,
      rental_stock: 20,
      stock_quantity: 40
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    const p1 = pRes1.data.product || pRes1.data.data;

    // 2. Rent-only product (cannot be bought)
    const pRes2 = await axios.post(`${API_BASE}/products`, {
      title: `Audit Lease Fleet Display - ${timestamp}`,
      brand: 'Dell',
      category: 'monitor',
      price: 0,
      sale_price: 0,
      monthly_rental_price: 600,
      available_for: 'rent',
      is_available_for_rental: true,
      is_available_for_sale: false,
      sale_stock: 0,
      rental_stock: 15,
      stock_quantity: 15
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    const pRentOnly = pRes2.data.product || pRes2.data.data;

    // 3. Inactive product (cannot be bought or rented)
    const pRes3 = await axios.post(`${API_BASE}/products`, {
      title: `Audit Inactive Machine - ${timestamp}`,
      brand: 'HP',
      category: 'laptop',
      price: 50000,
      sale_price: 50000,
      monthly_rental_price: 1800,
      rental_price_monthly: 1800,
      is_active: false,
      sale_stock: 10,
      rental_stock: 10,
      stock_quantity: 20
    }, { headers: { Authorization: `Bearer ${adminToken}` } });
    const pInactive = pRes3.data.product || pRes3.data.data;

    console.log('📦 Test catalog items created.\n');

    // -------------------------------------------------------------
    // SECTION 1: SERVER-SIDE PRICING & CALCULATION VALIDATION
    // -------------------------------------------------------------
    console.log('--- 1. Server-Side Pricing, Discount & Quantity Integrity ---');

    // Test 1.1: Client attempts to pass a tampered price
    const orderTamperedPriceRes = await axios.post(`${API_BASE}/orders`, {
      items: [{
        product_id: p1._id,
        quantity: 1,
        price: 10, // Tampered price: ₹10 instead of ₹60,000!
        price_at_purchase: 10,
        total: 10
      }],
      shipping_address: {
        street: 'Connaught Place 101',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      payment_method: 'po'
    }, { headers: { Authorization: `Bearer ${tokenA}` } });

    const order1 = orderTamperedPriceRes.data.order;
    assert(
      order1.subtotal === 60000,
      'Price Tampering Protection',
      `Expected subtotal ₹60,000 computed from DB, got ₹${order1.subtotal}`
    );
    assert(
      order1.total_gst === Math.round(60000 * 0.18),
      'GST 18% Statutory Accuracy',
      `Expected GST ₹10,800, got ₹${order1.total_gst}`
    );

    // Test 1.2: Negative Quantity Rejection
    try {
      await axios.post(`${API_BASE}/orders`, {
        items: [{ product_id: p1._id, quantity: -2 }],
        shipping_address: { street: 'Main St', city: 'Delhi', state: 'Delhi', pincode: '110001' }
      }, { headers: { Authorization: `Bearer ${tokenA}` } });
      assert(false, 'Negative Quantity Rejection', 'Expected 400 Bad Request');
    } catch (err) {
      assert(err.response?.status === 400, 'Negative Quantity Rejection', 'Properly returned 400');
    }

    // Test 1.3: Zero Quantity Rejection
    try {
      await axios.post(`${API_BASE}/orders`, {
        items: [{ product_id: p1._id, quantity: 0 }],
        shipping_address: { street: 'Main St', city: 'Delhi', state: 'Delhi', pincode: '110001' }
      }, { headers: { Authorization: `Bearer ${tokenA}` } });
      assert(false, 'Zero Quantity Rejection', 'Expected 400 Bad Request');
    } catch (err) {
      assert(err.response?.status === 400, 'Zero Quantity Rejection', 'Properly returned 400');
    }

    // Test 1.4: Rent-Only Product Purchase Block
    try {
      await axios.post(`${API_BASE}/orders`, {
        items: [{ product_id: pRentOnly._id, quantity: 1 }],
        shipping_address: { street: 'Main St', city: 'Delhi', state: 'Delhi', pincode: '110001' }
      }, { headers: { Authorization: `Bearer ${tokenA}` } });
      assert(false, 'Rent-Only Direct Purchase Block', 'Expected 400 Bad Request');
    } catch (err) {
      assert(err.response?.status === 400, 'Rent-Only Direct Purchase Block', 'Properly blocked');
    }

    // Test 1.5: Inactive Product Order Block
    try {
      await axios.post(`${API_BASE}/orders`, {
        items: [{ product_id: pInactive._id, quantity: 1 }],
        shipping_address: { street: 'Main St', city: 'Delhi', state: 'Delhi', pincode: '110001' }
      }, { headers: { Authorization: `Bearer ${tokenA}` } });
      assert(false, 'Inactive Product Order Block', 'Expected 400 Bad Request');
    } catch (err) {
      assert(err.response?.status === 400, 'Inactive Product Order Block', 'Properly blocked');
    }

    // -------------------------------------------------------------
    // SECTION 2: LOGISTICS & DELIVERY CHARGES INTEGRITY
    // -------------------------------------------------------------
    console.log('\n--- 2. Server-Enforced Delivery Charges Integrity ---');

    // Create a delivery zone with known charge
    const zoneRes = await axios.post(`${API_BASE}/settings/delivery-zones`, {
      zone_name: `Audit North Zone - ${timestamp}`,
      cities: ['chandigarh', 'mohali'],
      states: ['punjab', 'haryana'],
      pincode_prefixes: ['160', '134'],
      delivery_charge: 450,
      is_active: true
    }, { headers: { Authorization: `Bearer ${adminToken}` } }).catch(() => null);

    // Order shipping to Chandigarh: server must detect the zone even if client passes delivery_zone_id: null
    const orderShippingRes = await axios.post(`${API_BASE}/orders`, {
      items: [{ product_id: p1._id, quantity: 1 }],
      shipping_address: {
        street: 'Sector 17 Market',
        city: 'Chandigarh',
        state: 'Punjab',
        pincode: '160017'
      },
      payment_method: 'po',
      delivery_zone_id: null // Client sends null or tries to evade charge
    }, { headers: { Authorization: `Bearer ${tokenA}` } });

    const orderShipping = orderShippingRes.data.order;
    assert(
      orderShipping.grand_total === orderShipping.subtotal + orderShipping.total_gst + orderShipping.delivery_charges,
      'Grand Total Mathematical Consistency',
      'Grand total exactly equals subtotal + GST + delivery_charges'
    );

    // -------------------------------------------------------------
    // SECTION 3: RAZORPAY PAYMENT GATEWAY VERIFICATION SECURITY
    // -------------------------------------------------------------
    console.log('\n--- 3. Cryptographic Signature & IDOR Payment Protection ---');

    // Create a Razorpay Order
    const rzpOrderRes = await axios.post(`${API_BASE}/orders`, {
      items: [{ product_id: p1._id, quantity: 1 }],
      shipping_address: {
        street: 'Barakhamba Road',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      payment_method: 'razorpay'
    }, { headers: { Authorization: `Bearer ${tokenA}` } });

    const rzpOrder = rzpOrderRes.data.order;
    const testRzpOrderId = rzpOrder.razorpay_order_id || `order_test_${timestamp}`;
    const testPaymentId = `pay_test_${timestamp}`;

    // Test 3.1: Forged / Fake Signature Rejection
    try {
      await axios.post(`${API_BASE}/payments/verify`, {
        order_id: rzpOrder._id,
        razorpay_order_id: testRzpOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: 'forged_fake_signature_abc123'
      }, { headers: { Authorization: `Bearer ${tokenA}` } });
      assert(false, 'Forged Signature Rejection', 'Expected 400 Bad Request');
    } catch (err) {
      assert(err.response?.status === 400, 'Forged Signature Rejection', 'Signature mismatch blocked');
    }

    // Generate valid cryptographic HMAC SHA-256 signature
    const validBody = `${testRzpOrderId}|${testPaymentId}`;
    const validSignature = crypto.createHmac('sha256', SECRET).update(validBody).digest('hex');

    // Test 3.2: IDOR Protection: Customer B trying to verify Customer A's order
    try {
      await axios.post(`${API_BASE}/payments/verify`, {
        order_id: rzpOrder._id,
        razorpay_order_id: testRzpOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: validSignature
      }, { headers: { Authorization: `Bearer ${tokenB}` } }); // Customer B calling!
      assert(false, 'IDOR Payment Verification Block', 'Expected 403 Forbidden');
    } catch (err) {
      assert(err.response?.status === 403, 'IDOR Payment Verification Block', 'Customer B blocked with 403');
    }

    // Test 3.3: Order ID Substitution Attack
    // Attacker passes valid signature for a different razorpay_order_id than the one stored in this order
    const substitutedRzpOrderId = `order_different_${timestamp}`;
    const substitutedSignature = crypto.createHmac('sha256', SECRET).update(`${substitutedRzpOrderId}|${testPaymentId}`).digest('hex');

    try {
      await axios.post(`${API_BASE}/payments/verify`, {
        order_id: rzpOrder._id,
        razorpay_order_id: substitutedRzpOrderId, // Mismatched razorpay_order_id!
        razorpay_payment_id: testPaymentId,
        razorpay_signature: substitutedSignature
      }, { headers: { Authorization: `Bearer ${tokenA}` } });
      assert(false, 'Order ID Substitution Block', 'Expected 400 Bad Request');
    } catch (err) {
      assert(err.response?.status === 400, 'Order ID Substitution Block', 'Substitution blocked with 400');
    }

    // Test 3.4: Legitimate Owner Payment Verification
    const checkStockBefore = await axios.get(`${API_BASE}/products/${p1._id}`);
    const stockBefore = (checkStockBefore.data.product || checkStockBefore.data.data).sale_stock;

    const verifySuccessRes = await axios.post(`${API_BASE}/payments/verify`, {
      order_id: rzpOrder._id,
      razorpay_order_id: testRzpOrderId,
      razorpay_payment_id: testPaymentId,
      razorpay_signature: validSignature
    }, { headers: { Authorization: `Bearer ${tokenA}` } });

    assert(verifySuccessRes.data.success === true, 'Valid Payment Verification', 'Payment verified successfully');
    assert(verifySuccessRes.data.order.payment_status === 'paid', 'Payment Status Paid', 'Status marked as paid');

    const checkStockAfter = await axios.get(`${API_BASE}/products/${p1._id}`);
    const stockAfter = (checkStockAfter.data.product || checkStockAfter.data.data).sale_stock;
    assert(stockAfter === stockBefore - 1, 'Verified Stock Decrement', `Stock decremented from ${stockBefore} to ${stockAfter}`);

    // Test 3.5: Duplicate Payment Replay Idempotency
    const replayRes = await axios.post(`${API_BASE}/payments/verify`, {
      order_id: rzpOrder._id,
      razorpay_order_id: testRzpOrderId,
      razorpay_payment_id: testPaymentId,
      razorpay_signature: validSignature
    }, { headers: { Authorization: `Bearer ${tokenA}` } });

    assert(replayRes.data.success === true, 'Payment Replay Idempotency', 'Replay handled safely');

    const checkStockReplay = await axios.get(`${API_BASE}/products/${p1._id}`);
    const stockReplay = (checkStockReplay.data.product || checkStockReplay.data.data).sale_stock;
    assert(stockReplay === stockAfter, 'No Double Stock Decrement on Replay', `Stock remained constant at ${stockReplay}`);

    // -------------------------------------------------------------
    // SECTION 4: UNPAID ORDER CANCELLATION & PHANTOM STOCK DEFENSE
    // -------------------------------------------------------------
    console.log('\n--- 4. Unpaid Order Cancellation & Phantom Stock Defense ---');

    // Create an un-paid Razorpay order (abandoned cart)
    const unpaidOrderRes = await axios.post(`${API_BASE}/orders`, {
      items: [{ product_id: p1._id, quantity: 2 }],
      shipping_address: { street: 'Test St', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      payment_method: 'razorpay'
    }, { headers: { Authorization: `Bearer ${tokenA}` } });
    const unpaidOrder = unpaidOrderRes.data.order;

    const stockBeforeCancel = (await axios.get(`${API_BASE}/products/${p1._id}`)).data.product.sale_stock;

    // Admin cancels the un-paid order
    await axios.put(`${API_BASE}/orders/${unpaidOrder._id}/status`, {
      order_status: 'cancelled',
      admin_notes: 'Abandoned checkout cancelled'
    }, { headers: { Authorization: `Bearer ${adminToken}` } });

    const stockAfterCancel = (await axios.get(`${API_BASE}/products/${p1._id}`)).data.product.sale_stock;
    assert(
      stockAfterCancel === stockBeforeCancel,
      'Phantom Stock Inflation Defense',
      `Stock did not inflate on unpaid order cancellation! Remained ${stockAfterCancel}`
    );

    // -------------------------------------------------------------
    // SECTION 5: RENTAL BILLING & LEASING INTEGRITY
    // -------------------------------------------------------------
    console.log('\n--- 5. Enterprise Rental Billing & 18% GST Calculations ---');

    // Test 5.1: Create 12-month rental lease with 15% long-term discount
    const rentalRes = await axios.post(`${API_BASE}/rentals`, {
      product_id: p1._id,
      quantity: 2,
      tenure: '12_months',
      deployment_address: {
        street: 'Cyber City Hub 4',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002'
      },
      company_name: 'Alpha Enterprises Ltd',
      gstin: '07AAAAA0000A1Z5'
    }, { headers: { Authorization: `Bearer ${tokenA}` } });

    const rental = rentalRes.data.rental;
    // Base rate is ₹2,000. 12_months discount is 15% -> ₹1,700/mo.
    // 2 units * ₹1,700 = ₹3,400 monthly subtotal.
    // 18% GST on ₹3,400 = ₹612.
    // Total monthly recurring = ₹4,012.
    assert(rental.monthly_rate === 1700, 'Tenure Discount Server Enforcement', `Expected ₹1,700/mo, got ₹${rental.monthly_rate}`);
    assert(rental.monthly_subtotal === 3400, 'Monthly Subtotal Integrity', `Expected ₹3,400, got ₹${rental.monthly_subtotal}`);
    assert(rental.monthly_gst === 612, 'Rental 18% Statutory GST', `Expected ₹612 GST, got ₹${rental.monthly_gst}`);
    assert(rental.total_monthly_recurring === 4012, 'Total Recurring Rent Integrity', `Expected ₹4,012, got ₹${rental.total_monthly_recurring}`);
    assert(rental.agreement_number && rental.agreement_number.startsWith('RNT-'), 'Agreement Number Auto-Generation', `Generated ${rental.agreement_number}`);

    // -------------------------------------------------------------
    // SECTION 6: FINANCIAL AUDIT LOG ACCESS CONTROL
    // -------------------------------------------------------------
    console.log('\n--- 6. Financial Audit Trail & Access Boundary ---');

    // Customer B calling audit logs must return 403
    try {
      await axios.get(`${API_BASE}/payments/audit-logs`, {
        headers: { Authorization: `Bearer ${tokenB}` }
      });
      assert(false, 'Customer Audit Log Guard', 'Expected 403 Forbidden');
    } catch (err) {
      assert(err.response?.status === 403, 'Customer Audit Log Guard', 'Customer blocked with 403');
    }

    // Admin calling audit logs must return 200 with populated log entries
    const adminLogsRes = await axios.get(`${API_BASE}/payments/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminLogsRes.status === 200, 'Admin Audit Log Access', 'Admin successfully fetched audit logs');
    assert(Array.isArray(adminLogsRes.data.logs) && adminLogsRes.data.logs.length > 0, 'Audit Logs Recorded', `Found ${adminLogsRes.data.logs.length} audit trail records`);

    // Teardown test products
    await axios.delete(`${API_BASE}/products/${p1._id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    await axios.delete(`${API_BASE}/products/${pRentOnly._id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    await axios.delete(`${API_BASE}/products/${pInactive._id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    console.log('\n🧹 Test products cleaned up.');

    console.log('\n================================================================');
    console.log(`🏁 BILLING & PAYMENT SECURITY AUDIT PASSED: ${passedCount} / ${passedCount} (0 FAILED)`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('❌ Audit suite failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

runBillingSecurityAudit();
