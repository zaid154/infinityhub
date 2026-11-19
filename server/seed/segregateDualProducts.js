import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from '../models/Product.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config({ path: 'server/.env' });

async function segregateProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for clean catalog segregation...');

    const dualProducts = await Product.find({ available_for: 'both' });
    console.log(`Found ${dualProducts.length} dual-availability products to segregate.`);

    for (const p of dualProducts) {
      // 1. Convert current record into a pure DIRECT PURCHASE product
      const origTitle = p.title;
      const rentalRate = p.rental_price_monthly;
      const rentalStock = p.rental_stock || 5;

      p.available_for = 'sale';
      p.rental_price_monthly = 0;
      p.rental_stock = 0;
      p.stock_quantity = p.sale_stock || p.stock_quantity || 10;
      await p.save();
      console.log(`  ✓ Converted to Direct Purchase: ${origTitle} (Sale Stock: ${p.sale_stock}, ₹${p.sale_price})`);

      // 2. Check if a dedicated Rental Fleet twin already exists
      const rentalSlug = `${p.slug}-rental-fleet`;
      let rentalTwin = await Product.findOne({ slug: rentalSlug });

      if (!rentalTwin) {
        rentalTwin = new Product({
          title: `${origTitle.replace('Workstation Graphics Card', 'GPU').replace('Executive Series', 'Executive')} Corporate Rental Fleet`,
          slug: rentalSlug,
          description: p.description,
          brand: p.brand,
          model: p.model,
          category: p.category,
          condition: 'grade_a_plus',
          available_for: 'rent',
          sale_price: 0,
          rental_price_monthly: rentalRate || 1450,
          sale_stock: 0,
          rental_stock: rentalStock,
          stock_quantity: rentalStock,
          images: p.images,
          specs: p.specs,
          gst_rate: p.gst_rate || 18,
          is_featured: p.is_featured,
          is_hot_deal: false,
          is_active: true
        });
        await rentalTwin.save();
        console.log(`  ✓ Created Corporate Rental Fleet Twin: ${rentalTwin.title} (Fleet: ${rentalStock}, ₹${rentalRate}/mo)`);
      } else {
        rentalTwin.rental_price_monthly = rentalRate || 1450;
        rentalTwin.rental_stock = rentalStock;
        rentalTwin.stock_quantity = rentalStock;
        rentalTwin.available_for = 'rent';
        rentalTwin.sale_price = 0;
        rentalTwin.sale_stock = 0;
        await rentalTwin.save();
        console.log(`  ✓ Updated existing Rental Twin: ${rentalTwin.title}`);
      }
    }

    console.log('\nAll products successfully segregated into dedicated Buy vs Lease archetypes!');
    process.exit(0);
  } catch (err) {
    console.error('Error segregating products:', err);
    process.exit(1);
  }
}

segregateProducts();
