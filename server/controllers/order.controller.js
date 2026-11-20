import Order from '../models/Order.js';
import Product from '../models/Product.js';
import DeliveryZone from '../models/DeliveryZone.js';
import PaymentAuditLog from '../models/PaymentAuditLog.js';
import razorpayInstance from '../config/razorpay.js';

// @desc    Create new order & initiate Razorpay order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shipping_address, delivery_zone_id, payment_method = 'razorpay' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let subtotal = 0;
    let total_gst = 0;
    const orderItems = [];

    // Calculate item pricing and GST based on admin-defined product gst_rate
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product_id} not found` });
      }

      // Security Check: Inactive or archived products cannot be purchased
      if (product.is_active === false) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.title}" is currently unavailable for order.`
        });
      }

      // Security Check: Products marked rent-only cannot be purchased
      if (product.available_for === 'rent') {
        return res.status(400).json({
          success: false,
          message: `Product "${product.title}" is available for enterprise rental leasing only, not direct purchase.`
        });
      }

      // Security Check: Validate valid sale price
      if (!product.sale_price || product.sale_price <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid purchase pricing for "${product.title}". Please request a custom quote.`
        });
      }

      const qty = Number(item.quantity);
      if (!qty || qty <= 0 || !Number.isInteger(qty)) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for "${product.title}". Quantity must be a positive integer.`
        });
      }
      const maxSale = product.sale_stock !== undefined ? product.sale_stock : product.stock_quantity;
      if (qty > maxSale) {
        return res.status(400).json({
          success: false,
          message: `Requested ${qty} units of "${product.title}", but only ${maxSale} units are available for immediate purchase. Please adjust quantity.`
        });
      }

      const unitPrice = product.sale_price;
      const itemSubtotal = unitPrice * qty;
      const gstRate = product.gst_rate || 18;
      const itemGst = Math.round((itemSubtotal * gstRate) / 100);
      const itemTotal = itemSubtotal + itemGst;

      subtotal += itemSubtotal;
      total_gst += itemGst;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: unitPrice,
        quantity: qty,
        gst_rate: gstRate,
        gst_amount: itemGst,
        total: itemTotal
      });
    }

    // 100% Server-Enforced Delivery Zone Resolution (Prevents client tampering of delivery charges)
    let delivery_charges = 0;
    let matchedZoneId = null;

    if (shipping_address) {
      const activeZones = await DeliveryZone.find({ is_active: true });
      const pin = (shipping_address.pincode || '').trim();
      const city = (shipping_address.city || '').trim().toLowerCase();
      const state = (shipping_address.state || '').trim().toLowerCase();

      // 1. Pincode prefix match
      let zone = null;
      if (pin && pin.length >= 2) {
        zone = activeZones.find(z =>
          Array.isArray(z.pincode_prefixes) && z.pincode_prefixes.some(p => p && pin.startsWith(p.trim()))
        );
      }
      // 2. City match
      if (!zone && city) {
        zone = activeZones.find(z =>
          Array.isArray(z.cities) && z.cities.some(c => c && (city === c.trim().toLowerCase() || city.includes(c.trim().toLowerCase())))
        );
      }
      // 3. State match
      if (!zone && state) {
        zone = activeZones.find(z =>
          Array.isArray(z.states) && z.states.some(s => s && (state === s.trim().toLowerCase() || state.includes(s.trim().toLowerCase())))
        );
      }
      // 4. Fallback / Default zone
      if (!zone) {
        zone = activeZones.find(z =>
          (z.zone_name || '').toLowerCase().includes('rest of') ||
          (Array.isArray(z.cities) && z.cities.some(c => (c || '').toLowerCase().includes('all other')))
        );
      }

      if (zone) {
        delivery_charges = zone.delivery_charge || 0;
        matchedZoneId = zone._id;
      }
    }

    // Fallback if delivery_zone_id explicitly matches an active zone
    if (delivery_charges === 0 && delivery_zone_id) {
      const explicitZone = await DeliveryZone.findById(delivery_zone_id);
      if (explicitZone && explicitZone.is_active) {
        delivery_charges = explicitZone.delivery_charge;
        matchedZoneId = explicitZone._id;
      }
    }

    const grand_total = subtotal + total_gst + delivery_charges;

    // Handle B2B Corporate Purchase Order (Net-30 / Proforma / Wire)
    const isPoMethod = ['po', 'po_invoice', 'invoice', 'net30', 'offline'].includes(String(payment_method).toLowerCase());
    if (isPoMethod) {
      const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        subtotal,
        total_gst,
        delivery_charges,
        grand_total,
        shipping_address,
        payment_method: 'po',
        payment_status: 'pending',
        stock_deducted: true,
        delivery_zone: matchedZoneId,
        order_status: 'placed'
      });

      // Decrement sale_stock atomically
      for (const it of items) {
        await Product.findByIdAndUpdate(it.product_id, {
          $inc: { sale_stock: -Number(it.quantity), stock_quantity: -Number(it.quantity) }
        });
      }

      // Record in Audit Log
      await PaymentAuditLog.create({
        order: order._id,
        user: req.user._id,
        event_type: 'order_initiated',
        amount: grand_total,
        gateway: 'po_invoice',
        status: 'pending',
        tampering_detected: false,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        metadata: { payment_method: 'po', items_count: orderItems.length }
      });

      return res.status(201).json({
        success: true,
        order,
        is_po: true,
        message: 'Official Corporate Purchase Order registered successfully! Proforma invoice generated.'
      });
    }

    // Otherwise initiate Razorpay Order for online payment
    let razorpay_order_id = '';
    try {
      if (razorpayInstance && razorpayInstance.orders) {
        const rzpOrder = await razorpayInstance.orders.create({
          amount: Math.round(grand_total * 100), // in paise
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        });
        razorpay_order_id = rzpOrder.id;
      }
    } catch (rzpErr) {
      console.error('[Razorpay Order Error]', rzpErr);
    }

    // In development/test mode or if gateway times out, provision secure placeholder
    if (!razorpay_order_id) {
      razorpay_order_id = `order_dev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      total_gst,
      delivery_charges,
      grand_total,
      shipping_address,
      payment_method: 'razorpay',
      payment_status: 'pending',
      stock_deducted: false,
      delivery_zone: matchedZoneId,
      razorpay_order_id,
      order_status: 'placed'
    });

    // Record in Audit Log
    await PaymentAuditLog.create({
      order: order._id,
      user: req.user._id,
      event_type: 'payment_initiated',
      amount: grand_total,
      gateway: 'razorpay',
      gateway_order_id: razorpay_order_id,
      status: 'pending',
      tampering_detected: false,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.status(201).json({
      success: true,
      order,
      razorpay_order_id,
      razorpay_key_id: process.env.RAZORPAY_KEY_ID,
      amount: grand_total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone company_name');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Ensure customer can only view own order, admin can view all
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin only
export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status, payment_status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.order_status = status;
    if (payment_status && payment_status !== 'all') query.payment_status = payment_status;

    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [
        { invoice_number: reg },
        { tracking_number: reg },
        { courier_name: reg },
        { 'shipping_address.company_name': reg },
        { 'shipping_address.contact_person': reg },
        { 'shipping_address.phone': reg },
        { 'shipping_address.city': reg }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone company_name')
        .populate('items.product', 'title brand model images sale_price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin only
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { order_status, payment_status, tracking_number, courier_name, admin_notes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const previousStatus = order.order_status;

    // Inventory Lifecycle & Financial Reconciliation:
    // Only restore sale_stock if stock was actually deducted previously (prevents phantom stock on unpaid orders)
    if (order_status && order_status !== previousStatus) {
      if (order_status === 'cancelled') {
        if (order.stock_deducted) {
          for (const item of order.items) {
            if (item.product && item.quantity > 0) {
              await Product.findByIdAndUpdate(item.product, {
                $inc: { sale_stock: Number(item.quantity), stock_quantity: Number(item.quantity) }
              });
            }
          }
          order.stock_deducted = false;
        }
      } else if (previousStatus === 'cancelled' && ['placed', 'processing', 'confirmed', 'shipped'].includes(order_status)) {
        // If un-cancelling, re-reserve stock only if not already deducted
        if (!order.stock_deducted) {
          for (const item of order.items) {
            if (item.product && item.quantity > 0) {
              await Product.findByIdAndUpdate(item.product, {
                $inc: { sale_stock: -Number(item.quantity), stock_quantity: -Number(item.quantity) }
              });
            }
          }
          order.stock_deducted = true;
        }
      }
      order.order_status = order_status;
    }

    if (payment_status && payment_status !== order.payment_status) {
      await PaymentAuditLog.create({
        order: order._id,
        user: req.user._id,
        event_type: payment_status === 'refunded' ? 'refund_marked' : 'status_changed',
        amount: order.grand_total,
        status: 'success',
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        metadata: {
          previous_payment_status: order.payment_status,
          new_payment_status: payment_status,
          updated_by: req.user.email
        }
      });
      order.payment_status = payment_status;
    }

    if (tracking_number !== undefined) order.tracking_number = tracking_number ? tracking_number.trim() : '';
    if (courier_name !== undefined) order.courier_name = courier_name ? courier_name.trim() : '';
    if (admin_notes !== undefined) order.admin_notes = admin_notes;

    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    next(error);
  }
};
