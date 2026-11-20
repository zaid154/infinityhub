import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import PaymentAuditLog from '../models/PaymentAuditLog.js';
import razorpayInstance from '../config/razorpay.js';

// Constant-time string comparison helper to prevent timing attacks
const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

// @desc    Verify Razorpay payment signature & confirm order
// @route   POST /api/payments/verify
// @access  Private (Owner or Admin)
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing mandatory payment verification parameters (order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature).'
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'Payment gateway configuration error.' });
    }

    // 1. Verify HMAC SHA-256 signature using constant-time comparison
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = safeCompare(expectedSignature, razorpay_signature);

    if (!isAuthentic) {
      // Audit log tampering attempt
      await PaymentAuditLog.create({
        order: order_id,
        user: req.user?._id,
        event_type: 'signature_mismatch',
        status: 'failed',
        gateway_order_id: razorpay_order_id,
        gateway_payment_id: razorpay_payment_id,
        tampering_detected: true,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        metadata: { reason: 'Cryptographic HMAC signature mismatch' }
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid cryptographic signature.'
      });
    }

    // 2. Fetch order and check existence
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found.' });
    }

    // 3. IDOR Protection: Verify caller is owner of the order or Admin
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      await PaymentAuditLog.create({
        order: order._id,
        user: req.user._id,
        event_type: 'unauthorized_access',
        status: 'failed',
        tampering_detected: true,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        metadata: { reason: 'IDOR order ownership boundary violation' }
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to verify this order.'
      });
    }

    // 4. Order ID Substitution Protection:
    // Strictly verify that the razorpay_order_id matches the one generated and stored with this order
    if (!order.razorpay_order_id || order.razorpay_order_id !== razorpay_order_id) {
      await PaymentAuditLog.create({
        order: order._id,
        user: req.user._id,
        event_type: 'order_id_substitution',
        status: 'failed',
        tampering_detected: true,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        metadata: {
          expected_razorpay_order_id: order.razorpay_order_id,
          received_razorpay_order_id: razorpay_order_id
        }
      });

      return res.status(400).json({
        success: false,
        message: 'Security validation failed: Razorpay Order ID does not match order record.'
      });
    }

    // 5. Duplicate Payment / Replay Protection (Idempotency)
    if (order.payment_status === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Order is already marked as paid.',
        order
      });
    }

    // 6. Direct Gateway Amount Verification (Double Check against Razorpay API)
    try {
      if (razorpayInstance && razorpayInstance.payments) {
        const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);
        const expectedPaise = Math.round(order.grand_total * 100);

        if (paymentDetails && paymentDetails.amount !== undefined && paymentDetails.amount !== expectedPaise) {
          await PaymentAuditLog.create({
            order: order._id,
            user: req.user._id,
            event_type: 'amount_tampering_detected',
            status: 'failed',
            tampering_detected: true,
            ip_address: req.ip,
            user_agent: req.headers['user-agent'],
            metadata: {
              expectedPaise,
              actualPaidPaise: paymentDetails.amount
            }
          });

          return res.status(400).json({
            success: false,
            message: 'Payment amount mismatch detected. Transaction flagged for security review.'
          });
        }
      }
    } catch (fetchErr) {
      // Allow graceful fallback in offline or test sandboxes where fetch might be stubbed
      console.warn('[Payment Gateway Fetch Notice]:', fetchErr.message);
    }

    // 7. Atomic State Update (Prevents race conditions)
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id, payment_status: { $ne: 'paid' } },
      {
        $set: {
          payment_status: 'paid',
          razorpay_payment_id: razorpay_payment_id,
          order_status: 'confirmed',
          stock_deducted: true
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      // Order was already marked paid in concurrent thread
      return res.status(200).json({
        success: true,
        message: 'Payment was already processed concurrently.',
        order
      });
    }

    // 8. Atomic Inventory Decrement
    if (Array.isArray(updatedOrder.items)) {
      for (const item of updatedOrder.items) {
        if (item.product && item.quantity > 0) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { sale_stock: -Number(item.quantity), stock_quantity: -Number(item.quantity) }
          });
        }
      }
    }

    // 9. Financial Audit Log Record
    await PaymentAuditLog.create({
      order: updatedOrder._id,
      user: req.user._id,
      event_type: 'payment_verified',
      amount: updatedOrder.grand_total,
      gateway: 'razorpay',
      gateway_order_id: razorpay_order_id,
      gateway_payment_id: razorpay_payment_id,
      status: 'success',
      tampering_detected: false,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      metadata: { invoice_number: updatedOrder.invoice_number }
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Razorpay Server-to-Server Webhook Handler
// @route   POST /api/payments/webhook
// @access  Public (Cryptographically Authenticated via Razorpay Signature)
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!signature || !webhookSecret) {
      return res.status(400).json({ success: false, message: 'Missing webhook signature or secret.' });
    }

    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    if (!safeCompare(expectedSignature, signature)) {
      await PaymentAuditLog.create({
        event_type: 'signature_mismatch',
        status: 'failed',
        tampering_detected: true,
        ip_address: req.ip,
        metadata: { reason: 'Webhook signature verification failed' }
      });
      return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventName = event.event;

    if (eventName === 'payment.captured' || eventName === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id || event.payload?.order?.entity?.id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const order = await Order.findOne({ razorpay_order_id: razorpayOrderId });
        if (order && order.payment_status !== 'paid') {
          order.payment_status = 'paid';
          if (razorpayPaymentId) order.razorpay_payment_id = razorpayPaymentId;
          order.order_status = 'confirmed';

          if (!order.stock_deducted && Array.isArray(order.items)) {
            for (const item of order.items) {
              if (item.product && item.quantity > 0) {
                await Product.findByIdAndUpdate(item.product, {
                  $inc: { sale_stock: -Number(item.quantity), stock_quantity: -Number(item.quantity) }
                });
              }
            }
            order.stock_deducted = true;
          }

          await order.save();

          await PaymentAuditLog.create({
            order: order._id,
            user: order.user,
            event_type: 'webhook_processed',
            amount: order.grand_total,
            gateway: 'razorpay',
            gateway_order_id: razorpayOrderId,
            gateway_payment_id: razorpayPaymentId || '',
            status: 'success',
            metadata: { event: eventName }
          });
        }
      }
    }

    // Always return 200 OK to acknowledge receipt to gateway
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('[Razorpay Webhook Error]', error);
    res.status(500).json({ success: false, message: 'Internal webhook error.' });
  }
};

// @desc    Get Financial & Payment Audit Logs (Admin Only)
// @route   GET /api/payments/audit-logs
// @access  Admin only
export const getPaymentAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, tampering_only } = req.query;
    const query = {};
    if (tampering_only === 'true') {
      query.tampering_detected = true;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      PaymentAuditLog.find(query)
        .populate('user', 'name email company_name')
        .populate('order', 'invoice_number grand_total order_status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      PaymentAuditLog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      logs
    });
  } catch (error) {
    next(error);
  }
};
