import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    tenure: {
      type: String,
      enum: ['1_month', '3_months', '6_months', '12_months'],
      default: '6_months'
    },
    monthly_rate: {
      type: Number,
      required: true
    },
    monthly_subtotal: {
      type: Number,
      default: 0
    },
    monthly_gst: {
      type: Number,
      default: 0
    },
    total_monthly_recurring: {
      type: Number,
      default: 0
    },
    security_deposit: {
      type: Number,
      default: 0
    },
    agreement_number: {
      type: String,
      unique: true,
      sparse: true
    },
    company_name: {
      type: String,
      default: ''
    },
    gstin: {
      type: String,
      default: ''
    },
    deployment_address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    start_date: {
      type: Date,
      default: Date.now
    },
    end_date: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue', 'cancelled'],
      default: 'active'
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    admin_notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Auto-generate formal rental agreement number before save
rentalSchema.pre('save', async function (next) {
  if (!this.agreement_number) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.agreement_number = `RNT-${year}-${random}`;
  }
  next();
});

const Rental = mongoose.model('Rental', rentalSchema);
export default Rental;
