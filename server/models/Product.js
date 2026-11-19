import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    model: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['laptop', 'desktop', 'monitor', 'ram', 'gpu', 'cpu', 'other'],
      default: 'laptop'
    },
    condition: {
      type: String,
      enum: ['brand_new', 'open_box', 'grade_a_plus', 'grade_a', 'grade_b', 'for_parts'],
      default: 'grade_a_plus'
    },
    available_for: {
      type: String,
      enum: ['sale', 'rent', 'both'],
      default: 'both'
    },
    sale_price: {
      type: Number,
      default: 0
    },
    rental_price_monthly: {
      type: Number,
      default: 0
    },
    stock_quantity: {
      type: Number,
      default: 1
    },
    sale_stock: {
      type: Number,
      default: 1
    },
    rental_stock: {
      type: Number,
      default: 0
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: '' },
        resource_type: { type: String, default: 'image' }
      }
    ],
    media_layout: {
      type: String,
      default: 'standard'
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    gst_rate: {
      type: Number,
      default: 18,
      enum: [0, 5, 12, 18, 28]
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    is_hot_deal: {
      type: Boolean,
      default: false
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ title: 'text', brand: 'text', model: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
