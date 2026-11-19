import Order from '../models/Order.js';
import Product from '../models/Product.js';
import DeliveryZone from '../models/DeliveryZone.js';
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

    // Calculate delivery charge from zone
    let delivery_charges = 0;
    if (delivery_zone_id) {
      const zone = await DeliveryZone.findById(delivery_zone_id);
      if (zone) delivery_charges = zone.delivery_charge;
    }

    const grand_total = subtotal + total_gst + delivery_charges;

    // Handle B2B Corporate Purchase Order (Net-30 / Proforma / Wire)
    if (payment_method === 'po') {
      const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        subtotal,
        total_gst,
        delivery_charges,
        grand_total,
        shipping_address,
        payment_status: 'pending',
        order_status: 'placed'
      });

      // Decrement sale_stock
      for (const it of items) {
        await Product.findByIdAndUpdate(it.product_id, {
          $inc: { sale_stock: -Number(it.quantity), stock_quantity: -Number(it.quantity) }
        });
      }

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
      const rzpOrder = await razorpayInstance.orders.create({
        amount: Math.round(grand_total * 100), // in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      });
      razorpay_order_id = rzpOrder.id;
    } catch (rzpErr) {
      console.error('[Razorpay Order Error]', rzpErr);
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      total_gst,
      delivery_charges,
      grand_total,
      shipping_address,
      payment_status: 'pending',
      razorpay_order_id,
      order_status: 'placed'
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

    if (order_status) order.order_status = order_status;
    if (payment_status) order.payment_status = payment_status;
    if (tracking_number !== undefined) order.tracking_number = tracking_number;
    if (courier_name !== undefined) order.courier_name = courier_name;
    if (admin_notes !== undefined) order.admin_notes = admin_notes;

    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    next(error);
  }
};
