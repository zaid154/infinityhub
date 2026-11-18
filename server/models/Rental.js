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

const Rental = mongoose.model('Rental', rentalSchema);
export default Rental;
