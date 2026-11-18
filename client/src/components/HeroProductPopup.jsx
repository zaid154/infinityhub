import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const SHOWCASE_PRODUCTS = [
  {
    id: 1,
    name: 'ThinkPad T14 Enterprise',
    spec: 'Core i7 • 32GB RAM • 512GB NVMe',
    price: 'Rent ₹1,450/mo',
    badge: 'GRADE A+ CERTIFIED',
    image: '/products/thinkpad-t14.png',
    slug: 'lenovo-thinkpad-t490-enterprise-laptop'
  },
  {
    id: 2,
    name: 'Dell UltraSharp 27" 4K',
    spec: 'Frameless IPS • Height Pivot Stand',
    price: 'Wholesale ₹5,499',
    badge: 'ZERO DEAD-PIXEL',
    image: '/products/dell-ultrasharp-display.png',
    slug: 'dell-professional-p2419h-24-inch-ips-display'
  },
  {
    id: 3,
    name: 'HP EliteBook 840 Executive',
    spec: 'Magnesium Roll-Cage • SureView',
    price: 'Rent ₹1,650/mo',
    badge: 'MIL-SPEC TESTED',
    image: '/products/workstation-laptop.png',
    slug: 'hp-elitebook-840-g6-aluminum-executive'
  },
  {
    id: 4,
    name: 'Precision Workstation Fleet',
    spec: '64GB ECC • Workstation GPU',
    price: 'Rent ₹3,200/mo',
    badge: 'ISV CERTIFIED',
    image: '/products/commercial-elite.png',
    slug: 'nvidia-geforce-rtx-3060-12gb-gddr6-workstation-gpu'
  }
];

export default function HeroProductPopup({ onOpenRFQ }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  // Auto-cycle products every 2.8 seconds - Exactly like Al-Tooba
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
        setAnimating(false);
      }, 250);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const current = SHOWCASE_PRODUCTS[currentIndex];

  const handleClick = () => {
    navigate('/products');
  };

  return (
    <div className="relative w-full max-w-[480px] lg:max-w-[540px] flex flex-col items-center justify-end select-none pt-2">
      {/* Sleek Integrated Product Showroom Tag (Sitting right above the laptop) */}
      <div
        onClick={handleClick}
        className="mb-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#072117]/90 backdrop-blur-xl border border-[#D4A24C]/60 text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer hover:border-[#D4A24C] hover:scale-105 active:scale-95 transition-all group"
      >
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
        <span className="text-[10px] font-mono text-[#D4A24C] uppercase tracking-wider font-extrabold flex items-center gap-1">
          <ShieldCheck className="w-2.5 h-2.5" />
          {current.badge}
        </span>
        <span className="text-white/30 font-light">|</span>
        <span className="text-xs sm:text-sm font-serif font-bold text-white group-hover:text-[#F59E0B] transition-colors">
          {current.name}
        </span>
        <span className="text-xs font-mono font-bold text-[#F59E0B]">
          {current.price}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#D4A24C] group-hover:translate-x-1 transition-transform ml-0.5" />
      </div>

      {/* 3D Product Pop-up Stage with Realistic Scale & Reflection */}
      <div
        onClick={handleClick}
        className="relative w-full h-[220px] sm:h-[260px] lg:h-[300px] flex items-end justify-center cursor-pointer group"
      >
        {/* The Popping Hardware Cutout */}
        <div
          className={`relative z-20 w-full h-full flex items-end justify-center transition-all duration-400 ease-out transform ${
            animating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0 animate-[float_4s_easeInOut_infinite]'
          }`}
        >
          <img
            src={current.image}
            alt={current.name}
            className="max-h-[190px] sm:max-h-[230px] lg:max-h-[260px] w-auto max-w-[90%] object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] filter contrast-105 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Tabletop Reflection - Sitting right on the wooden table surface */}
          <img
            src={current.image}
            alt="Table Reflection"
            aria-hidden="true"
            className="absolute top-[94%] left-1/2 -translate-x-1/2 z-[-2] max-h-[190px] sm:max-h-[230px] lg:max-h-[260px] w-auto max-w-[90%] object-contain object-top opacity-[0.10] pointer-events-none filter blur-[1.5px]"
            style={{ transform: 'translateX(-50%) scaleY(-1)' }}
          />
        </div>

        {/* Ambient Warm Golden Table Glow Under Product */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[280px] sm:w-[340px] h-[40px] bg-[#D4A24C]/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Interactive Carousel Pagination Indicators (4 dots) */}
      <div className="relative z-30 flex items-center justify-center gap-2 pt-3">
        {SHOWCASE_PRODUCTS.map((prod, idx) => (
          <button
            key={prod.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Select ${prod.name}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-6 h-1.5 bg-[#D4A24C] shadow-[0_0_8px_rgba(212,162,76,0.8)]'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
