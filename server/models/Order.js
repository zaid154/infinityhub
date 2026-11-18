import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  gst_rate: {
    type: Number,
    default: 18
  },
  gst_amount: {
    type: Number,
    default: 0
  },
  total: Number
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    total_gst: {
      type: Number,
      required: true,
      default: 0
    },
    delivery_charges: {
      type: Number,
      default: 0
    },
    grand_total: {
      type: Number,
      required: true,
      default: 0
    },
    shipping_address: {
      company_name: String,
      contact_person: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      gst_number: String
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpay_order_id: {
      type: String,
      default: ''
    },
    razorpay_payment_id: {
      type: String,
      default: ''
    },
    order_status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed'
    },
    invoice_number: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

// Auto-generate invoice number before save if not present
orderSchema.pre('save', async function (next) {
  if (!this.invoice_number) {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.invoice_number = `INV-${year}-${random}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
