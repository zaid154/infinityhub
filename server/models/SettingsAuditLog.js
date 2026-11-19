import mongoose from 'mongoose';

const settingsAuditLogSchema = new mongoose.Schema(
  {
    modified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    user_email: {
      type: String,
      default: ''
    },
    previous_values: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    updated_values: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    version_number: {
      type: Number,
      required: true
    },
    ip_address: {
      type: String,
      default: ''
    },
    user_agent: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const SettingsAuditLog = mongoose.model('SettingsAuditLog', settingsAuditLogSchema);
export default SettingsAuditLog;
