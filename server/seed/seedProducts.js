import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    title: 'Lenovo ThinkPad T490 Enterprise Business Laptop',
    slug: 'lenovo-thinkpad-t490-enterprise-laptop',
    description: 'Corporate powerhouse built for heavy day-to-day business operations, coding, and multitasking. Features military-grade durability, spill-resistant backlit keyboard, and legendary ThinkPad reliability.',
    brand: 'Lenovo',
    model: 'ThinkPad T490',
    category: 'laptop',
    condition: 'grade_a_plus',
    available_for: 'both',
    sale_price: 21500,
    rental_price_monthly: 1450,
    stock_quantity: 45,
    images: [
      { url: '/products/real-thinkpad-t14-transparent.png', public_id: 'sample_t490_1' }
    ],
    specs: {
      processor: 'Intel Core i5-8365U Quad-Core (Up to 4.1GHz)',
      ram: '16GB DDR4 High-Speed RAM',
      storage: '512GB M.2 NVMe PCIe SSD',
      screen_size: '14" Full HD (1920x1080) IPS Anti-Glare',
      operating_system: 'Windows 11 Pro 64-bit Genuine'
    },
    gst_rate: 18,
    is_featured: true,
    is_hot_deal: true
  },
  {
    title: 'Dell Latitude 7490 Ultrabook Corporate Edition',
    slug: 'dell-latitude-7490-ultrabook-corporate',
    description: 'Ultra-durable carbon-fiber chassis business ultrabook. Lightweight at 1.4kg with exceptional battery longevity. Tested for 24/7 corporate workloads and developer workflows.',
    brand: 'Dell',
    model: 'Latitude 7490',
    category: 'laptop',
    condition: 'grade_a_plus',
    available_for: 'both',
    sale_price: 24900,
    rental_price_monthly: 1650,
    stock_quantity: 35,
    images: [
      { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80', public_id: 'sample_lat7490_1' }
    ],
    specs: {
      processor: 'Intel Core i7-8650U Quad-Core vPro (Up to 4.2GHz)',
      ram: '16GB DDR4 Dual-Channel',
      storage: '512GB High-Speed NVMe SSD',
      screen_size: '14.0" FHD WVA Anti-Glare Display',
      operating_system: 'Windows 11 Pro 64-bit Genuine'
    },
    gst_rate: 18,
    is_featured: true,
    is_hot_deal: false
  },
  {
    title: 'HP EliteBook 840 G6 Aluminum Executive Series',
    slug: 'hp-elitebook-840-g6-aluminum-executive',
    description: 'Precision-crafted all-metal aluminum chassis laptop designed for modern executives. Features crystal-clear Bang & Olufsen tuned audio and world-class enterprise security.',
    brand: 'HP',
    model: 'EliteBook 840 G6',
    category: 'laptop',
    condition: 'grade_a_plus',
    available_for: 'both',
    sale_price: 22800,
    rental_price_monthly: 1500,
    stock_quantity: 28,
    images: [
      { url: '/products/commercial-elite.png', public_id: 'sample_elite840_1' }
    ],
    specs: {
      processor: 'Intel Core i5-8265U Quad-Core Processor',
      ram: '16GB DDR4 2400MHz',
      storage: '256GB / 512GB PCIe NVMe SSD',
      screen_size: '14" Diagonal FHD IPS Anti-Glare',
      operating_system: 'Windows 11 Pro'
    },
    gst_rate: 18,
    is_featured: true,
    is_hot_deal: false
  },
  {
    title: 'Dell Professional P2419H 24-Inch IPS Frameless Display',
    slug: 'dell-professional-p2419h-24-inch-ips-display',
    description: 'Essential corporate monitor with 3-sided ultrathin bezel design. Fully ergonomic stand allows 90-degree pivot rotation (portrait mode for software developers and finance analysts).',
    brand: 'Dell',
    model: 'P2419H / P2422H',
    category: 'monitor',
    condition: 'grade_a_plus',
    available_for: 'both',
    sale_price: 5499,
    rental_price_monthly: 450,
    stock_quantity: 80,
    images: [
      { url: '/products/real-dell-display-transparent.png', public_id: 'sample_p2419h_1' }
    ],
    specs: {
      screen_size: '23.8" Full HD (1920 x 1080 at 60Hz) IPS',
      ports: 'DisplayPort 1.2, HDMI 1.4, VGA, 4x USB 3.0 Hub',
      ergonomics: 'Height Adjustable, Tilt, Swivel, Pivot (90° Portrait)'
    },
    gst_rate: 18,
    is_featured: true,
    is_hot_deal: true
  },
  {
    title: 'Samsung / Micron 16GB DDR4 3200MHz OEM Memory Stick',
    slug: 'samsung-micron-16gb-ddr4-3200mhz-memory-stick',
    description: 'Tier-1 OEM certified RAM module pulled from corporate desktop/laptop upgrades. Thoroughly MemTest86 stress-tested for 0% bit-errors. 6-Month instant replacement guarantee.',
    brand: 'Samsung',
    model: 'DDR4-3200 SODIMM/UDIMM',
    category: 'ram',
    condition: 'grade_a_plus',
    available_for: 'sale',
    sale_price: 1650,
    rental_price_monthly: 0,
    stock_quantity: 250,
    images: [
      { url: '/products/real-enterprise-ram-transparent.png', public_id: 'sample_ram_1' }
    ],
    specs: {
      ram: '16GB DDR4 Single Stick',
      speed: '3200MHz (PC4-25600)',
      form_factor: 'Available in Laptop (SODIMM) and Desktop (DIMM)',
      voltage: '1.2V Low Power Standard'
    },
    gst_rate: 18,
    is_featured: false,
    is_hot_deal: true
  },
  {
    title: 'NVIDIA GeForce RTX 3060 12GB GDDR6 Workstation Graphics Card',
    slug: 'nvidia-geforce-rtx-3060-12gb-gddr6-workstation-gpu',
    description: 'High 12GB VRAM graphics card optimal for Deep Learning AI model training, 3D rendering (Blender/Maya), Premiere Pro video editing, and CAD workstations. Cleaned and freshly repasted with Arctic MX-4.',
    brand: 'NVIDIA',
    model: 'RTX 3060 12GB GDDR6',
    category: 'gpu',
    condition: 'grade_a_plus',
    available_for: 'sale',
    sale_price: 17800,
    rental_price_monthly: 1200,
    stock_quantity: 18,
    images: [
      { url: '/products/real-rtx-3060-gpu-transparent.png', public_id: 'sample_gpu_1' }
    ],
    specs: {
      vram: '12GB GDDR6 (192-bit)',
      cuda_cores: '3584 CUDA Cores',
      outputs: '3x DisplayPort 1.4a, 1x HDMI 2.1',
      power_requirement: '550W PSU with 1x 8-pin connector'
    },
    gst_rate: 18,
    is_featured: true,
    is_hot_deal: true
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed Products] Connected to DB.');

    for (const p of sampleProducts) {
      const exists = await Product.findOne({ slug: p.slug });
      if (!exists) {
        await Product.create(p);
        console.log(`[Seed Products] Added: ${p.title}`);
      } else {
        console.log(`[Seed Products] Exists: ${p.title}`);
      }
    }

    console.log('[Seed Products] ✅ Initial products seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Products Error]', err);
    process.exit(1);
  }
};

seedProducts();
