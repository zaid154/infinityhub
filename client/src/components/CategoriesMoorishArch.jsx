import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'thinkpad',
    name: 'ThinkPad Fleets',
    image: '/products/real-thinkpad-t14-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'ultrabook',
    name: 'Dell Latitude',
    image: '/products/real-dell-latitude-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'workstation',
    name: 'Workstations',
    image: '/products/real-mobile-workstation-transparent.png',
    link: '/products?category=laptop'
  },
  {
    id: 'monitor',
    name: 'Business Displays',
    image: '/products/real-dell-display-transparent.png',
    link: '/products?category=monitor'
  },
  {
    id: 'desktop',
    name: 'Enterprise PCs',
    image: '/products/real-optiplex-pc-transparent.png',
    link: '/products?category=desktop'
  },
  {
    id: 'ram',
    name: 'RAM & Storage',
    image: '/products/real-enterprise-ram-transparent.png',
    link: '/products?category=ram'
  }
];

export default function CategoriesMoorishArch() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 select-none">
      {/* SVG ClipPath Definition for Exact Moorish Arch Geometry */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="mehrab-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.015,0.267 C 0.015,0.143 0.215,0.077 0.5,0.010 C 0.785,0.077 0.985,0.143 0.985,0.267 L 0.985,0.950 C 0.985,0.970 0.955,0.990 0.925,0.990 L 0.075,0.990 C 0.045,0.990 0.015,0.970 0.015,0.950 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Header Row: Centered Title & Subtitle + Carousel Navigation Arrows */}
      <div className="relative flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0D3B2A] tracking-tight mb-2">
          Shop by Categories
        </h2>
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#D4A24C] font-semibold block">
          EXPLORE OUR WIDE RANGE OF ENTERPRISE FLEETS
        </span>
        <div className="w-12 h-0.5 bg-[#D4A24C] mx-auto mt-3.5 opacity-50"></div>

        {/* Carousel Arrow Buttons - Exactly like Al-Tooba (< and >) */}
        <div className="hidden sm:flex absolute right-0 bottom-1 items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous Category"
            className="w-10 h-10 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#D4A24C] hover:text-white transition shadow-sm hover:shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next Category"
            className="w-10 h-10 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#D4A24C] hover:text-white transition shadow-sm hover:shadow-md flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 6 Moorish Arch Cards Track (Swipeable on Mobile/Tablet, 6-Col Grid on Desktop) */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={cat.link}
            className="relative min-w-[170px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-0 aspect-[3/4.6] lg:aspect-[3/4.8] cursor-pointer group snap-center filter drop-shadow-[0_10px_20px_rgba(13,59,42,0.08)] block shrink-0 lg:shrink transition-transform duration-300 hover:-translate-y-1.5"
          >
            {/* Card Interior with Mehrab Clip Path */}
            <div
              className="relative w-full h-full overflow-hidden bg-white group-hover:bg-[#FCFAF7] transition-colors"
              style={{ clipPath: 'url(#mehrab-clip)' }}
            >
              {/* Product Cutout Image Standing Upright with Generous Vertical Space */}
              <div className="absolute inset-0 flex items-center justify-center pt-10 pb-16 px-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-contain object-bottom group-hover:scale-108 transition-transform duration-500 ease-out filter drop-shadow-[0_10px_14px_rgba(0,0,0,0.12)]"
                />
              </div>

              {/* Bottom Subtle Gradient Shadow */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#E8E1D5]/70 via-white/40 to-transparent pointer-events-none" />

              {/* Category Name Label at Bottom - Exactly like Al-Tooba (Single Line, Uniform Baseline) */}
              <div className="absolute inset-x-0 bottom-3.5 sm:bottom-4 h-7 flex items-center justify-center text-center z-20 pointer-events-none px-2">
                <h3 className="text-xs sm:text-sm md:text-[15px] font-serif font-bold text-[#0D3B2A] group-hover:text-[#D4A24C] transition-colors tracking-wide leading-tight truncate w-full drop-shadow-sm">
                  {cat.name}
                </h3>
              </div>
            </div>

            {/* Overlaid Gold Moorish Arch Outline SVG Vector - Exact Geometry from Al-Tooba */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-30 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,162,76,0.6)]"
              viewBox="0 0 100 150"
              preserveAspectRatio="none"
            >
              <path
                d="M 1.5,40 C 1.5,21.5 21.5,11.5 50,1.5 C 78.5,11.5 98.5,21.5 98.5,40 L 98.5,142.5 C 98.5,145.5 95.5,148.5 92.5,148.5 L 7.5,148.5 C 4.5,148.5 1.5,145.5 1.5,142.5 Z"
                fill="none"
                stroke="#D4A24C"
                strokeWidth="1.8"
              />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
