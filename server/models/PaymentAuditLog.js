import mongoose from 'mongoose';

const paymentAuditLogSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      index: true
    },
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental',
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    event_type: {
      type: String,
      required: true,
      enum: [
        'order_initiated',
        'rental_initiated',
        'payment_initiated',
        'payment_verified',
        'payment_failed',
        'webhook_received',
        'webhook_processed',
        'status_changed',
        'refund_marked',
        'signature_mismatch',
        'order_id_substitution',
        'amount_tampering_detected',
        'unauthorized_access',
        'stock_adjusted'
      ]
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    gateway: {
      type: String,
      enum: ['razorpay', 'po_invoice', 'offline', 'internal'],
      default: 'razorpay'
    },
    gateway_order_id: {
      type: String,
      default: ''
    },
    gateway_payment_id: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending', 'flagged'],
      default: 'success'
    },
    tampering_detected: {
      type: Boolean,
      default: false,
      index: true
    },
    ip_address: {
      type: String,
      default: ''
    },
    user_agent: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

const PaymentAuditLog = mongoose.model('PaymentAuditLog', paymentAuditLogSchema);
export default PaymentAuditLog;
