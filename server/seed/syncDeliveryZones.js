import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e){}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DeliveryZone from '../models/DeliveryZone.js';

dotenv.config({ path: 'server/.env' });

async function sync() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[Sync Delivery Zones] Connected to MongoDB.');

  const defaultZones = [
    {
      zone_name: 'Delhi NCR (Local Hub)',
      cities: ['Delhi', 'New Delhi', 'Noida', 'Greater Noida', 'Gurgaon', 'Gurugram', 'Faridabad', 'Ghaziabad'],
      states: ['Delhi', 'NCR', 'National Capital Region'],
      pincode_prefixes: ['110', '11', '201', '121', '122'],
      delivery_charge: 0,
      estimated_days: 'Same-Day / 24 Hours',
      is_active: true
    },
    {
      zone_name: 'Tier-1 Metro Cities',
      cities: ['Mumbai', 'Navi Mumbai', 'Thane', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Secunderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'],
      states: ['Maharashtra', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat'],
      pincode_prefixes: ['400', '401', '560', '500', '411', '600', '700', '380'],
      delivery_charge: 450,
      estimated_days: '2–3 Business Days',
      is_active: true
    },
    {
      zone_name: 'Rest of India',
      cities: ['All other cities and towns'],
      states: ['All other states'],
      pincode_prefixes: [],
      delivery_charge: 750,
      estimated_days: '3–5 Business Days',
      is_active: true
    }
  ];

  for (const item of defaultZones) {
    const existing = await DeliveryZone.findOne({ zone_name: item.zone_name });
    if (existing) {
      existing.cities = item.cities;
      existing.states = item.states;
      existing.pincode_prefixes = item.pincode_prefixes;
      existing.delivery_charge = item.delivery_charge;
      existing.estimated_days = item.estimated_days;
      existing.is_active = true;
      await existing.save();
      console.log(`[Sync Delivery Zones] Updated zone: ${item.zone_name}`);
    } else {
      await DeliveryZone.create(item);
      console.log(`[Sync Delivery Zones] Created zone: ${item.zone_name}`);
    }
  }

  console.log('[Sync Delivery Zones] Complete.');
  process.exit(0);
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
