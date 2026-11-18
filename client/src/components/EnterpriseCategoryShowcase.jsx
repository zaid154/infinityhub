import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'thinkpad',
    name: 'ThinkPad Fleets',
    specSummary: 'Intel Core i7 · 16GB DDR4 · 512GB SSD',
    badge: '18+ IN FLEET',
    image: '/products/real-thinkpad-t14-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'latitude',
    name: 'Dell Latitude',
    specSummary: 'Core i7 · 16GB RAM · 512GB NVMe',
    badge: '14+ IN FLEET',
    image: '/products/real-dell-latitude-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'workstation',
    name: 'Workstations',
    specSummary: 'Dedicated NVIDIA Quadro / RTX GPU',
    badge: 'FLAGSHIP RIG',
    image: '/products/real-mobile-workstation-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'monitor',
    name: 'Business Displays',
    specSummary: 'Frameless IPS · FHD & 4K Displays',
    badge: 'ZERO DEAD PIXELS',
    image: '/products/real-dell-display-transparent.png',
    link: '/products?category=monitor'
  },
  {
    id: 'desktop',
    name: 'Enterprise PCs',
    specSummary: 'OptiPlex Micro & Silent Mini Towers',
    badge: 'COMPACT FORM',
    image: '/products/real-optiplex-pc-transparent.png',
    link: '/products?category=desktop'
  },
  {
    id: 'components',
    name: 'RAM & GPUs',
    specSummary: 'Samsung DDR4 & RTX 3060 12GB',
    badge: 'BULK READY',
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* ── LUXURY CENTERED SECTION HEADER ────────────────────────────── */}
      <div className="relative text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#D4A24C]/40 text-[#8A5E12] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A24C]" />
          Certified Commercial Hardware
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0D3B2A] tracking-tight">
          Shop by Categories
        </h2>
        
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4A24C] to-transparent mx-auto mt-3 mb-2.5" />
        
        <p className="text-xs sm:text-sm text-[#5A6B63] max-w-2xl mx-auto">
          Explore our wide range of enterprise fleets and high-performance commercial hardware.
        </p>

        {/* Carousel Arrow Controls (Floating Right on Desktop / Tablet) */}
        <div className="sm:absolute sm:right-0 sm:bottom-0 mt-4 sm:mt-0 flex items-center justify-center sm:justify-end gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous categories"
            className="w-10 h-10 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] hover:border-[#0D3B2A] transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next categories"
            className="w-10 h-10 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] hover:border-[#0D3B2A] transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── 6 REFINED B2B CATEGORY CARDS ───────────────────────────────── */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6 gap-4 sm:gap-5 snap-x snap-mandatory scroll-smooth hide-scrollbar"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={cat.link}
            className="group min-w-[220px] sm:min-w-[240px] lg:min-w-0 snap-center bg-white rounded-3xl border border-[#D4A24C]/25 hover:border-[#D4A24C] shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            {/* Top Stage: Warm Linen Pedestal with Single Floating Gold Badge */}
            <div className="relative bg-gradient-to-b from-[#FAF7F2] via-[#F6F0E7] to-[#EFE7DC] p-3.5 pt-3 flex flex-col justify-between h-44 sm:h-48 border-b border-[#D4A24C]/20 overflow-hidden">
              {/* Floating Inventory Badge */}
              <div className="self-start z-10">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider text-[#8A5E12] bg-white/90 border border-[#D4A24C]/50 shadow-xs">
                  [{cat.badge}]
                </span>
              </div>

              {/* Hardware Device on 3D Pedestal Stage */}
              <div className="relative flex-1 flex items-center justify-center my-1">
                {/* Pedestal Surface Shadow Effect */}
                <div className="absolute bottom-1 w-28 h-5 bg-[#D4A24C]/15 rounded-full blur-md" />
                <div className="absolute bottom-1.5 w-20 h-3 bg-black/10 rounded-full blur-xs" />

                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="relative z-10 max-h-28 sm:max-h-32 max-w-[90%] object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
            </div>

            {/* Bottom Content Area: Crisp White Base with Deep Emerald Serif Typography */}
            <div className="p-4 pt-3 flex flex-col flex-1 justify-between bg-white">
              <div>
                <h3 className="text-[14px] sm:text-[15px] font-serif font-bold text-[#0D3B2A] group-hover:text-[#B8860B] transition-colors leading-snug min-h-[2.25rem] flex items-center">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#5A6B63] font-mono mt-1 leading-normal line-clamp-2 min-h-[2rem]">
                  {cat.specSummary}
                </p>
              </div>

              {/* Luxury Gold CTA Button */}
              <div className="mt-3.5 pt-1">
                <div className="w-full py-2 px-3 rounded-full bg-gradient-to-r from-[#D4A24C] via-[#E2B768] to-[#C29037] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm group-hover:from-[#0D3B2A] group-hover:via-[#1B4D3E] group-hover:to-[#0D3B2A] group-hover:shadow-md transition-all duration-300">
                  <span className="tracking-wide">Explore Fleet</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
