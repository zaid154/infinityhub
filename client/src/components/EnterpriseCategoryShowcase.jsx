import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'thinkpad',
    name: 'ThinkPad Fleets',
    specSummary: 'Core i7 · 16GB · 512GB SSD',
    badge: '18+ IN FLEET',
    image: '/products/real-thinkpad-t14-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'latitude',
    name: 'Dell Latitude',
    specSummary: 'Core i7 · 16GB · 512GB NVMe',
    badge: '14+ IN FLEET',
    image: '/products/real-dell-latitude-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'workstation',
    name: 'Workstations',
    specSummary: 'Dedicated RTX & Quadro GPU',
    badge: 'FLAGSHIP RIG',
    image: '/products/real-mobile-workstation-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'monitor',
    name: 'Business Displays',
    specSummary: 'Frameless IPS · FHD / 4K',
    badge: 'ZERO DEAD PIXELS',
    image: '/products/real-dell-display-transparent.png',
    link: '/products?category=monitor'
  },
  {
    id: 'desktop',
    name: 'Enterprise PCs',
    specSummary: 'OptiPlex Micro & Mini PCs',
    badge: 'COMPACT FORM',
    image: '/products/real-optiplex-pc-transparent.png',
    link: '/products?category=desktop'
  },
  {
    id: 'components',
    name: 'RAM & GPUs',
    specSummary: 'Samsung RAM & RTX 3060',
    badge: 'BULK READY',
    image: '/products/real-rtx-3060-gpu-transparent.png',
    link: '/products?category=gpu'
  }
];

export default function EnterpriseCategoryShowcase() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* ── COMPACT LUXURY CENTERED SECTION HEADER ─────────────────────── */}
      <div className="relative text-center mb-4 sm:mb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D4A24C]/40 text-[#8A5E12] text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3 h-3 text-[#D4A24C]" />
          Certified Commercial Hardware
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0D3B2A] tracking-tight">
          Shop by Categories
        </h2>
        
        <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-[#D4A24C] to-transparent mx-auto mt-2 mb-1.5" />
        
        <p className="text-xs text-[#5A6B63] max-w-xl mx-auto">
          Explore our wide range of enterprise fleets and high-performance commercial hardware.
        </p>

        {/* Carousel Arrow Controls (Mobile & Tablet only; Desktop uses full 6-col balanced grid) */}
        <div className="lg:hidden sm:absolute sm:right-0 sm:bottom-0 mt-3 sm:mt-0 flex items-center justify-center sm:justify-end gap-1.5">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous categories"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] hover:border-[#0D3B2A] transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next categories"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] hover:border-[#0D3B2A] transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 6 BALANCED SCREEN-FITTING B2B CATEGORY CARDS ───────────────── */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-3.5 snap-x snap-mandatory scroll-smooth hide-scrollbar"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={cat.link}
            className="group min-w-[175px] sm:min-w-[195px] lg:min-w-0 snap-center bg-white rounded-2xl border border-[#D4A24C]/25 hover:border-[#D4A24C] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer overflow-hidden"
          >
            {/* Top Stage: Warm Linen Pedestal (Compact & Proportional) */}
            <div className="relative bg-gradient-to-b from-[#FAF7F2] via-[#F6F0E7] to-[#EFE7DC] p-2.5 pt-2 flex flex-col justify-between h-28 sm:h-32 border-b border-[#D4A24C]/20 overflow-hidden">
              {/* Floating Inventory Badge */}
              <div className="self-start z-10">
                <span className="inline-block px-2 py-0.5 rounded text-[8.5px] font-mono font-bold tracking-wider text-[#8A5E12] bg-white/90 border border-[#D4A24C]/50 shadow-xs">
                  [{cat.badge}]
                </span>
              </div>

              {/* Hardware Device on 3D Pedestal Stage */}
              <div className="relative flex-1 flex items-center justify-center my-0.5">
                {/* Pedestal Surface Shadow Effect */}
                <div className="absolute bottom-0.5 w-24 h-4 bg-[#D4A24C]/15 rounded-full blur-md" />
                <div className="absolute bottom-1 w-18 h-2.5 bg-black/10 rounded-full blur-xs" />

                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="relative z-10 max-h-20 sm:max-h-24 max-w-[88%] object-contain filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.14)] group-hover:scale-108 transition-transform duration-500 ease-out"
                />
              </div>
            </div>

            {/* Bottom Content Area: Crisp White Base with Balanced Typography */}
            <div className="p-3 pt-2.5 flex flex-col flex-1 justify-between bg-white">
              <div>
                <h3 className="text-[13px] sm:text-[14px] font-serif font-bold text-[#0D3B2A] group-hover:text-[#B8860B] transition-colors leading-tight truncate">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-[10.5px] text-[#5A6B63] font-mono mt-0.5 leading-normal truncate">
                  {cat.specSummary}
                </p>
              </div>

              {/* Luxury Gold CTA Button */}
              <div className="mt-2.5">
                <div className="w-full py-1.5 px-2.5 rounded-full bg-gradient-to-r from-[#D4A24C] via-[#E2B768] to-[#C29037] text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs group-hover:from-[#0D3B2A] group-hover:via-[#1B4D3E] group-hover:to-[#0D3B2A] transition-all duration-300">
                  <span className="tracking-wide">Explore Fleet</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
