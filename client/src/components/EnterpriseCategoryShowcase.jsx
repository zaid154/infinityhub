import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'thinkpad',
    name: 'ThinkPad Fleets',
    subtitle: 'Enterprise Durability & vPro Security',
    badge: '18+ In Fleet',
    specPill: 'Core i5/i7 vPro',
    image: '/products/real-thinkpad-t14-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'latitude',
    name: 'Dell Latitude',
    subtitle: 'Developer Workhorses & Long Battery',
    badge: '14+ In Fleet',
    specPill: '16GB / 512GB SSD',
    image: '/products/real-dell-latitude-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'workstation',
    name: 'Workstations',
    subtitle: 'Dedicated Quadro/RTX & CAD Power',
    badge: 'Flagship Rig',
    specPill: 'NVIDIA RTX GPU',
    image: '/products/real-mobile-workstation-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'monitor',
    name: 'Business Displays',
    subtitle: 'Frameless IPS & Ergonomic Stands',
    badge: 'Zero Dead Pixels',
    specPill: 'FHD & 4K IPS',
    image: '/products/real-dell-display-transparent.png',
    link: '/products?category=monitor'
  },
  {
    id: 'desktop',
    name: 'Enterprise PCs',
    subtitle: 'OptiPlex Micro & Silent Mini Towers',
    badge: 'Compact Form',
    specPill: 'Dual Display Ready',
    image: '/products/real-optiplex-pc-transparent.png',
    link: '/products?category=desktop'
  },
  {
    id: 'components',
    name: 'RAM & GPUs',
    subtitle: 'Samsung DDR4 & RTX 3060 12GB',
    badge: 'Bulk Ready',
    specPill: 'OEM Grade A+',
    image: '/products/real-rtx-3060-gpu-transparent.png',
    link: '/products?category=gpu'
  }
];

export default function EnterpriseCategoryShowcase() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 select-none">
      {/* ── HEADER ROW ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D4A24C]/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#8A5E12] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-[#D4A24C]" />
            Enterprise Hardware Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3B2A] tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63] mt-1">
            Certified commercial laptops, mobile workstations, monitors, and components ready for instant corporate deployment.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous categories"
            className="w-10 h-10 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] transition-colors shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next categories"
            className="w-10 h-10 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] transition-colors shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── 6 MODERN TECH CATEGORY CARDS ───────────────────────────────── */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6 gap-4 sm:gap-5 snap-x snap-mandatory scroll-smooth hide-scrollbar"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={cat.link}
            className="group min-w-[220px] sm:min-w-[240px] lg:min-w-0 snap-center bg-white rounded-3xl p-4 border border-[#D4A24C]/25 hover:border-[#0D3B2A] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            {/* Top Row: Inventory Badge & Quick Spec */}
            <div className="flex items-center justify-between gap-1 mb-2.5">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/25">
                {cat.badge}
              </span>
              <span className="text-[9px] font-mono text-[#5A6B63] bg-[#0D3B2A]/5 px-2 py-0.5 rounded-full truncate">
                {cat.specPill}
              </span>
            </div>

            {/* Elevated Hardware Display Stage (Warm Linen Pedestal) */}
            <div className="h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6]/60 border border-[#D4A24C]/20 flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-[#F3E8D2]/40 transition-colors duration-300">
              {/* Subtle tech halo ring watermark */}
              <div className="absolute w-28 h-28 rounded-full border border-[#D4A24C]/15 pointer-events-none" />

              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.14)] group-hover:scale-108 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Content Details */}
            <div className="pt-3.5 space-y-1">
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#0D3B2A] group-hover:text-[#D4A24C] transition-colors leading-tight line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#5A6B63] leading-snug line-clamp-1">
                {cat.subtitle}
              </p>
            </div>

            {/* Bottom Action Row */}
            <div className="pt-3 mt-3 border-t border-[#D4A24C]/15 flex items-center justify-between text-xs font-bold text-[#0D3B2A]">
              <span className="text-[11px] uppercase tracking-wider text-[#8A5E12] font-semibold group-hover:text-[#0D3B2A] transition-colors">
                Explore Fleet
              </span>
              <div className="w-6 h-6 rounded-full bg-[#FAF7F2] group-hover:bg-[#0D3B2A] text-[#0D3B2A] group-hover:text-white border border-[#D4A24C]/30 flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
