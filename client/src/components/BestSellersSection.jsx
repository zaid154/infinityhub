import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const BEST_SELLER_LAPTOPS = [
  {
    _id: 'best-1',
    title: 'Lenovo ThinkPad T490 Enterprise',
    brand: 'THINKPAD',
    category: 'laptop',
    specs: 'Core i5 8th Gen • 16GB RAM • 512GB NVMe',
    rental_price: 1450,
    original_rental: 2200,
    rating: '5.0',
    reviews: 48,
    image: '/products/real-thinkpad-t14-transparent.png',
    inStock: true,
    slug: 'lenovo-thinkpad-t490-enterprise-business-laptop'
  },
  {
    _id: 'best-2',
    title: 'Dell Latitude 7490 Ultrabook',
    brand: 'DELL ENTERPRISE',
    category: 'laptop',
    specs: 'Core i7 8th Gen • 16GB RAM • 512GB SSD',
    rental_price: 1650,
    original_rental: 2400,
    rating: '4.9',
    reviews: 36,
    image: '/products/real-dell-latitude-transparent.png',
    inStock: true,
    slug: 'dell-latitude-7490-ultrabook-corporate-edition'
  },
  {
    _id: 'best-3',
    title: 'HP EliteBook 840 G6 Aluminum',
    brand: 'HP EXECUTIVE',
    category: 'laptop',
    specs: 'Core i5 8th Gen • 16GB RAM • 256GB NVMe',
    rental_price: 1500,
    original_rental: 2150,
    rating: '4.9',
    reviews: 29,
    image: '/products/real-dell-latitude-transparent.png',
    inStock: true,
    slug: 'hp-elitebook-840-g6-aluminum-executive-series'
  },
  {
    _id: 'best-4',
    title: 'Precision 5540 Mobile Workstation',
    brand: 'DELL PRECISION',
    category: 'laptop',
    specs: 'Core i7 • 32GB RAM • NVIDIA Quadro T2000',
    rental_price: 3200,
    original_rental: 4500,
    rating: '5.0',
    reviews: 19,
    image: '/products/real-mobile-workstation-transparent.png',
    inStock: false, // Out of stock indicator like Kalonji Shampoo on Al-Tooba
    slug: 'dell-precision-5540-workstation'
  },
  {
    _id: 'best-5',
    title: 'Dell UltraSharp 24" Frameless IPS',
    brand: 'DELL DISPLAYS',
    category: 'monitor',
    specs: 'Full HD 1080p • 99% sRGB • Height Pivot Stand',
    rental_price: 450,
    original_rental: 750,
    rating: '4.9',
    reviews: 52,
    image: '/products/real-dell-display-transparent.png',
    inStock: true,
    slug: 'dell-professional-p2419h-24-inch-ips-frameless-display'
  }
];

export default function BestSellersSection({ onOpenRFQ }) {
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    if (!item.inStock) {
      toast.error(`${item.title} is currently fully leased. Request next batch dispatch!`);
      onOpenRFQ?.(`Waitlist Request: ${item.title}`);
      return;
    }

    addToCart(
      {
        _id: item._id,
        title: item.title,
        sale_price: item.rental_price * 12,
        rental_price_monthly: item.rental_price,
        images: [{ url: item.image }],
        category: item.category
      },
      1
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 select-none">
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

      {/* 5 Best Seller Product Cards - Exact Al-Tooba Anatomy */}
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar">
        {BEST_SELLER_LAPTOPS.map((item) => (
          <div
            key={item._id}
            className="group bg-[#FAF7F2] rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-3 flex flex-col justify-between h-full border border-[#D4A24C]/15 hover:border-[#D4A24C]/40 shadow-[0_8px_30px_rgba(13,59,42,0.03)] hover:shadow-[0_20px_40px_rgba(13,59,42,0.1)] transition-all duration-500 relative overflow-hidden min-w-[240px] sm:min-w-[260px] lg:min-w-0 snap-center"
          >
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

              {/* Price Row: Monthly Lease + Strikethrough */}
              <div className="flex items-baseline gap-2 px-0.5 mb-3">
                <span className="text-[15px] sm:text-[18px] font-sans font-bold text-[#8A5E12]">
                  ₹{item.rental_price.toLocaleString('en-IN')}
                  <span className="text-[11px] font-normal text-gray-500">/mo</span>
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-gray-400 line-through">
                  ₹{item.original_rental.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Bottom Button - Al-Tooba Exact Pill Style */}
            {item.inStock ? (
              <button
                onClick={() => handleAddToCart(item)}
                className="relative overflow-hidden cursor-pointer w-full bg-[#0D3B2A] text-white hover:bg-[#F7EFE0] hover:text-[#0D3B2A] py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5 sm:gap-2 group/btn border border-transparent hover:border-[#D4A24C]/40 transition-all duration-300 active:scale-95"
              >
                <span>Add to Cart</span>
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full bg-[#708A7C]/30 text-[#0D3B2A] py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:bg-[#708A7C]/50 transition-colors"
              >
                <span>OUT OF STOCK</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
