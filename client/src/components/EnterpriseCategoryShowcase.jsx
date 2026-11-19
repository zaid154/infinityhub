import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { getSafeImageUrl } from '../utils/imageHelper';

export default function EnterpriseCategoryShowcase() {
  const sliderRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categoryFallbackImages = {
    laptops: '/products/commercial-elite.png',
    desktops: '/products/real-optiplex-pc-transparent.png',
    monitors: '/products/real-dell-display-transparent.png',
    ram: '/products/real-enterprise-ram-transparent.png',
    gpu: '/products/real-rtx-3060-gpu-transparent.png',
    cpu: '/products/real-enterprise-ram-transparent.png',
    other: '/products/commercial-elite.png'
  };

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products', { params: { limit: 50 } })
        ]);

        const dbCategories = catRes.data?.categories || [];
        const dbProducts = prodRes.data?.products || [];

        // Build dynamic category cards from MongoDB records
        const dynamicCats = dbCategories.slice(0, 6).map((cat) => {
          const catSlug = cat.slug?.toLowerCase().replace(/s$/, '') || '';
          const matchingProds = dbProducts.filter((p) => {
            const pCat = p.category?.toLowerCase() || '';
            return pCat === catSlug || pCat === cat.slug || pCat.startsWith(catSlug);
          });

          const totalStock = matchingProds.reduce(
            (acc, p) => acc + (p.sale_stock || 0) + (p.rental_stock || 0),
            0
          );

          const featuredProd = matchingProds.find((p) => p.is_featured) || matchingProds[0];
          const image = (featuredProd && getSafeImageUrl(featuredProd)) || categoryFallbackImages[cat.slug] || '/products/commercial-elite.png';

          return {
            id: cat._id,
            name: cat.name,
            badge: totalStock > 0 ? `${totalStock}+ in stock` : 'Available to Order',
            image,
            link: `/products?category=${cat.slug}`
          };
        });

        setCategories(dynamicCats);
      } catch (err) {
        console.error('[EnterpriseCategoryShowcase] Dynamic fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* ── AL-TOOBA MOORISH ARCH SECTION HEADER ─────────────────────── */}
      <div className="relative text-center mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0D3B2A] tracking-tight">
          Shop by Categories
        </h2>
        
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] font-mono text-[#D4A24C] font-semibold mt-2">
          EXPLORE OUR WIDE RANGE OF CERTIFIED ENTERPRISE HARDWARE
        </p>

        {/* Carousel Arrow Controls (Header Right) */}
        <div className="sm:absolute sm:right-0 sm:bottom-0 mt-3 sm:mt-0 flex items-center justify-center sm:justify-end gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous categories"
            className="w-9 h-9 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] hover:border-[#0D3B2A] transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next categories"
            className="w-9 h-9 rounded-full bg-white border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] hover:border-[#0D3B2A] transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 6 MOORISH ARCH CATEGORY CARDS (AL-TOOBA REFERENCE STYLING) ───────── */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
      >
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="min-w-[175px] h-64 sm:h-72 bg-white arch-card border-2 border-[#D4A24C]/30 animate-pulse" />
          ))
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group min-w-[175px] sm:min-w-[190px] lg:min-w-0 snap-center arch-card bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] hover:bg-white border-2 border-[#D4A24C]/60 hover:border-[#D4A24C] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-between p-4 pt-6 cursor-pointer overflow-hidden h-64 sm:h-72"
            >
              {/* Hardware Device on 3D Pedestal Stage inside Moorish Arch */}
              <div className="relative flex-1 w-full flex items-center justify-center my-auto">
                {/* Pedestal Surface Shadow Effect */}
                <div className="absolute bottom-2 w-28 h-3.5 bg-[#D4A24C]/15 rounded-full blur-md" />
                <div className="absolute bottom-2.5 w-20 h-2 bg-black/10 rounded-full blur-xs" />

                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="relative z-10 max-h-28 sm:max-h-32 max-w-[85%] object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.12)] group-hover:scale-108 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Bottom Category Name (Pure Al-Tooba Style Typography) */}
              <div className="text-center w-full pt-2 pb-1">
                <h3 className="text-[14px] sm:text-[15px] font-serif font-bold text-[#0D3B2A] group-hover:text-[#B8860B] transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-[#8A5E12] font-mono mt-1 leading-normal truncate">
                  {cat.badge}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
