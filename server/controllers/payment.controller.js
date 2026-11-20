import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previouslyPaid = order.payment_status === 'paid';
    order.payment_status = 'paid';
    order.razorpay_payment_id = razorpay_payment_id;
    order.order_status = 'confirmed';
    await order.save();

    // Inventory Lifecycle Reconciliation:
    // Decrement sale_stock atomically upon verified payment if not already processed
    if (!previouslyPaid && Array.isArray(order.items)) {
      for (const item of order.items) {
        if (item.product && item.quantity > 0) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { sale_stock: -Number(item.quantity), stock_quantity: -Number(item.quantity) }
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
      order
    });
  } catch (error) {
    next(error);
  }
};
