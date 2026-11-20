import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Product Cleanup] Connected to MongoDB.');

    const Product = (await import('../models/Product.js')).default;
    const products = await Product.find();

    console.log(`Found ${products.length} products to audit and sanitize.`);

    for (const p of products) {
      let changed = false;

      // 1. Remove redundant 'Corporate Rental Fleet' suffix from titles
      if (p.title && p.title.includes(' Corporate Rental Fleet')) {
        p.title = p.title.replace(' Corporate Rental Fleet', '').trim();
        changed = true;
      }

      // 2. Sanitize Monitor specs (no OS or laptop specs on a monitor!)
      if (p.category === 'monitor') {
        const cleanSpecs = {
          screen_size: p.specs?.screen_size || '23.8" Full HD (1920x1080) IPS',
          resolution: '1920 x 1080 @ 60Hz Full HD',
          panel_type: 'IPS Anti-Glare 3-Sided Borderless',
          ports: p.specs?.ports || 'DisplayPort 1.2, HDMI 1.4, VGA, 4x USB 3.0',
          ergonomics: p.specs?.ergonomics || 'Height Adjustable, Tilt, Swivel, Pivot 90°'
        };
        p.specs = cleanSpecs;
        changed = true;
      }

      // 3. Sanitize GPU specs (no OS or laptop specs on a GPU!)
      if (p.category === 'gpu') {
        const cleanSpecs = {
          vram: p.specs?.vram || '12GB GDDR6 (192-bit)',
          cuda_cores: p.specs?.cuda_cores || '3584 CUDA Cores',
          outputs: p.specs?.outputs || '3x DisplayPort 1.4a, 1x HDMI 2.1',
          architecture: 'NVIDIA Ampere Architecture',
          form_factor: 'Dual-Slot PCIe 4.0 x16',
          power_requirement: '550W PSU (1x 8-pin connector)'
        };
        p.specs = cleanSpecs;
        changed = true;
      }

      // 4. Sanitize RAM specs
      if (p.category === 'ram') {
        const cleanSpecs = {
          capacity: p.specs?.ram || '16GB DDR4 Single Stick',
          speed: '3200MHz (PC4-25600)',
          form_factor: 'SODIMM (Laptop) / UDIMM (Desktop)',
          voltage: '1.2V Low Voltage Standard'
        };
        p.specs = cleanSpecs;
        changed = true;
      }

      // 5. Clean up laptop specs
      if (p.category === 'laptop') {
        if (!p.specs?.processor) {
          if (p.title.includes('T490')) p.specs.processor = 'Intel Core i5-8365U vPro (Quad-Core up to 4.1GHz)';
          else if (p.title.includes('7490')) p.specs.processor = 'Intel Core i7-8650U vPro (Quad-Core up to 4.2GHz)';
          else if (p.title.includes('840')) p.specs.processor = 'Intel Core i5-8265U (Quad-Core up to 3.9GHz)';
          else if (p.title.includes('M1')) p.specs.processor = 'Apple M1 8-Core CPU';
          changed = true;
        }
        if (!p.specs?.ram) {
          p.specs.ram = p.title.includes('M1') ? '8GB Unified Memory' : '16GB DDR4 High-Speed RAM';
          changed = true;
        }
        if (!p.specs?.storage) {
          p.specs.storage = p.title.includes('M1') ? '256GB NVMe SSD' : '512GB PCIe NVMe SSD';
          changed = true;
        }
        if (p.specs && p.specs.operating_system) {
          // If Windows 11 Pro is on Apple M1, fix to macOS
          if (p.title.includes('MacBook') || p.title.includes('Apple')) {
            p.specs.operating_system = 'macOS Sonoma Enterprise MDM Ready';
            changed = true;
          }
        }
      }

      if (changed) {
        p.markModified('specs');
        await p.save();
        console.log(`[Sanitized Product]: ${p.title} (${p.category})`);
      }
    }

    console.log('[Product Cleanup] Complete!');
    process.exit(0);
  } catch (err) {
    console.error('[Product Cleanup Error]', err);
    process.exit(1);
  }
};

cleanup();
