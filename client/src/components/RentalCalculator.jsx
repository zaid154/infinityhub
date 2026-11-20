import React, { useState, useEffect, useMemo } from 'react';
import { 
  Laptop, 
  Monitor, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ShoppingBag, 
  FileText, 
  Percent, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getSafeImageUrl } from '../utils/imageHelper';
import toast from 'react-hot-toast';

const TENURE_OPTIONS = [
  { id: '3m', label: '3 Months', tenureKey: '3_months', discountPercent: 0, tag: 'Standard' },
  { id: '6m', label: '6 Months', tenureKey: '6_months', discountPercent: 5, tag: 'Save 5%' },
  { id: '12m', label: '12+ Months', tenureKey: '12_months', discountPercent: 15, tag: 'Save 15%' }
];

const PRESETS = [5, 10, 25, 50, 100];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Leasable Fleets', icon: Layers },
  { id: 'laptop', label: 'Enterprise Laptops', icon: Laptop },
  { id: 'monitor', label: 'Business Displays', icon: Monitor },
  { id: 'gpu', label: 'Workstation GPUs', icon: Cpu }
];

export default function RentalCalculator({ onOpenRFQ, rentalProducts, hideHeader = false }) {
  const { addToRentalCart } = useCart();
  const [liveProducts, setLiveProducts] = useState(rentalProducts || []);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [tenure, setTenure] = useState(TENURE_OPTIONS[1]); // default: 6 months
  const [includeGst, setIncludeGst] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch live rental inventory from MongoDB API
  useEffect(() => {
    if (rentalProducts && rentalProducts.length > 0) {
      setLiveProducts(rentalProducts);
      return;
    }

    const fetchLiveInventory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', {
          params: { available_for: 'rent', limit: 30 }
        });
        if (res.data?.success && Array.isArray(res.data.products)) {
          // Filter products with active rental rates
          const availableRentals = res.data.products.filter(
            (p) => (p.rental_price_monthly > 0 || p.available_for === 'rent' || p.available_for === 'both')
          );
          setLiveProducts(availableRentals);
        }
      } catch (err) {
        console.warn('[RentalCalculator] Live inventory fetch Notice:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveInventory();
  }, [rentalProducts]);

  // Filter products by selected category tab
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return liveProducts;
    return liveProducts.filter((p) => p.category === activeCategory);
  }, [liveProducts, activeCategory]);

  // Selected Product (Fall back gracefully to first available product)
  const currentProduct = useMemo(() => {
    if (selectedProductId) {
      const found = filteredProducts.find((p) => p._id === selectedProductId);
      if (found) return found;
      const anyMatch = liveProducts.find((p) => p._id === selectedProductId);
      if (anyMatch) return anyMatch;
    }
    return filteredProducts[0] || liveProducts[0] || null;
  }, [filteredProducts, liveProducts, selectedProductId]);

  // Auto-select first item when category tab changes
  useEffect(() => {
    if (filteredProducts.length > 0 && (!selectedProductId || !filteredProducts.some(p => p._id === selectedProductId))) {
      setSelectedProductId(filteredProducts[0]._id);
    }
  }, [activeCategory, filteredProducts, selectedProductId]);

  // Unit Label based on category
  const unitLabel = useMemo(() => {
    if (!currentProduct) return 'Units';
    if (currentProduct.category === 'laptop') return 'Laptops';
    if (currentProduct.category === 'monitor') return 'Displays';
    if (currentProduct.category === 'gpu') return 'GPUs';
    return 'Units';
  }, [currentProduct]);

  // Extract Category-Appropriate Subtitle Specs (Zero Hallucinated OS on Monitors/GPUs)
  const getProductSpecsSnippet = (p) => {
    if (!p) return 'Certified Grade A+ Enterprise Hardware';
    if (p.category === 'laptop') {
      return [p.specs?.processor, p.specs?.ram, p.specs?.storage].filter(Boolean).join(' • ') || 'Intel Core • 16GB RAM • SSD';
    }
    if (p.category === 'monitor') {
      return [p.specs?.screen_size, p.specs?.resolution, p.specs?.panel_type].filter(Boolean).join(' • ') || 'Full HD IPS Display';
    }
    if (p.category === 'gpu') {
      return [p.specs?.vram, p.specs?.cuda_cores, p.specs?.form_factor].filter(Boolean).join(' • ') || 'GDDR6 Workstation Graphics';
    }
    return [p.specs?.ram, p.specs?.speed, p.specs?.form_factor].filter(Boolean).join(' • ') || 'Enterprise Hardware Component';
  };

  // Pricing Calculations
  const baseRate = currentProduct?.rental_price_monthly || 1450;
  
  // Tenure Commitment Discount
  const tenureDiscountAmount = Math.round(baseRate * (tenure.discountPercent / 100));
  const rateAfterTenure = baseRate - tenureDiscountAmount;

  // Fleet Volume Tier Rebate (Additional rebate for large B2B deployments)
  const volumeDiscountPercent = quantity >= 50 ? 10 : quantity >= 25 ? 5 : 0;
  const volumeDiscountAmount = Math.round(rateAfterTenure * (volumeDiscountPercent / 100));
  
  // Final Net Unit Rate per month
  const netUnitRate = rateAfterTenure - volumeDiscountAmount;

  // Monthly Subtotals
  const totalBaseMonthly = baseRate * quantity;
  const totalMonthlySavings = (baseRate - netUnitRate) * quantity;
  const netMonthlyTaxable = netUnitRate * quantity;
  const gstRate = 0.18;
  const monthlyGst = Math.round(netMonthlyTaxable * gstRate);
  const grandMonthlyTotal = includeGst ? netMonthlyTaxable + monthlyGst : netMonthlyTaxable;

  // Handlers
  const handleAddToCart = () => {
    if (!currentProduct) {
      toast.error('Please select a hardware model from the inventory.');
      return;
    }
    addToRentalCart(currentProduct, quantity, tenure.tenureKey);
    toast.success(`${quantity}x ${currentProduct.title} (${tenure.label}) added to Corporate Cart!`);
  };

  const handleRequestRFQ = () => {
    if (!currentProduct) return;
    const rfqContext = `Corporate Lease Quotation: ${quantity}x ${currentProduct.title} (${tenure.label}) @ ₹${netMonthlyTaxable.toLocaleString('en-IN')}/mo (Net OPEX)`;
    onOpenRFQ?.(rfqContext);
  };

  return (
    <section id="rental-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Executive Card Container - Fully harmonious with site theme */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#D4A24C]/40 p-5 sm:p-7 lg:p-9 shadow-md relative overflow-hidden">
        
        {/* Subtle Decorative Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A24C]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 pb-5 border-b border-[#0D3B2A]/10">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#8A5E12] font-mono font-bold block mb-1">
                — TRANSPARENT B2B LEASING & FLEET SIZING
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0D3B2A] font-bold tracking-tight">
                Corporate Rental & Lease Estimator
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#5A6B63] font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0D3B2A]" /> 24–48h Standby SLA
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#8A5E12]" /> 100% GSTR-2B Credit
              </span>
            </div>
          </div>
        )}

        {/* Category Filter Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0D3B2A] text-[#FAF7F2] shadow-sm'
                    : 'bg-white border border-[#0D3B2A]/10 text-[#5A6B63] hover:border-[#0D3B2A]/30 hover:text-[#0D3B2A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4A24C]' : 'text-[#5A6B63]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Responsive Estimator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Interactive Fleet Controls (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Hardware Selection Grid (Pure Database Feed) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D3B2A] font-mono">
                  1. Select Hardware Fleet
                </label>
                {currentProduct && (
                  <span className="text-xs text-[#8A5E12] font-semibold truncate max-w-[240px]">
                    {currentProduct.brand} • {currentProduct.category}
                  </span>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-dashed border-[#0D3B2A]/20 text-center text-xs text-[#5A6B63]">
                  No rental machines currently listed in this category.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                  {filteredProducts.map((product) => {
                    const isSelected = currentProduct?._id === product._id;
                    const imageUrl = getSafeImageUrl(product);
                    const specsSnippet = getProductSpecsSnippet(product);

                    return (
                      <div
                        key={product._id}
                        onClick={() => setSelectedProductId(product._id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-[#0D3B2A] ring-2 ring-[#0D3B2A]/20 shadow-sm'
                            : 'bg-white/80 border-[#0D3B2A]/15 hover:border-[#0D3B2A]/40 hover:bg-white'
                        }`}
                      >
                        {/* Selected Tag */}
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#0D3B2A]" />
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="w-12 h-12 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100 shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0 pr-4">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A5E12] block">
                              {product.brand}
                            </span>
                            <h4 className="font-bold text-xs text-[#0D3B2A] leading-snug line-clamp-2">
                              {product.title}
                            </h4>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <p className="text-[10px] text-[#5A6B63] truncate max-w-[140px]" title={specsSnippet}>
                            {specsSnippet}
                          </p>
                          <span className="font-mono font-bold text-[#0D3B2A] text-xs shrink-0">
                            ₹{(product.rental_price_monthly || 0).toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Fleet Size / Quantity Slider */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#0D3B2A]/15 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D3B2A] font-mono">
                  2. Required Fleet Volume
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs font-bold font-mono">
                    {quantity} {unitLabel}
                  </span>
                  {volumeDiscountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-bold">
                      +{volumeDiscountPercent}% Bulk Rebate
                    </span>
                  )}
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0D3B2A]"
              />

              {/* Quick Presets */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span className="text-[10.5px] text-[#5A6B63] font-semibold">Common Fleet Sizes:</span>
                <div className="flex items-center gap-1.5">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setQuantity(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        quantity === p
                          ? 'bg-[#0D3B2A] text-[#FAF7F2]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Lease Duration Commitment Tabs */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#0D3B2A]/15 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D3B2A] font-mono">
                  3. Lease Tenure Commitment
                </label>
                {tenure.discountPercent > 0 && (
                  <span className="text-xs font-semibold text-[#8A5E12] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#D4A24C]" /> {tenure.discountPercent}% Long-Term Commitment Rebate
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {TENURE_OPTIONS.map((opt) => {
                  const isSelected = tenure.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTenure(opt)}
                      className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0D3B2A] border-[#0D3B2A] text-[#FAF7F2] shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm">{opt.label}</div>
                      <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? 'text-[#D4A24C]' : 'text-slate-500'}`}>
                        {opt.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Signature Executive Lease Summary Card (Span 5) */}
          <div className="lg:col-span-5 bg-[#0D3B2A] rounded-3xl p-5 sm:p-6 text-[#FAF7F2] shadow-xl border border-[#D4A24C]/30 flex flex-col justify-between">
            
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4A24C] font-bold">
                  COMMERCIAL LEASE SUMMARY
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% OPEX Deductible
                </span>
              </div>

              {/* Big Price Display */}
              <div className="my-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F2] tracking-tight">
                    ₹{grandMonthlyTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-300 font-sans">
                    {includeGst ? '/mo (GST Included)' : '/mo + 18% GST'}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1 pt-1 text-xs">
                  <span className="text-slate-300">
                    Effective Unit Rate: <strong className="text-[#D4A24C] font-mono">₹{netUnitRate.toLocaleString('en-IN')} / {unitLabel.slice(0, -1).toLowerCase() || 'unit'} / mo</strong>
                  </span>
                  {totalMonthlySavings > 0 && (
                    <span className="text-emerald-400 font-semibold text-[11px]">
                      Saves ₹{totalMonthlySavings.toLocaleString('en-IN')}/mo
                    </span>
                  )}
                </div>
              </div>

              {/* GST Toggle Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/25 border border-white/10 text-xs mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-200">Include 18% GST in Display</span>
                  <span className="text-[10px] text-slate-400">(Claim 100% GSTR-2B ITC)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeGst(!includeGst)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    includeGst ? 'bg-[#D4A24C]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      includeGst ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Line Items Breakdown */}
              <div className="space-y-2 text-xs border-t border-white/10 pt-3.5 text-slate-300">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-slate-400 shrink-0">Selected Fleet:</span>
                  <span className="text-right text-[#FAF7F2] font-semibold truncate max-w-[220px]">
                    {currentProduct?.title || 'Enterprise Hardware Fleet'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Fleet Deployment:</span>
                  <span className="text-[#FAF7F2] font-semibold font-mono">
                    {quantity} {unitLabel}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Lease Commitment:</span>
                  <span className="text-[#FAF7F2] font-semibold">
                    {tenure.label} {tenure.discountPercent > 0 ? `(${tenure.discountPercent}% off)` : ''}
                  </span>
                </div>

                {volumeDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Volume Fleet Rebate:</span>
                    <span className="font-mono">-{volumeDiscountPercent}%</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Standby SLA Warranty:</span>
                  <span className="text-emerald-400 font-medium">Guaranteed 24–48h Swap</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Security Deposit:</span>
                  <span className="text-[#D4A24C] font-medium">₹0 (Zero Collateral PO)</span>
                </div>

                {includeGst && (
                  <div className="flex justify-between text-[#D4A24C] pt-1 border-t border-white/5">
                    <span>Monthly GST (18% ITC):</span>
                    <span className="font-mono">+₹{monthlyGst.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Procurement Action CTA Buttons */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 rounded-xl bg-[#D4A24C] hover:bg-[#c5943b] text-[#0D3B2A] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Fleet Lease to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleRequestRFQ}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF7F2] font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#D4A24C]" />
                <span>Request Custom Procurement RFQ</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
