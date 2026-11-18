import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const COMPLETE_COLLECTION = [
  {
    _id: 'col-1',
    title: 'Lenovo ThinkPad T14 Gen 2 Quad Core',
    brand: 'THINKPAD ENTERPRISE',
    category: 'laptop',
    badge: 'RENTAL FLEET',
    type: 'rent',
    specs: 'Core i5 11th Gen • 16GB DDR4 • 512GB NVMe SSD',
    active_price: 1850,
    price_unit: '/mo',
    original_price: 2700,
    rating: '5.0',
    reviews: 58,
    image: '/products/real-thinkpad-t14-transparent.png',
    inStock: true,
    slug: 'lenovo-thinkpad-t14-gen-2-enterprise'
  },
  {
    _id: 'col-2',
    title: 'Dell Latitude 5420 Corporate Edition',
    brand: 'DELL COMMERCIAL',
    category: 'laptop',
    badge: 'CERTIFIED BUY',
    type: 'sale',
    specs: 'Core i7 11th Gen • 16GB RAM • 512GB NVMe • Win 11 Pro',
    active_price: 28500,
    price_unit: '',
    original_price: 42000,
    rating: '4.9',
    reviews: 44,
    image: '/products/real-dell-latitude-transparent.png',
    inStock: true,
    slug: 'dell-latitude-5420-corporate-business-laptop'
  },
  {
    _id: 'col-3',
    title: 'HP EliteBook 850 G7 Aluminum Workhorse',
    brand: 'HP EXECUTIVE',
    category: 'laptop',
    badge: 'RENTAL & LEASE',
    type: 'rent',
    specs: 'Core i5 10th Gen • 16GB RAM • 256GB SSD • 15.6" IPS',
    active_price: 1650,
    price_unit: '/mo',
    original_price: 2400,
    rating: '4.9',
    reviews: 38,
    image: '/products/real-mobile-workstation-transparent.png',
    inStock: true,
    slug: 'hp-elitebook-850-g7-aluminum-workhorse'
  },
  {
    _id: 'col-4',
    title: 'Dell OptiPlex 7000 Micro Enterprise PC',
    brand: 'DELL OPTIPLEX',
    category: 'desktop',
    badge: 'OUTRIGHT SALE',
    type: 'sale',
    specs: 'Core i7 12th Gen • 32GB RAM • 1TB NVMe • Win 11 Pro',
    active_price: 36000,
    price_unit: '',
    original_price: 54000,
    rating: '5.0',
    reviews: 26,
    image: '/products/real-optiplex-pc-transparent.png',
    inStock: true,
    slug: 'dell-optiplex-7000-micro-desktop'
  },
  {
    _id: 'col-5',
    title: 'Dell UltraSharp 27" 4K UHD Frameless Display',
    brand: 'DELL DISPLAYS',
    category: 'monitor',
    badge: 'DISPLAY LEASE',
    type: 'rent',
    specs: '4K IPS 3840x2160 • 99% sRGB • USB-C 90W Hub • Height Pivot',
    active_price: 650,
    price_unit: '/mo',
    original_price: 1100,
    rating: '4.9',
    reviews: 64,
    image: '/products/real-dell-display-transparent.png',
    inStock: true,
    slug: 'dell-ultrasharp-u2720q-4k-uhd-display'
  }
];

export default function CompleteCollectionSection({ onOpenRFQ }) {
  const { addToCart } = useCart();
  const [filterType, setFilterType] = useState('all'); // 'all', 'rent', 'sale'

  const filteredItems = filterType === 'all' 
    ? COMPLETE_COLLECTION 
    : COMPLETE_COLLECTION.filter((i) => i.type === filterType);

  const handleAddToCart = (item) => {
    if (!item.inStock) {
      toast.error(`${item.title} is currently fully booked. Requesting priority dispatch!`);
      onOpenRFQ?.(`Waitlist Request: ${item.title}`);
      return;
    }

    addToCart(
      {
        _id: item._id,
        title: item.title,
        sale_price: item.type === 'sale' ? item.active_price : item.active_price * 12,
        rental_price_monthly: item.type === 'rent' ? item.active_price : Math.round(item.active_price / 18),
        images: [{ url: item.image }],
        category: item.category
      },
      1
    );
  };

  return (
    <section className="relative bg-[#f4efe6] py-12 sm:py-16 md:py-20 overflow-hidden border-t border-[#e8dece] select-none">
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

        {/* 5 Product Cards Grid - Exact Al-Tooba Anatomy */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group bg-[#FAF7F2] rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-3 flex flex-col justify-between h-full border border-[#D4A24C]/15 hover:border-[#D4A24C]/40 shadow-[0_4px_20px_rgba(13,59,42,0.03)] hover:shadow-[0_20px_40px_rgba(13,59,42,0.1)] transition-all duration-500 relative overflow-hidden min-w-[240px] sm:min-w-[260px] lg:min-w-0 snap-center"
            >
              {/* Al-Tooba Exact Flush Category Badge (Top Right) */}
              <div className="absolute right-0 top-2.5 md:top-3.5 z-20 bg-[#F2E8D5] text-[#8A5E12] flex items-center justify-center py-0.5 px-2 md:px-2.5 rounded-l-[5px] md:rounded-l-[8px] shadow-sm">
                <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-sans font-extrabold uppercase tracking-widest leading-none">
                  {item.badge}
                </span>
              </div>

              <div>
                {/* White Product Image Stage Box */}
                <Link
                  to={`/products`}
                  className="relative w-full shrink-0 aspect-[1/1] rounded-[12px] sm:rounded-[14px] overflow-hidden bg-white mb-2 md:mb-3 z-10 shadow-inner border border-gray-100 group/img flex items-center justify-center p-3 block"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 filter drop-shadow-[0_10px_12px_rgba(0,0,0,0.12)]"
                  />
                </Link>

                {/* Brand & Star Rating Row */}
                <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
                  <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 truncate">
                    {item.brand}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#0D3B2A] shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#8A5E12] text-[#8A5E12]" />
                    <span>{item.rating}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">{item.reviews}</span>
                  </div>
                </div>

                {/* Product Title */}
                <Link to={`/products`} className="block px-0.5">
                  <h3 className="text-[13px] sm:text-[15px] font-sans font-bold text-[#0D3B2A] mb-1 leading-snug group-hover:text-[#8A5E12] transition-colors duration-300 line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                    {item.title}
                  </h3>
                </Link>

                {/* Compact Spec Snippet */}
                <p className="text-[11px] text-[#5A6B63] px-0.5 font-sans line-clamp-1 mb-2">
                  {item.specs}
                </p>

                {/* Price Row: Rental or Sale */}
                <div className="flex items-baseline gap-2 px-0.5 mb-3">
                  <span className="text-[15px] sm:text-[18px] font-sans font-bold text-[#8A5E12]">
                    ₹{item.active_price.toLocaleString('en-IN')}
                    {item.price_unit && (
                      <span className="text-[11px] font-normal text-gray-500">{item.price_unit}</span>
                    )}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans text-gray-400 line-through">
                    ₹{item.original_price.toLocaleString('en-IN')}
                  </span>
                  <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-white/60 px-1.5 py-0.5 rounded border border-[#D4A24C]/20">
                    {item.type === 'rent' ? 'Rental' : 'Outright'}
                  </span>
                </div>
              </div>

              {/* Bottom "Add to Cart" Pill Button */}
              <button
                onClick={() => handleAddToCart(item)}
                className="relative overflow-hidden cursor-pointer w-full bg-[#0D3B2A] text-white hover:bg-[#F7EFE0] hover:text-[#0D3B2A] py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5 sm:gap-2 group/btn border border-transparent hover:border-[#D4A24C]/40 transition-all duration-300 active:scale-95"
              >
                <span>Add to Cart</span>
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
