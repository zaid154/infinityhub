import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const SHOWCASE_PRODUCTS = [
  {
    id: 1,
    name: 'ThinkPad T14 Gen 2 Enterprise',
    category: 'Commercial Fleet Flagship',
    spec: 'Core i7 • 32GB RAM • 512GB NVMe',
    price: 'Lease ₹1,450 / month',
    badge: 'GRADE A+ CERTIFIED',
    image: '/products/thinkpad-t14.png',
    slug: 'lenovo-thinkpad-t490-enterprise-laptop'
  },
  {
    id: 2,
    name: 'Dell UltraSharp 27" Frameless IPS',
    category: 'Ergonomic Dual Display',
    spec: '4K UHD • 99% sRGB • Height Pivot Stand',
    price: 'Bulk Wholesale ₹5,499',
    badge: 'ZERO DEAD-PIXEL',
    image: '/products/dell-ultrasharp-display.png',
    slug: 'dell-professional-p2419h-24-inch-ips-display'
  },
  {
    id: 3,
    name: 'HP EliteBook 840 Executive Aluminum',
    category: 'Ultra-Light Corporate Notebook',
    spec: 'Magnesium Roll-Cage • SureView Privacy',
    price: 'Lease ₹1,650 / month',
    badge: 'MIL-SPEC TESTED',
    image: '/products/workstation-laptop.png',
    slug: 'hp-elitebook-840-g6-aluminum-executive'
  },
  {
    id: 4,
    name: 'Precision Workstation Fleet',
    category: 'Heavy AI & CAD Workstation',
    spec: '64GB ECC • RTX Workstation GPU',
    price: 'Lease ₹3,200 / month',
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
      }, 300);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const current = SHOWCASE_PRODUCTS[currentIndex];

  const handleClick = () => {
    if (current.slug) {
      navigate(`/products`);
    }
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[600px] flex flex-col items-center justify-end select-none">
      {/* Interactive Floating Product Card Info (Top Right - Glassmorphic) */}
      <div
        onClick={handleClick}
        className="absolute top-4 sm:top-6 right-2 sm:right-6 z-30 bg-[#072117]/85 backdrop-blur-xl border border-[#D4A24C]/50 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer hover:border-[#D4A24C] transition-all transform hover:scale-105 active:scale-95 group max-w-[280px]"
      >
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#D4A24C]/20">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest bg-[#D4A24C]/20 text-[#F59E0B] border border-[#D4A24C]/40 uppercase flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            {current.badge}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
        </div>

        <div className="pt-2 space-y-1">
          <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#F59E0B] transition-colors leading-snug">
            {current.name}
          </h4>
          <p className="text-[11px] text-white/70 font-mono">
            {current.spec}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono font-bold text-[#F59E0B]">
              {current.price}
            </span>
            <span className="text-[10px] text-white/80 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              <span>View</span>
              <ArrowRight className="w-3 h-3 text-[#D4A24C]" />
            </span>
          </div>
        </div>
      </div>

      {/* 3D Product Pop-up Stage with Reflection */}
      <div
        onClick={handleClick}
        className="relative w-full max-w-[560px] h-[360px] sm:h-[420px] lg:h-[480px] flex items-end justify-center cursor-pointer group"
      >
        {/* The Popping Hardware Image */}
        <div
          className={`relative z-20 w-full h-full flex items-end justify-center transition-all duration-500 ease-out transform ${
            animating ? 'opacity-0 scale-95 translate-y-6' : 'opacity-100 scale-100 translate-y-0 animate-[float_4s_easeInOut_infinite]'
          }`}
        >
          <img
            src={current.image}
            alt={current.name}
            className="w-[85%] sm:w-[88%] lg:w-[92%] max-h-[380px] sm:max-h-[440px] object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.65)] filter contrast-105 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Mirror Table Reflection - Exactly like Al-Tooba Foods */}
          <img
            src={current.image}
            alt="Table Reflection"
            aria-hidden="true"
            className="absolute top-[92%] left-1/2 -translate-x-1/2 z-[-2] w-[85%] sm:w-[88%] lg:w-[92%] max-h-[380px] sm:max-h-[440px] object-contain object-top opacity-[0.10] pointer-events-none filter blur-[1.5px]"
            style={{ transform: 'translateX(-50%) scaleY(-1)' }}
          />
        </div>

        {/* Ambient Radial Golden Glow under the Product */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] h-[60px] bg-[#D4A24C]/25 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Product Pagination Indicators - 4 dots */}
      <div className="relative z-30 flex items-center justify-center gap-2 pt-4">
        {SHOWCASE_PRODUCTS.map((prod, idx) => (
          <button
            key={prod.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Select ${prod.name}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-7 h-2 bg-[#D4A24C] shadow-[0_0_10px_rgba(212,162,76,0.8)]'
                : 'w-2 h-2 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
