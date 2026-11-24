import mongoose from 'mongoose';

const OtpTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otpHash: {
    type: String,
    required: true
  },
  magicTokenHash: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['register', 'reset'],
    required: true
  },
  tempData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastSentAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Automatically pruned by MongoDB TTL index after 10 minutes (600s)
  }
});

const OtpToken = mongoose.model('OtpToken', OtpTokenSchema);
export default OtpToken;
