import mongoose from 'mongoose';

const customerDemandSchema = new mongoose.Schema(
  {
    query_text: {
      type: String,
      required: true,
      trim: true
    },
    detected_brand: {
      type: String,
      trim: true,
      default: ''
    },
    detected_model: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: ['laptop', 'desktop', 'monitor', 'gpu', 'ram', 'cpu', 'other'],
      default: 'laptop'
    },
    source: {
      type: String,
      enum: ['ai_chat', 'catalog_search'],
      default: 'ai_chat'
    },
    intent: {
      type: String,
      enum: ['unstocked_request', 'rental_inquiry', 'buy_inquiry', 'pricing', 'general'],
      default: 'unstocked_request'
    },
    is_unstocked: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: Number,
      default: 1
    },
    last_queried_at: {
      type: Date,
      default: Date.now
    },
    sample_user_message: {
      type: String,
      default: ''
    },
    bot_reply_summary: {
      type: String,
      default: ''
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    user_name: {
      type: String,
      default: ''
    },
    user_company: {
      type: String,
      default: ''
    },
    user_phone: {
      type: String,
      default: ''
    },
    user_email: {
      type: String,
      default: ''
    },
    procurement_status: {
      type: String,
      enum: ['demand_logged', 'procurement_planned', 'stocked_listed', 'dismissed'],
      default: 'demand_logged'
    },
    admin_notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

customerDemandSchema.index({ detected_brand: 1, detected_model: 1 });
customerDemandSchema.index({ frequency: -1 });
customerDemandSchema.index({ last_queried_at: -1 });

const CustomerDemand = mongoose.model('CustomerDemand', customerDemandSchema);
export default CustomerDemand;
