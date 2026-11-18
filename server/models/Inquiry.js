import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    contact_person: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    inquiry_type: {
      type: String,
      enum: ['bulk_purchase', 'rental', 'components', 'amc', 'buyback', 'other'],
      default: 'bulk_purchase'
    },
    product_ref: {
      type: String,
      default: ''
    },
    quantity: {
      type: String,
      default: '5 - 10 Units'
    },
    city: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'converted', 'closed'],
      default: 'new'
    },
    admin_notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
