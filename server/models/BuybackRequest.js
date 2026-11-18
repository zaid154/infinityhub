import mongoose from 'mongoose';

const buybackRequestSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
      trim: true
    },
    contact_person: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    asset_type: {
      type: String,
      default: 'Laptops (i3/i5/i7 Mix)'
    },
    approx_quantity: {
      type: Number,
      default: 10
    },
    city: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'inspected', 'quoted', 'accepted', 'picked_up', 'closed'],
      default: 'new'
    },
    offered_price: {
      type: Number,
      default: 0
    },
    admin_notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const BuybackRequest = mongoose.model('BuybackRequest', buybackRequestSchema);
export default BuybackRequest;
