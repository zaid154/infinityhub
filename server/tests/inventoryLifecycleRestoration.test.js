import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const API_BASE = 'http://127.0.0.1:5001/api';

async function runInventoryLifecycleTest() {
  console.log('🧪 Starting Inventory Lifecycle & Stock Restoration Test...\n');

  try {
    // 1. Admin login
    const adminEmail = process.env.ADMIN_EMAIL || 'zaidm1323@gmail.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'Zaid@9999201255';
    const adminRes = await axios.post(`${API_BASE}/auth/login`, {
      email: adminEmail,
      password: adminPass
    });
    const adminToken = adminRes.data.token;
    console.log('✅ Admin authenticated successfully');

    // 2. Create customer and verify email
    const timestamp = Date.now();
    const customerEmail = `lifecycle_${timestamp}@demoinfotech.in`;
    const regRes = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Lifecycle QA Officer',
      email: customerEmail,
      password: 'Client@Secure123',
      phone: '+91 98765 43210',
      company_name: 'Lifecycle QA Pvt Ltd',
      company_size: '11-50',
      gstin: '07AAAAA0000A1Z5'
    });
    const verificationToken = regRes.data.verificationToken;
    console.log('✅ QA Customer registered');

    // Verify email
    if (verificationToken) {
      await axios.get(`${API_BASE}/auth/verify-email/${verificationToken}`);
      console.log('✅ QA Customer email verified');
    }

    // Login customer
    const custLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: customerEmail,
      password: 'Client@Secure123'
    });
    const customerToken = custLoginRes.data.token;
    console.log('✅ QA Customer logged in');

    // 3. Create test hardware product
    const productRes = await axios.post(`${API_BASE}/products`, {
      title: `QA Test ThinkPad T14 Gen 2 - ${timestamp}`,
      brand: 'Lenovo',
      category: 'laptop',
      price: 45000,
      monthly_rental_price: 1500,
      is_available_for_rental: true,
      is_available_for_sale: true,
      sale_stock: 10,
      rental_stock: 10,
      stock_quantity: 20,
      specs: {
        processor: 'Intel Core i7-1165G7',
        ram: '16GB DDR4',
        storage: '512GB NVMe SSD'
      }
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const product = productRes.data.product || productRes.data.data;
    const productId = product._id;
    console.log(`✅ Test product created: ID=${productId}, Initial Sale Stock=10, Rental Stock=10`);

    // 4. Customer creates Purchase Order for 2 units
    const orderRes = await axios.post(`${API_BASE}/orders`, {
      items: [{
        product_id: productId,
        quantity: 2,
        price_at_purchase: 45000
      }],
      shipping_address: {
        street: 'Connaught Place 101',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      payment_method: 'po',
      notes: 'Urgent corporate rollout'
    }, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const order = orderRes.data.order || orderRes.data.data;
    const orderId = order._id;
    console.log(`✅ Customer created PO Order: ID=${orderId}`);

    // Check product stock after PO creation
    let prodCheck1 = await axios.get(`${API_BASE}/products/${productId}`);
    const pData1 = prodCheck1.data.product || prodCheck1.data.data;
    console.log(`📊 After PO Order: Sale Stock = ${pData1.sale_stock} (Expected 8)`);
    if (pData1.sale_stock !== 8) {
      throw new Error(`Expected sale_stock 8, got ${pData1.sale_stock}`);
    }

    // 5. Admin cancels Order -> Verifying Sale Stock Restoration
    await axios.put(`${API_BASE}/orders/${orderId}/status`, {
      order_status: 'cancelled',
      admin_notes: 'Cancelled due to project rescheduling'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    let prodCheck2 = await axios.get(`${API_BASE}/products/${productId}`);
    const pData2 = prodCheck2.data.product || prodCheck2.data.data;
    console.log(`📊 After PO Order Cancellation: Sale Stock = ${pData2.sale_stock} (Expected 10)`);
    if (pData2.sale_stock !== 10) {
      throw new Error(`Expected restored sale_stock 10, got ${pData2.sale_stock}`);
    }
    console.log('✅ PASS: Order cancellation successfully restored sale_stock!');

    // 6. Customer creates Rental Lease for 3 units
    const rentalRes = await axios.post(`${API_BASE}/rentals`, {
      product_id: productId,
      quantity: 3,
      tenure_months: 6,
      deployment_address: {
        street: 'Cyber City Hub 4',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002'
      },
      company_name: 'Lifecycle QA Pvt Ltd',
      gstin: '07AAAAA0000A1Z5'
    }, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const rental = rentalRes.data.rental || rentalRes.data.data;
    const rentalId = rental._id;
    console.log(`✅ Customer created Rental: ID=${rentalId}`);

    let prodCheck3 = await axios.get(`${API_BASE}/products/${productId}`);
    const pData3 = prodCheck3.data.product || prodCheck3.data.data;
    console.log(`📊 After Rental Lease: Rental Stock = ${pData3.rental_stock} (Expected 7)`);
    if (pData3.rental_stock !== 7) {
      throw new Error(`Expected rental_stock 7, got ${pData3.rental_stock}`);
    }

    // 7. Admin updates rental to returned -> Verifying Rental Stock Restoration
    await axios.put(`${API_BASE}/rentals/${rentalId}/status`, {
      rental_status: 'returned',
      notes: 'Full fleet returned in Grade A condition'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    let prodCheck4 = await axios.get(`${API_BASE}/products/${productId}`);
    const pData4 = prodCheck4.data.product || prodCheck4.data.data;
    console.log(`📊 After Rental Return: Rental Stock = ${pData4.rental_stock} (Expected 10)`);
    if (pData4.rental_stock !== 10) {
      throw new Error(`Expected restored rental_stock 10, got ${pData4.rental_stock}`);
    }
    console.log('✅ PASS: Rental return successfully restored rental_stock!');

    // 8. Admin updates order with tracking info & Customer verifies in MyOrders
    const orderRes2 = await axios.post(`${API_BASE}/orders`, {
      items: [{
        product_id: productId,
        quantity: 1,
        price_at_purchase: 45000
      }],
      shipping_address: {
        street: 'Barakhamba Road',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      payment_method: 'po'
    }, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const order2 = orderRes2.data.order || orderRes2.data.data;
    const order2Id = order2._id;

    await axios.put(`${API_BASE}/orders/${order2Id}/status`, {
      order_status: 'shipped',
      courier_name: 'BlueDart Express Corporate Priority',
      tracking_number: 'BLUEDART-88992211-DL',
      admin_notes: 'Inspected Grade A+ and dispatched via secure logistics vehicle.'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const myOrdersRes = await axios.get(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const myOrdersList = myOrdersRes.data.orders || myOrdersRes.data.data || myOrdersRes.data;
    const customerOrder = Array.isArray(myOrdersList) ? myOrdersList.find(o => o._id === order2Id) : null;
    if (!customerOrder) throw new Error('Order not found in my-orders');
    console.log('📊 Customer Order Data in MyOrders:', {
      order_status: customerOrder.order_status,
      courier_name: customerOrder.courier_name,
      tracking_number: customerOrder.tracking_number,
      admin_notes: customerOrder.admin_notes
    });

    if (customerOrder.tracking_number !== 'BLUEDART-88992211-DL' || customerOrder.courier_name !== 'BlueDart Express Corporate Priority') {
      throw new Error('Customer order missing courier or tracking details');
    }
    console.log('✅ PASS: Customer MyOrders successfully reflects real-time courier tracking details!');

    // 9. Cleanup test product
    await axios.delete(`${API_BASE}/products/${productId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('🧹 Cleaned up temporary test product.');

    console.log('\n======================================================');
    console.log('🏁 INVENTORY LIFECYCLE & TRACKING SUITE PASSED 100%!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

runInventoryLifecycleTest();
