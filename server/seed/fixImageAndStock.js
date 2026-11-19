import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from '../models/Product.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config({ path: 'server/.env' });

async function fixData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // 1. Fix HP EliteBook: Replace lady photo with actual hardware photo
    const elite = await Product.findOne({ title: /EliteBook/i });
    if (elite) {
      elite.images = [
        {
          url: '/products/commercial-elite.png',
          public_id: 'sample_elite840_hardware'
        }
      ];
      await elite.save();
      console.log('Fixed HP EliteBook image: set to /products/commercial-elite.png');
    }

    // 2. Fix RTX 3060: Restore rental stock so it can be rented
    const rtx = await Product.findOne({ title: /RTX 3060/i });
    if (rtx) {
      rtx.rental_stock = 5;
      rtx.sale_stock = 10;
      rtx.stock_quantity = 15;
      rtx.available_for = 'both';
      await rtx.save();
      console.log('Fixed RTX 3060 stock: rental_stock = 5, sale_stock = 10');
    }

    console.log('Database updates completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing data:', err);
    process.exit(1);
  }
}

fixData();
