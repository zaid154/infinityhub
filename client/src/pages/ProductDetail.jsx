import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Truck,
  Lock,
  ChevronDown,
  ShoppingBag,
  Zap,
  ArrowRight,
  Minus,
  Plus,
  Repeat,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { APPLE_EASE } from '../animations';
import { getGalleryMedia, getSafeImageUrl } from '../utils/imageHelper';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { openRFQ } = useOutletContext();
  const { addToBuyCart, addToRentalCart, buyCart, rentalCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
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
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full h-[380px] bg-slate-200/70 rounded-3xl animate-pulse" />
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-slate-200/70 rounded-xl animate-pulse" />
              <div className="w-16 h-16 bg-slate-200/70 rounded-xl animate-pulse" />
              <div className="w-16 h-16 bg-slate-200/70 rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-4 bg-slate-200/70 rounded-md w-32 animate-pulse" />
            <div className="h-8 bg-slate-200/70 rounded-md w-full animate-pulse" />
            <div className="h-6 bg-slate-200/70 rounded-md w-48 animate-pulse" />
            <div className="h-20 bg-slate-200/70 rounded-md w-full animate-pulse" />
            <div className="h-12 bg-slate-200/70 rounded-full w-full animate-pulse" />
          </div>
        </div>
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

  // 100% Dynamic Gallery Media (Images & Videos) directly from MongoDB Cloudinary records
  const galleryMedia = getGalleryMedia(product);
  const currentMedia = galleryMedia[selectedImage] || galleryMedia[0];
  const originalPrice = Math.round(product.sale_price * 1.25);
  const discountPercent = 20;

  const maxSale = product.sale_stock !== undefined ? product.sale_stock : product.stock_quantity || 10;
  const maxRental = product.rental_stock !== undefined ? product.rental_stock : 5;

  const inRentalItem = rentalCart?.find((item) => item.product._id === product._id);
  const inBuyItem = buyCart?.find((item) => item.product._id === product._id);

  const handleAddToCart = () => {
    addToBuyCart(product, qty);
  };

  const handleAddRental = () => {
    addToRentalCart(product, qty, '6_months');
  };

  const handleInstantBuy = () => {
    addToBuyCart(product, qty);
    openRFQ(`Instant 1-Click Order: ${qty}x ${product.title} (Est. ₹${(product.sale_price * qty).toLocaleString('en-IN')})`);
  };

  // Concise title formatting like Al-Tooba
  const categoryKicker = product.category === 'laptop'
    ? 'CORPORATE LAPTOPS'
    : product.category === 'monitor'
    ? 'DISPLAYS & MONITORS'
    : product.category === 'gpu'
    ? 'WORKSTATION GRAPHICS'
    : product.category === 'ram'
    ? 'CERTIFIED MEMORY'
    : product.category?.toUpperCase() || 'ENTERPRISE HARDWARE';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-3 sm:pt-4 pb-14">
      
      {/* Al-Tooba Exact 1:1 Product Section Grid (Compact Above-The-Fold Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        
        {/* Left Column: Vertical Thumbnails + Main Rounded Stage (Al-Tooba 1:1 Anatomy) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 items-start">
          
          {/* Vertical Thumbnails Stack (Desktop: vertical flex-col, Mobile: horizontal flex-row) */}
          <div className="flex sm:flex-col gap-2 w-full sm:w-18 md:w-20 shrink-0 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
            {galleryMedia.map((m, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl bg-white p-1.5 flex items-center justify-center transition-all cursor-pointer border-2 shrink-0 relative overflow-hidden ${
                  selectedImage === idx
                    ? 'border-[#0D3B2A] shadow-md ring-2 ring-[#0D3B2A]/20'
                    : 'border-gray-200 hover:border-gray-400 opacity-75 hover:opacity-100'
                }`}
                title={m.type === 'video' ? `Video Clip #${idx + 1}` : `Photo Angle #${idx + 1}`}
              >
                {m.type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-lg text-white">
                    <div className="w-5 h-5 rounded-full bg-[#D4A24C] text-[#0D3B2A] flex items-center justify-center text-[9px] font-bold shadow-xs">
                      ▶
                    </div>
                    <span className="text-[7.5px] font-bold uppercase tracking-wider mt-0.5 text-[#D4A24C]">Video</span>
                  </div>
                ) : (
                  <img
                    src={m.url}
                    alt={`Angle ${idx + 1}`}
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                )}
                {m.type === 'video' && (
                  <span className="absolute top-1 right-1 bg-black/80 text-[#D4A24C] text-[7px] font-bold px-1 rounded">
                    HD
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Large Image / Video Stage Container */}
          <div className="flex-1 w-full h-[320px] sm:h-[380px] lg:h-[410px] bg-[#F4EFE6] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 flex items-center justify-center relative overflow-hidden border border-[#D4A24C]/25 shadow-inner">
            {/* Top-Right Media Count Pill: Video/Photo 1/3 */}
            <div className="absolute top-3.5 right-3.5 bg-black/75 backdrop-blur text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-1.5">
              {currentMedia?.type === 'video' ? (
                <span className="text-[#D4A24C] font-sans font-bold flex items-center gap-1">
                  <span>🎥</span> Video
                </span>
              ) : (
                <span>Photo</span>
              )}
              <span>•</span>
              <span>{selectedImage + 1}/{galleryMedia.length}</span>
            </div>

            {/* Central Hardware Media Item (Interactive Video Player OR Hardware PNG) */}
            {currentMedia?.type === 'video' ? (
              <video
                key={currentMedia.url}
                src={currentMedia.url}
                controls
                autoPlay
                muted
                playsInline
                className="max-h-full max-w-full rounded-2xl object-contain shadow-lg bg-black/10"
              />
            ) : (
              <motion.img
                key={currentMedia?.url}
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease: APPLE_EASE }}
                src={currentMedia?.url}
                alt={product.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.12)] hover:scale-105"
              />
            )}
          </div>

        </div>

        {/* Right Column: Title, Pricing, Trust Grid, Stepper & 1-Click Buy Now */}
        <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
          
          {/* Category Kicker & Availability Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#8A5E12]">
                — {categoryKicker}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.condition === 'brand_new' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 tracking-wider uppercase shadow-xs">
                    ★ Brand New Sealed Box
                  </span>
                )}
                {product.available_for === 'both' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#0D3B2A] border border-[#D4A24C]/40 tracking-wider uppercase flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A24C]" />
                    Buy & Rent Available
                  </span>
                ) : product.available_for === 'rent' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/40 tracking-wider uppercase flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D3B2A]" />
                    Rental Hardware
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#0D3B2A] tracking-wider uppercase border border-[#D4A24C]/40 shadow-xs">
                    Direct Sale Only
                  </span>
                )}
              </div>
            </div>
            
            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-serif text-[#0D3B2A] font-bold tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* In-Cart Status Notification Pill (Dedicated Row) */}
            {(inRentalItem || inBuyItem) && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {inRentalItem && (
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-xs group"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{inRentalItem.quantity} in Rental Cart</span>
                    <span className="text-[11px] font-medium text-emerald-700 underline group-hover:text-emerald-900 ml-1">
                      View Cart &rarr;
                    </span>
                  </Link>
                )}
                {inBuyItem && (
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-xs group"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{inBuyItem.quantity} in Cart</span>
                    <span className="text-[11px] font-medium text-emerald-700 underline group-hover:text-emerald-900 ml-1">
                      View Cart &rarr;
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Price Row: Context-Aware for Rent vs Buy vs Both */}
          <div className="flex items-baseline gap-2.5 flex-wrap">
            {product.available_for === 'rent' ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A]">
                  ₹{product.rental_price_monthly.toLocaleString('en-IN')}<span className="text-sm font-sans text-[#5A6B63]">/month</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#0D3B2A] text-[11px] font-bold uppercase tracking-wider border border-[#D4A24C]/40">
                  Zero CAPEX Rental
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A]">
                  ₹{product.sale_price.toLocaleString('en-IN')}
                </span>
                {originalPrice > product.sale_price && (
                  <>
                    <span className="text-sm sm:text-base font-sans text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFEAEA] text-[#D9383A] text-[11px] font-bold uppercase tracking-wider">
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
                {product.available_for === 'both' && product.rental_price_monthly > 0 && (
                  <span className="text-[11px] font-semibold text-[#8A5E12] bg-[#F2E8D5] px-2.5 py-0.5 rounded-full ml-auto">
                    or Rent ₹{product.rental_price_monthly.toLocaleString('en-IN')}/mo
                  </span>
                )}
              </>
            )}
          </div>

          {/* 2x2 Trust Guarantees Grid */}
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 py-2.5 border-y border-[#D4A24C]/25 text-[11px] sm:text-xs text-[#0D3B2A] font-medium">
            {product.condition === 'brand_new' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>100% Brand New Sealed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>1-Year Official OEM Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>24–48h Insured Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>Original GST Tax Invoice (18% ITC)</span>
                </div>
              </>
            ) : product.available_for === 'rent' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>Corporate Grade A+ Hardware</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>Free On-Site AMC & Diagnostics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>24h Standby Replacement SLA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>100% Tax Deductible OPEX</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>100% Grade A+ Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>6–12 Months Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>24–48h SLA Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#8A5E12] shrink-0" />
                  <span>100% Tax Invoiced (GST)</span>
                </div>
              </>
            )}
          </div>

          {/* Description Excerpt with "READ MORE ∨" Toggle */}
          <div className="space-y-1">
            <p className={`text-xs text-[#5A6B63] leading-relaxed font-sans ${!readMore ? 'line-clamp-2' : ''}`}>
              {product.description || 'Enterprise Grade A+ certified machine sourced from top tier corporate refresh cycles. 30-point diagnostics tested with zero component degradation.'}
            </p>
            <button
              type="button"
              onClick={() => setReadMore(!readMore)}
              className="text-[10px] font-bold uppercase tracking-wider text-[#0D3B2A] hover:text-[#8A5E12] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{readMore ? 'READ LESS' : 'READ MORE'}</span>
              <ChevronDown className={`w-3 h-3 transform transition-transform ${readMore ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Live Segregated Stock Transparency */}
          <div className="flex items-center gap-3 text-xs bg-[#FAF7F2] p-2.5 rounded-xl border border-[#D4A24C]/25 font-mono">
            <span className="text-[#0D3B2A] font-bold">
              Direct Buy Stock: <strong>{maxSale} Units</strong>
            </span>
            {product.rental_price_monthly > 0 && (
              <>
                <span className="text-[#D4A24C]">•</span>
                <span className="text-[#8A5E12] font-bold">
                  Rental Stock: <strong>{maxRental} Units</strong>
                </span>
              </>
            )}
          </div>

          {/* Action Buttons: Context-Aware for Rent vs Buy vs Both */}
          {product.available_for === 'rent' ? (
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={(e) => handleAddRental(e)}
                className="w-full py-3 sm:py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 active:scale-95 group"
              >
                <Repeat className="w-4 h-4 text-[#D4A24C]" />
                <span>RENT THIS MODEL (ADD TO RENTAL CART)</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D3B2A] shrink-0 font-sans">
                  QUANTITY:
                </span>
                
                {/* Stepper Pill [ -  1  + ] clamped to maxSale */}
                <div className="inline-flex items-center justify-between rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-mono font-bold text-[#0D3B2A] w-24 shadow-sm">
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
                    disabled={qty >= maxSale}
                    onClick={() => {
                      if (qty < maxSale) {
                        setQty(qty + 1);
                      } else {
                        toast.error(`Maximum available direct stock is ${maxSale} units.`);
                      }
                    }}
                    className="p-1 text-gray-500 hover:text-[#0D3B2A] hover:bg-gray-100 disabled:opacity-30 rounded-full transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* ADD TO CART (BUY) Pill Button */}
                <button
                  type="button"
                  disabled={maxSale <= 0}
                  onClick={(e) => handleAddToCart(e)}
                  className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 rounded-full border-2 border-[#0D3B2A] bg-transparent text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed font-sans font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <span>
                    {maxSale > 0
                      ? inBuyItem
                        ? `ADD MORE (HAVE ${inBuyItem.quantity} IN CART)`
                        : 'ADD TO CART (BUY)'
                      : 'SALE STOCK OUT'}
                  </span>
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* If product has rental option (both), show RENT FLEET button */}
              {product.available_for === 'both' && product.rental_price_monthly > 0 && (
                <button
                  type="button"
                  disabled={maxRental <= 0}
                  onClick={(e) => handleAddRental(e)}
                  className="w-full py-2.5 sm:py-3 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/40 disabled:opacity-50 disabled:cursor-not-allowed font-sans font-bold text-xs uppercase tracking-[0.15em] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Repeat className="w-4 h-4 text-[#D4A24C]" />
                  <span>
                    {maxRental > 0
                      ? inRentalItem
                        ? `ADD MORE TO RENTAL (HAVE ${inRentalItem.quantity} IN CART)`
                        : `RENT THIS MODEL (₹${product.rental_price_monthly.toLocaleString('en-IN')}/mo)`
                      : 'RENTAL POOL CURRENTLY OUT OF STOCK'}
                  </span>
                </button>
              )}

              {/* Main Full-Width Instant 1-Click Buy Now Pill Button */}
              <button
                type="button"
                disabled={maxSale <= 0}
                onClick={(e) => handleInstantBuy(e)}
                className="w-full py-3 sm:py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white disabled:opacity-40 disabled:cursor-not-allowed font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 active:scale-95 group"
              >
                <Zap className="w-4 h-4 text-[#D4A24C] fill-[#D4A24C]" />
                <span>{maxSale > 0 ? 'INSTANT 1-CLICK BUY NOW' : 'OUT OF PURCHASE STOCK'}</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Technical Specifications Accordion / Box */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="pt-2 border-t border-[#D4A24C]/20">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#0D3B2A] font-sans mb-1.5">
                TECHNICAL SPECIFICATIONS
              </h3>
              <div className="bg-white rounded-xl border border-[#D4A24C]/25 p-3 text-[11px] space-y-1.5">
                {Object.entries(product.specs).map(([k, v]) => {
                  if (!v) return null;
                  return (
                    <div key={k} className="flex justify-between border-b border-[#D4A24C]/10 pb-1 last:border-none">
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
              EXPLORE CERTIFIED HARDWARE CATALOG
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
                        src={getSafeImageUrl(item)}
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
