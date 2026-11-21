import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from '../models/Product.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();
dotenv.config({ path: '.env' });
dotenv.config({ path: 'server/.env' });

async function fixProductImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const products = await Product.find({});
    console.log(`Found ${products.length} products:`);

    for (const p of products) {
      console.log(`- [${p.category}] ${p.title} (${p.slug})`);
      console.log(`  Current image: ${p.images?.[0]?.url}`);

      let newImage = null;
      const titleLower = p.title.toLowerCase();

      if (titleLower.includes('p2419h') || titleLower.includes('monitor') || titleLower.includes('display')) {
        newImage = '/products/real-dell-display-transparent.png';
      } else if (titleLower.includes('3060') || titleLower.includes('gpu') || titleLower.includes('graphics')) {
        newImage = '/products/real-rtx-3060-gpu-transparent.png';
      } else if (titleLower.includes('thinkpad') || titleLower.includes('t490') || titleLower.includes('t14')) {
        newImage = '/products/real-thinkpad-t14-transparent.png';
      } else if (titleLower.includes('ram') || titleLower.includes('memory')) {
        newImage = '/products/real-enterprise-ram-transparent.png';
      } else if (titleLower.includes('optiplex') || titleLower.includes('desktop')) {
        newImage = '/products/real-optiplex-pc-transparent.png';
      } else if (titleLower.includes('elitebook')) {
        newImage = '/products/commercial-elite.png';
      }

      if (newImage && p.images?.[0]?.url !== newImage) {
        p.images = [{ url: newImage, public_id: `prod_${p.slug}` }];
        await p.save();
        console.log(`  -> Updated to: ${newImage}`);
      }
    }

    console.log('Product image normalization completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing product images:', err);
    process.exit(1);
  }
}

fixProductImages();
