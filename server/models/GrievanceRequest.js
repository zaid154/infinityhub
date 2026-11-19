import mongoose from 'mongoose';

const grievanceRequestSchema = new mongoose.Schema(
  {
    ticket_number: {
      type: String,
      required: true,
      unique: true
    },
    full_name: {
      type: String,
      required: true,
      trim: true
    },
    corporate_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    company_name: {
      type: String,
      default: '',
      trim: true
    },
    request_type: {
      type: String,
      enum: ['data_erasure', 'consent_withdrawal', 'hardware_dispute', 'sla_escalation', 'other'],
      default: 'data_erasure'
    },
    details: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['acknowledged', 'under_investigation', 'resolved', 'rejected'],
      default: 'acknowledged'
    },
    acknowledgement_sent_at: {
      type: Date,
      default: Date.now
    },
    resolution_deadline: {
      type: Date,
      required: true
    },
    resolved_at: {
      type: Date
    },
    resolution_notes: {
      type: String,
      default: ''
    },
    ip_address: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const GrievanceRequest = mongoose.model('GrievanceRequest', grievanceRequestSchema);
export default GrievanceRequest;
