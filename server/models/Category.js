import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    default_gst_rate: {
      type: Number,
      default: 18,
      enum: [0, 5, 12, 18, 28]
    },
    hsn_sac: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    icon: {
      type: String,
      default: 'laptop'
    },
    sort_order: {
      type: Number,
      default: 0
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
