import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: 'server/.env' });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  let customer = await User.findOne({ email: 'rohan.sharma@acmecorp.in' });
  if (!customer) {
    customer = await User.create({
      name: 'Rohan Sharma (Procurement Head)',
      email: 'rohan.sharma@acmecorp.in',
      password: 'Password@123456',
      role: 'customer',
      email_verified: true,
      phone: '+919876543210',
      company_name: 'Acme Technologies Ltd'
    });
    console.log('Customer created successfully:', customer.email);
  } else {
    customer.password = 'Password@123456';
    customer.email_verified = true;
    await customer.save();
    console.log('Customer account active & password set:', customer.email);
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
