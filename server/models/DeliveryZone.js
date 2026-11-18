import mongoose from 'mongoose';

const deliveryZoneSchema = new mongoose.Schema(
  {
    zone_name: {
      type: String,
      required: true,
      trim: true
    },
    cities: [
      {
        type: String,
        trim: true
      }
    ],
    delivery_charge: {
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

const DeliveryZone = mongoose.model('DeliveryZone', deliveryZoneSchema);
export default DeliveryZone;
