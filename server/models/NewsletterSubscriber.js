import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    consent_given: {
      type: Boolean,
      required: true,
      validate: {
        validator: (v) => v === true,
        message: 'Explicit consent is mandatory under Section 6 of DPDP Act 2023.'
      }
    },
    consent_timestamp: {
      type: Date,
      default: Date.now
    },
    consent_ip: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
export default NewsletterSubscriber;
