import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight, Repeat, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AppleSpotlightCard } from '../animations';
import api from '../services/api';
import { getSafeImageUrl } from '../utils/imageHelper';
import toast from 'react-hot-toast';

export default function CompleteCollectionSection({ onOpenRFQ }) {
  const { addToCart, addToRentalCart, buyCart, rentalCart } = useCart();
  const [filterType, setFilterType] = useState('all'); // 'all', 'rent', 'sale'
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await api.get('/products', {
          params: { limit: 12 }
        });
        if (res.data.success && res.data.products?.length > 0) {
          setCollection(res.data.products);
        }
      } catch (err) {
        console.error('[CompleteCollectionSection] Dynamic fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  const filteredItems = collection.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'rent') return item.available_for === 'rent' || item.available_for === 'both' || item.rental_price_monthly > 0;
    if (filterType === 'sale') return item.available_for === 'sale' || item.available_for === 'both' || item.sale_price > 0;
    return true;
  });

  const handleAction = (e, item) => {
    const inStock = (item.sale_stock || item.stock_quantity || 0) > 0 || (item.rental_stock || 0) > 0;
    if (!inStock) {
      toast.error(`${item.title} is currently fully booked. Requesting priority dispatch!`);
      onOpenRFQ?.(`Waitlist Request: ${item.title}`);
      return;
    }

    if (filterType === 'rent' || item.available_for === 'rent') {
      addToRentalCart(item, 1, '6_months');
    } else {
      addToCart(item, 1);
    }
  };

  const formatSpecs = (p) => {
    const parts = [p.specs?.processor, p.specs?.ram, p.specs?.storage].filter(Boolean);
    if (parts.length > 0) return parts.join(' • ');
    if (p.specs && typeof p.specs === 'object') {
      const generic = Object.values(p.specs).filter((v) => typeof v === 'string' && v.trim());
      if (generic.length > 0) return generic.slice(0, 3).join(' • ');
    }
    return p.description ? p.description.slice(0, 52) : 'Enterprise Grade A+ Machine';
  };

  return (
    <section className="relative bg-[#f4efe6] py-12 sm:py-16 md:py-20 overflow-hidden border-t border-[#e8dece]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Al-Tooba Exact Section Header Structure */}
        <div className="text-center mb-8 sm:mb-10 relative z-10 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#0D3B2A] font-bold mb-2 sm:mb-3 tracking-tight">
            Our Complete Collection
          </h2>
          
          <p className="text-[#8A5E12] font-sans font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs md:text-sm mb-5 sm:mb-6">
            EXPLORE OUR VERIFIED RENTAL & SALE FLEETS
          </p>

          {/* Al-Tooba Signature Pill Button */}
          <Link to="/products" className="inline-block mb-6">
            <button className="relative overflow-hidden cursor-pointer liquid bg-transparent border border-[#8A5E12] text-[#0D3B2A] px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-sans font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2.5 sm:gap-3 group/btn hover:border-transparent hover:bg-[#0D3B2A] hover:text-[#FAF7F2] active:scale-95 shadow-sm">
              <span>Explore Full Collection</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>

          {/* Filter Pills: All / Renting / Selling */}
          <div className="inline-flex p-1 bg-white/70 backdrop-blur rounded-full border border-[#D4A24C]/25 text-xs font-semibold gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#0D3B2A] text-white shadow-sm'
                  : 'text-[#0D3B2A] hover:text-[#8A5E12]'
              }`}
            >
              All Hardware
            </button>
            <button
              onClick={() => setFilterType('rent')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                filterType === 'rent'
                  ? 'bg-[#0D3B2A] text-white shadow-sm'
                  : 'text-[#0D3B2A] hover:text-[#8A5E12]'
              }`}
            >
              Laptop Rentals
            </button>
            <button
              onClick={() => setFilterType('sale')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                filterType === 'sale'
                  ? 'bg-[#0D3B2A] text-white shadow-sm'
                  : 'text-[#0D3B2A] hover:text-[#8A5E12]'
              }`}
            >
              Certified Selling (Buy)
            </button>
          </div>
        </div>

        {/* Product Cards Grid (100% Dynamic from MongoDB) */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[260px] h-84 bg-white rounded-2xl border border-[#D4A24C]/20 animate-pulse" />
            ))
          ) : (
            filteredItems.map((item) => {
              const isRental = filterType === 'rent' || item.available_for === 'rent' || (item.rental_price_monthly > 0 && item.sale_price === 0);
              const displayPrice = isRental
                ? `₹${(item.rental_price_monthly || 1350).toLocaleString('en-IN')}`
                : `₹${(item.sale_price || 0).toLocaleString('en-IN')}`;

              const inCartQty = isRental
                ? rentalCart.find((c) => c.product._id === item._id)?.quantity || 0
                : buyCart.find((c) => c.product._id === item._id)?.quantity || 0;

              return (
                <AppleSpotlightCard
                  key={item._id}
                  className="bg-white rounded-[16px] sm:rounded-[20px] p-3 sm:p-3.5 flex flex-col justify-between h-full border border-[#D4A24C]/20 hover:border-[#D4A24C]/60 shadow-[0_8px_30px_rgba(13,59,42,0.03)] hover:shadow-[0_20px_40px_rgba(13,59,42,0.1)] relative min-w-[250px] sm:min-w-[270px] lg:min-w-0 snap-center"
                >
                  <div>
                    {/* Badge Overlay */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30">
                        {item.condition === 'brand_new' ? 'Brand New' : item.available_for === 'rent' ? 'Rental Fleet' : 'Certified Grade A+'}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800 font-semibold">
                        {(item.sale_stock || item.stock_quantity || 1)} in stock
                      </span>
                    </div>

                    {/* White Product Image Stage Box */}
                    <Link
                      to={`/products/${item.slug}`}
                      className="relative w-full aspect-[4/3] rounded-[12px] sm:rounded-[14px] overflow-hidden bg-[#FAF7F2] mb-2.5 z-10 border border-[#D4A24C]/15 flex items-center justify-center p-3 block group-hover:border-[#D4A24C]/40 transition-colors"
                    >
                      {inCartQty > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8.5px] font-mono font-bold tracking-wider uppercase bg-[#0D3B2A] text-[#D4A24C] border border-[#D4A24C]/60 shadow-md z-20 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-[#D4A24C]" />
                          In Cart ({inCartQty})
                        </span>
                      )}
                      <img
                        src={getSafeImageUrl(item)}
                        alt={item.title}
                        loading="lazy"
                        className="max-h-36 max-w-full object-contain group-hover:scale-106 transition-all duration-500 filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.1)]"
                      />
                    </Link>

                    {/* Product Brand */}
                    <div className="text-[9.5px] font-sans font-bold uppercase tracking-widest text-gray-500 mb-1">
                      {item.brand || 'Enterprise Hardware'}
                    </div>

                    {/* Product Title */}
                    <Link to={`/products/${item.slug}`} className="block">
                      <h3 className="text-[13px] sm:text-[14px] font-serif font-bold text-[#0D3B2A] mb-1 leading-snug group-hover:text-[#8A5E12] transition-colors duration-300 line-clamp-2 min-h-[36px]">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Spec Snippet */}
                    <p className="text-[11px] text-[#5A6B63] font-mono line-clamp-1 mb-2">
                      {formatSpecs(item)}
                    </p>
                  </div>

                  {/* Bottom Row */}
                  <div className="pt-2.5 border-t border-[#D4A24C]/15 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] block">
                        {isRental ? 'Monthly Lease' : 'Direct Buy'}
                      </span>
                      <span className="text-base font-bold text-[#0D3B2A] font-serif">
                        {displayPrice}
                        {isRental && <span className="text-[10px] font-normal text-[#5A6B63]">/mo</span>}
                      </span>
                    </div>

                    {inCartQty > 0 ? (
                      <Link
                        to="/cart"
                        className="px-3.5 py-2 rounded-full bg-[#0D3B2A] text-white text-[11px] font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 border border-[#D4A24C]/50 hover:bg-[#153423] cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-[#D4A24C]" />
                        <span>In Cart ({inCartQty})</span>
                      </Link>
                    ) : (
                      <button
                        onClick={(e) => handleAction(e, item)}
                        className="px-3.5 py-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-[11px] font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
                      >
                        {isRental ? <Repeat className="w-3.5 h-3.5 text-[#D4A24C]" /> : <ShoppingBag className="w-3.5 h-3.5 text-[#D4A24C]" />}
                        <span>{isRental ? 'Rent' : 'Buy'}</span>
                      </button>
                    )}
                  </div>
                </AppleSpotlightCard>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
