import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from '../models/Product.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config({ path: 'server/.env' });

async function syncStock() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for stock segregation sync...');

    const products = await Product.find();
    for (const p of products) {
      if (p.title.includes('RTX 3060')) {
        p.sale_stock = 10;
        p.rental_stock = 3;
        p.stock_quantity = 13;
        p.available_for = 'both';
      } else if (p.title.includes('ThinkPad')) {
        p.sale_stock = 15;
        p.rental_stock = 10;
        p.stock_quantity = 25;
        p.available_for = 'both';
      } else if (p.title.includes('Latitude')) {
        p.sale_stock = 12;
        p.rental_stock = 8;
        p.stock_quantity = 20;
        p.available_for = 'both';
      } else if (p.title.includes('EliteBook')) {
        p.sale_stock = 14;
        p.rental_stock = 6;
        p.stock_quantity = 20;
        p.available_for = 'both';
      } else if (p.title.includes('P2419H') || p.title.includes('Display')) {
        p.sale_stock = 50;
        p.rental_stock = 30;
        p.stock_quantity = 80;
        p.available_for = 'both';
      } else if (p.title.includes('Memory') || p.title.includes('RAM') || p.category === 'ram') {
        p.sale_stock = 250;
        p.rental_stock = 0;
        p.stock_quantity = 250;
        p.available_for = 'sale';
      } else {
        p.sale_stock = p.stock_quantity || 10;
        p.rental_stock = p.rental_price_monthly > 0 ? 5 : 0;
      }
      await p.save();
      console.log(`Synced: ${p.title} -> sale_stock: ${p.sale_stock}, rental_stock: ${p.rental_stock}`);
    }

    console.log('Stock segregation sync completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing stock:', err);
    process.exit(1);
  }
}

syncStock();
