import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from '../models/Product.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config({ path: 'server/.env' });

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Update all products
  const products = await Product.find();
  for (const p of products) {
    if (p.rental_price_monthly > 0 && p.sale_price > 0) {
      p.available_for = 'both';
    } else if (p.rental_price_monthly > 0 && (!p.sale_price || p.sale_price === 0)) {
      p.available_for = 'rent';
    } else {
      p.available_for = 'sale';
    }
    await p.save();
    console.log(`${p.title} -> available_for: ${p.available_for}`);
  }

  console.log('Successfully updated product availability flags.');
  process.exit(0);
}

fix();
