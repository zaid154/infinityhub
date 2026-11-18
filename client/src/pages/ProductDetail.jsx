import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Truck,
  Lock,
  ArrowLeft,
  ChevronDown,
  ShoppingBag,
  Zap,
  ArrowRight,
  Minus,
  Plus,
  Star
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { openRFQ } = useOutletContext();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelated(res.data.related || []);
          setSelectedImage(0);
          setQty(1);
          setReadMore(false);
        }
      } catch (err) {
        console.error('[Product Detail Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-[#0D3B2A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#0D3B2A]">Product Not Found</h2>
        <Link
          to="/products"
          className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#153423] transition"
        >
          Return to Inventory
        </Link>
      </div>
    );
  }

  // Build authentic 3-image gallery like Al-Tooba (1/3)
  const baseImg = product.images?.[0]?.url && !product.images[0].url.includes('photo-1544717305-2782549b5136')
    ? product.images[0].url
    : '/products/real-thinkpad-t14-transparent.png';

  const getGalleryImages = () => {
    if (product.images && product.images.length >= 3) {
      return product.images.map((img) => img.url);
    }
    if (product.category === 'monitor') {
      return [
        baseImg,
        '/products/real-dell-display-transparent.png',
        '/products/dell-ultrasharp-display.png'
      ];
    }
    if (product.category === 'ram') {
      return [
        baseImg,
        '/products/real-enterprise-ram-transparent.png',
        '/products/commercial-elite.png'
      ];
    }
    if (product.category === 'desktop') {
      return [
        baseImg,
        '/products/real-optiplex-pc-transparent.png',
        '/products/real-optiplex-pc.png'
      ];
    }
    // Default corporate laptop angles
    return [
      baseImg,
      '/products/real-thinkpad-t14-transparent.png',
      '/products/real-dell-latitude-transparent.png'
    ];
  };

  const galleryImages = getGalleryImages();
  const originalPrice = Math.round(product.sale_price * 1.25);
  const discountPercent = 20;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.title} added to quotation cart!`);
  };

  const handleInstantBuy = () => {
    addToCart(product, qty);
    openRFQ(`Instant 1-Click Order: ${qty}x ${product.title} (Est. ₹${(product.sale_price * qty).toLocaleString('en-IN')})`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 select-none">
      {/* Top Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5A6B63] hover:text-[#0D3B2A] transition"
      >
        <ArrowLeft className="w-4 h-4 text-[#8A5E12]" />
        <span>Back to Hardware Catalog</span>
      </Link>

      {/* Main Al-Tooba 1:1 Product Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Vertical Thumbnails + Main Rounded Stage (Al-Tooba 1:1 Anatomy) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start">
          
          {/* Vertical Thumbnails Stack (Desktop: vertical flex-col, Mobile: horizontal flex-row) */}
          <div className="flex sm:flex-col gap-3 w-full sm:w-24 shrink-0 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2.5 flex items-center justify-center transition-all cursor-pointer border-2 shrink-0 ${
                  selectedImage === idx
                    ? 'border-[#0D3B2A] shadow-md ring-2 ring-[#0D3B2A]/20'
                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </button>
            ))}
          </div>

          {/* Main Large Image Stage Container (Rounded Linen/Warm Stage like Al-Tooba) */}
          <div className="flex-1 w-full h-[380px] sm:h-[460px] md:h-[500px] bg-[#F4EFE6] rounded-3xl p-6 sm:p-10 flex items-center justify-center relative overflow-hidden border border-[#D4A24C]/25 shadow-inner">
            {/* Top-Right Image Count Pill: 1/3 */}
            <div className="absolute top-4 right-4 bg-black/75 backdrop-blur text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full z-10 shadow-sm">
              {selectedImage + 1}/{galleryImages.length}
            </div>

            {/* Central Hardware Image */}
            <img
              src={galleryImages[selectedImage]}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-all duration-300 filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)] hover:scale-105"
            />
          </div>

        </div>

        {/* Right Column: Details, Pricing, Trust Grid, Stepper & 1-Click Buy Now */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Category Kicker */}
          <div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#8A5E12] block mb-1.5">
              — {product.category === 'laptop' ? 'CORPORATE LAPTOPS' : product.category === 'monitor' ? 'DISPLAYS & MONITORS' : product.category === 'ram' ? 'CERTIFIED MEMORY' : product.category?.toUpperCase() || 'ENTERPRISE HARDWARE'}
            </span>
            
            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#0D3B2A] font-bold tracking-tight leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Price Row: Main Price + Strikethrough + SAVE 20% Badge (Exact Al-Tooba Anatomy) */}
          <div className="flex items-baseline gap-3 flex-wrap pt-1">
            <span className="text-3xl sm:text-4xl font-bold font-serif text-[#0D3B2A]">
              ₹{product.sale_price.toLocaleString('en-IN')}
            </span>
            <span className="text-base sm:text-lg font-sans text-gray-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFEAEA] text-[#D9383A] text-xs font-bold uppercase tracking-wider">
              SAVE {discountPercent}%
            </span>
            {product.rental_price_monthly > 0 && (
              <span className="text-xs font-semibold text-[#8A5E12] bg-[#F2E8D5] px-2.5 py-1 rounded-full ml-auto">
                or Lease ₹{product.rental_price_monthly.toLocaleString('en-IN')}/mo
              </span>
            )}
          </div>

          {/* 2x2 Trust Guarantees Grid (Exact Al-Tooba Layout) */}
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 py-4 border-y border-[#D4A24C]/25 text-xs sm:text-[13px] text-[#0D3B2A] font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8A5E12] shrink-0" />
              <span>100% Grade A+ Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#8A5E12] shrink-0" />
              <span>6–12 Months Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8A5E12] shrink-0" />
              <span>24–48h SLA Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8A5E12] shrink-0" />
              <span>100% Tax Invoiced (GST)</span>
            </div>
          </div>

          {/* Description Excerpt with "READ MORE ∨" Toggle */}
          <div className="space-y-1.5 pt-1">
            <p className={`text-xs sm:text-sm text-[#5A6B63] leading-relaxed font-sans ${!readMore ? 'line-clamp-2' : ''}`}>
              {product.description || 'Enterprise Grade A+ certified machine sourced from top tier corporate refresh cycles. 30-point diagnostics tested with zero component degradation.'}
            </p>
            <button
              type="button"
              onClick={() => setReadMore(!readMore)}
              className="text-[11px] font-bold uppercase tracking-wider text-[#0D3B2A] hover:text-[#8A5E12] flex items-center gap-1 transition-colors cursor-pointer pt-1"
            >
              <span>{readMore ? 'READ LESS' : 'READ MORE'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${readMore ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Quantity Stepper & "ADD TO CART" Pill Button Row */}
          <div className="flex items-center gap-3 sm:gap-4 pt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D3B2A] shrink-0 font-sans">
              QUANTITY:
            </span>
            
            {/* Stepper Pill [ -  1  + ] */}
            <div className="inline-flex items-center justify-between rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-[#0D3B2A] w-28 shadow-sm">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-1 text-gray-500 hover:text-[#0D3B2A] hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="p-1 text-gray-500 hover:text-[#0D3B2A] hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* ADD TO CART Pill Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-2.5 sm:py-3 px-5 sm:px-6 rounded-full border-2 border-[#0D3B2A] bg-transparent text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <span>ADD TO CART</span>
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Full-Width Instant 1-Click Buy Now Pill Button (Exact Al-Tooba Anatomy) */}
          <button
            type="button"
            onClick={handleInstantBuy}
            className="w-full py-3.5 sm:py-4 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:brightness-105 active:scale-95 group"
          >
            <Zap className="w-4 h-4 text-[#D4A24C] fill-[#D4A24C]" />
            <span>INSTANT 1-CLICK BUY NOW</span>
            <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Technical Specifications Box */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="pt-4 border-t border-[#D4A24C]/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D3B2A] font-sans mb-3">
                TECHNICAL SPECIFICATIONS
              </h3>
              <div className="bg-white rounded-2xl border border-[#D4A24C]/25 p-4 text-xs space-y-2">
                {Object.entries(product.specs).map(([k, v]) => {
                  if (!v) return null;
                  return (
                    <div key={k} className="flex justify-between border-b border-[#D4A24C]/10 pb-1.5 last:border-none">
                      <span className="font-semibold text-[#5A6B63] capitalize">
                        {k.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold text-[#0D3B2A] text-right font-mono">{v}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Similar Recommended Hardware (Matching Al-Tooba 5-card layout) */}
      {related.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-[#D4A24C]/20">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#0D3B2A] font-bold">
              Similar Recommended Hardware
            </h2>
            <p className="text-[#8A5E12] font-sans font-bold tracking-[0.2em] uppercase text-xs mt-1">
              EXPLORE CERTIFIED ENTERPRISE FLEETS
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <div
                key={item._id}
                className="bg-[#FAF7F2] rounded-2xl p-3 border border-[#D4A24C]/20 hover:border-[#D4A24C]/50 shadow-sm transition flex flex-col justify-between group"
              >
                <div>
                  <Link to={`/products/${item.slug}`} className="block">
                    <div className="h-36 bg-white rounded-xl p-3 mb-3 flex items-center justify-center border border-gray-100 overflow-hidden">
                      <img
                        src={item.images?.[0]?.url || '/products/real-thinkpad-t14-transparent.png'}
                        alt={item.title}
                        className="h-full object-contain group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  </Link>

                  <div className="px-1">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 block mb-1">
                      {item.brand || 'ENTERPRISE'}
                    </span>
                    <Link to={`/products/${item.slug}`} className="hover:text-[#8A5E12] transition block">
                      <h4 className="text-xs font-bold text-[#0D3B2A] line-clamp-1 font-serif">{item.title}</h4>
                    </Link>
                    <p className="text-sm font-bold text-[#8A5E12] mt-1 font-serif">
                      ₹{item.sale_price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/products/${item.slug}`}
                  className="mt-3 w-full py-2 rounded-xl bg-[#0D3B2A] text-white hover:bg-[#153423] text-xs font-bold transition text-center uppercase tracking-wider block"
                >
                  View Machine
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
