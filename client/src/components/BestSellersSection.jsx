import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Repeat } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getSafeImageUrl } from '../utils/imageHelper';
import toast from 'react-hot-toast';

export default function BestSellersSection({ onOpenRFQ }) {
  const { addToCart, addToRentalCart } = useCart();
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // Query database for hot deals or featured products
        let res = await api.get('/products', {
          params: { is_hot_deal: true, limit: 5 }
        });

        if (!res.data.success || !res.data.products || res.data.products.length < 3) {
          // Fallback to top featured products if hot deals count is small
          res = await api.get('/products', {
            params: { sort: 'featured', limit: 5 }
          });
        }

        if (res.data.success && res.data.products?.length > 0) {
          setBestSellers(res.data.products);
        }
      } catch (err) {
        console.error('[BestSellersSection] Live hardware fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handleAction = (item) => {
    const inStock = (item.sale_stock || item.stock_quantity || 0) > 0 || (item.rental_stock || 0) > 0;
    if (!inStock) {
      toast.error(`${item.title} is currently fully booked. Requesting priority dispatch!`);
      onOpenRFQ?.(`Waitlist Request: ${item.title}`);
      return;
    }

    if (item.available_for === 'rent') {
      addToRentalCart(item, 1, '6_months');
      toast.success(`${item.title} added to Rental Cart!`);
    } else {
      addToCart(item, 1);
      toast.success(`${item.title} added to Purchase Cart!`);
    }
  };

  const formatSpecs = (p) => {
    const parts = [p.specs?.processor, p.specs?.ram, p.specs?.storage].filter(Boolean);
    if (parts.length > 0) return parts.join(' • ');
    if (p.specs && typeof p.specs === 'object') {
      const generic = Object.values(p.specs).filter((v) => typeof v === 'string' && v.trim());
      if (generic.length > 0) return generic.slice(0, 3).join(' • ');
    }
    return p.description ? p.description.slice(0, 48) : 'Enterprise Certified Machine';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8">
      {/* Al-Tooba Exact Centered Typography Header */}
      <div className="text-center mb-8 sm:mb-10 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#0D3B2A] font-bold mb-2 sm:mb-3 tracking-tight">
          Our Best Sellers
        </h2>
        <p className="text-[#D4A24C] font-sans font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
          Handpicked fleets loved by our corporate clients
        </p>
        <div className="w-12 h-0.5 bg-[#D4A24C] mx-auto mt-4 opacity-50"></div>
      </div>

      {/* 5 Best Seller Product Cards (100% Dynamic from MongoDB) */}
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[240px] h-80 bg-[#FAF7F2] rounded-2xl border border-[#D4A24C]/15 animate-pulse" />
          ))
        ) : (
          bestSellers.map((item) => {
            const inStock = (item.sale_stock || item.stock_quantity || 0) > 0 || (item.rental_stock || 0) > 0;
            const isRental = item.available_for === 'rent' || (item.rental_price_monthly > 0 && item.sale_price === 0);
            const displayPrice = isRental
              ? `₹${(item.rental_price_monthly || 1350).toLocaleString('en-IN')}`
              : `₹${(item.sale_price || 0).toLocaleString('en-IN')}`;

            return (
              <div
                key={item._id}
                className="group bg-[#FAF7F2] rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-3 flex flex-col justify-between h-full border border-[#D4A24C]/15 hover:border-[#D4A24C]/40 shadow-[0_8px_30px_rgba(13,59,42,0.03)] hover:shadow-[0_20px_40px_rgba(13,59,42,0.1)] transition-all duration-500 relative overflow-hidden min-w-[240px] sm:min-w-[260px] lg:min-w-0 snap-center"
              >
                <div>
                  {/* White Product Image Stage Box */}
                  <Link
                    to={`/products/${item.slug}`}
                    className="relative w-full shrink-0 aspect-[1/1] rounded-[12px] sm:rounded-[14px] overflow-hidden bg-white mb-2 md:mb-3 z-10 shadow-inner border border-gray-100 group/img flex items-center justify-center p-3 block"
                  >
                    <img
                      src={getSafeImageUrl(item)}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 filter drop-shadow-[0_10px_12px_rgba(0,0,0,0.12)]"
                    />
                  </Link>

                  {/* Brand & Star Rating Row */}
                  <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
                    <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 truncate">
                      {item.brand || 'Enterprise'}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0D3B2A] shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#8A5E12] text-[#8A5E12]" />
                      <span>5.0</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">Grade A+</span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <Link to={`/products/${item.slug}`} className="block px-0.5">
                    <h3 className="text-[13px] sm:text-[15px] font-sans font-bold text-[#0D3B2A] mb-1 leading-snug group-hover:text-[#8A5E12] transition-colors duration-300 line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Compact Spec Snippet */}
                  <p className="text-[11px] text-[#5A6B63] px-0.5 font-sans line-clamp-1 mb-2">
                    {formatSpecs(item)}
                  </p>
                </div>

                {/* Bottom Row: Dynamic Pricing & Action Button */}
                <div className="pt-2 border-t border-[#D4A24C]/15 flex items-center justify-between gap-2 px-0.5">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] block">
                      {isRental ? 'Monthly Lease' : 'Direct Buy'}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#0D3B2A] font-serif">
                      {displayPrice}
                      {isRental && <span className="text-[10px] font-normal text-[#5A6B63]">/mo</span>}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAction(item)}
                    className="px-3.5 py-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-[11px] font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title={isRental ? 'Rent Fleet' : 'Add to Cart'}
                  >
                    {isRental ? <Repeat className="w-3.5 h-3.5 text-[#D4A24C]" /> : <ShoppingBag className="w-3.5 h-3.5 text-[#D4A24C]" />}
                    <span>{isRental ? 'Rent' : 'Buy'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
