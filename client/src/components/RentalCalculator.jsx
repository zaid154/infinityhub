import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Cpu, 
  Server, 
  CheckCircle2, 
  FileDown, 
  ShoppingBag, 
  Percent 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getSafeImageUrl } from '../utils/imageHelper';
import toast from 'react-hot-toast';

const DURATIONS = [
  { id: '3m', label: '3 Months', multiplier: 1.0, discount: 0 },
  { id: '6m', label: '6 Months', multiplier: 0.95, discount: 5 },
  { id: '12m', label: '12+ Months', multiplier: 0.85, discount: 15 }
];

const PRESETS = [5, 15, 30, 50, 100];

export default function RentalCalculator({ onOpenRFQ, rentalProducts }) {
  const { addToRentalCart } = useCart();
  const [liveProducts, setLiveProducts] = useState(rentalProducts || []);
  const [selectedTierId, setSelectedTierId] = useState(null);
  const [quantity, setQuantity] = useState(15);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [includeGst, setIncludeGst] = useState(false);

  // Fetch live rental machines from MongoDB if not provided via props
  useEffect(() => {
    if (rentalProducts && rentalProducts.length > 0) {
      setLiveProducts(rentalProducts);
      return;
    }

    const fetchLiveRentalTiers = async () => {
      try {
        const res = await api.get('/products', {
          params: { available_for: 'rent', limit: 8 }
        });
        if (res.data.success && res.data.products?.length > 0) {
          setLiveProducts(res.data.products);
        }
      } catch (err) {
        console.error('[RentalCalculator] Live hardware fetch notice:', err);
      }
    };

    fetchLiveRentalTiers();
  }, [rentalProducts]);

  // Dynamically map MongoDB products to calculator tiers
  const dynamicTiers = liveProducts
    .filter((p) => p.rental_price_monthly > 0 || p.available_for === 'rent' || p.available_for === 'both')
    .slice(0, 4)
    .map((p, idx) => {
      const genericSpecs = p.specs && typeof p.specs === 'object' ? Object.values(p.specs).filter(v => typeof v === 'string' && v.trim()).slice(0, 3).join(' • ') : '';
      const subtitle = [p.specs?.processor, p.specs?.ram, p.specs?.storage].filter(Boolean).join(' • ') ||
        genericSpecs ||
        (p.description ? p.description.slice(0, 45) : 'Enterprise Grade A+ Hardware');

      return {
        _id: p._id,
        id: p._id,
        name: p.title,
        subtitle,
        price: p.rental_price_monthly || 1350,
        icon: idx === 1 ? Cpu : idx === 2 ? Server : Laptop,
        product: p,
        image: getSafeImageUrl(p)
      };
    });

  const tiers = dynamicTiers.length > 0
    ? dynamicTiers
    : [
        {
          id: 'tier-default-1',
          name: 'Enterprise Commercial Fleet',
          subtitle: 'Intel Core i5 • 16GB RAM • 512GB SSD',
          price: 1350,
          icon: Laptop
        }
      ];

  const selectedTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];

  // Volume discount logic
  const volumeDiscountPercent = quantity >= 50 ? 10 : quantity >= 25 ? 5 : 0;
  const combinedMultiplier = duration.multiplier * (1 - volumeDiscountPercent / 100);

  const unitRate = Math.round(selectedTier.price * combinedMultiplier);
  const subtotal = unitRate * quantity;
  const gstAmount = Math.round(subtotal * 0.18);
  const finalTotal = includeGst ? subtotal + gstAmount : subtotal;

  const handleRequestQuote = () => {
    const summary = `${quantity}x ${selectedTier.name} (${duration.label}) @ ₹${finalTotal.toLocaleString('en-IN')}/mo`;
    onOpenRFQ?.(`Rental Fleet Quote: ${summary}`);
  };

  const handleAddToCart = (e) => {
    const tenureKey = duration.id === '3m' ? '3_months' : duration.id === '12m' ? '12_months' : '6_months';

    if (selectedTier.product) {
      // Pass the genuine MongoDB product record to Cart Context
      addToRentalCart(selectedTier.product, quantity, tenureKey);
    } else {
      addToRentalCart(
        {
          _id: selectedTier._id || `fleet-lease-${Date.now()}`,
          title: `${quantity}x ${selectedTier.name} Corporate Lease (${duration.label})`,
          rental_price_monthly: finalTotal,
          rental_stock: 999,
          images: [{ url: selectedTier.image }],
          category: 'laptop'
        },
        1,
        tenureKey
      );
    }
    toast.success(`${quantity}x ${selectedTier.name} fleet lease added to Corporate Rental Cart!`);
  };

  return (
    <section id="rental-calculator" className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-[#072117] rounded-2xl sm:rounded-3xl border border-[#D4A24C]/30 shadow-2xl p-4 sm:p-5 lg:p-6 relative overflow-hidden">
        
        {/* Subtle Ambient Accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#D4A24C]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Compact Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-4 pb-3.5 border-b border-[#FAF7F2]/10">
          <div>
            <span className="text-[9.5px] sm:text-[10px] uppercase tracking-[0.22em] text-[#D4A24C] font-semibold block">
              Flexible Enterprise Fleet Leasing
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#FAF7F2] font-bold tracking-tight mt-0.5">
              Corporate Rental Estimator
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-[#90b09a] sm:text-right max-w-xs leading-snug">
            Zero CAPEX • 24–48h replacement SLA • 100% GSTR-2B Tax Credit
          </p>
        </div>

        {/* Responsive 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          
          {/* Left Column: Interactive Controls (Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5 sm:space-y-4">
            
            {/* 1. Hardware Tier Selection (Clean 2x2 Grid with Zero Truncation) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF7F2]">
                  Hardware Specification Tier
                </span>
                <span className="text-[10.5px] sm:text-[11px] text-[#D4A24C] font-semibold">
                  Selected: {selectedTier.name}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {tiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedTier.id === tier.id
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-[#FAF7F2] shadow-sm ring-1 ring-[#D4A24C]/40'
                        : 'bg-white/5 border-white/10 text-[#90b09a] hover:border-white/25 hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <tier.icon className={`w-3.5 h-3.5 shrink-0 ${
                          selectedTier.id === tier.id ? 'text-[#D4A24C]' : 'text-[#90b09a]'
                        }`} />
                        <span className="font-bold text-[11px] sm:text-xs text-[#FAF7F2]">
                          {tier.name}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[10.5px] font-mono text-[#D4A24C] shrink-0 font-semibold">
                        ₹{tier.price.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                    <p className="text-[9.5px] sm:text-[10px] text-[#90b09a] leading-tight">
                      {tier.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Fleet Quantity Slider + Quick Preset Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF7F2]">
                  Fleet Size
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/40 text-[#D4A24C] text-[11px] sm:text-xs font-bold font-mono">
                  {quantity} Laptops
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#D4A24C]"
              />

              {/* Quick Preset Chips */}
              <div className="flex items-center justify-between mt-1.5 pt-0.5">
                <span className="text-[9.5px] sm:text-[10px] text-[#90b09a] uppercase font-semibold">Quick Presets:</span>
                <div className="flex items-center gap-1.5">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setQuantity(p)}
                      className={`px-2 py-0.5 rounded text-[9.5px] sm:text-[10px] font-mono font-semibold transition cursor-pointer ${
                        quantity === p
                          ? 'bg-[#D4A24C] text-[#072117] font-bold shadow-xs'
                          : 'bg-white/10 text-[#FAF7F2] hover:bg-white/20'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Lease Duration Tabs (Symmetrical 3-Column Grid) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF7F2]">
                  Lease Duration
                </span>
                {duration.discount > 0 && (
                  <span className="text-[9.5px] sm:text-[10px] font-semibold text-[#D4A24C] flex items-center gap-1 font-mono">
                    <Percent className="w-3 h-3" /> {duration.discount}% Long-Term Rebate
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-center border transition-all cursor-pointer ${
                      duration.id === d.id
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-[#FAF7F2] shadow-sm ring-1 ring-[#D4A24C]/40'
                        : 'bg-white/5 border-white/10 text-[#90b09a] hover:border-white/20'
                    }`}
                  >
                    <span>{d.label}</span>
                    {d.discount > 0 ? (
                      <span className="block text-[8.5px] sm:text-[9px] text-[#D4A24C] mt-0.5">
                        Save {d.discount}%
                      </span>
                    ) : (
                      <span className="block text-[8.5px] sm:text-[9px] text-[#90b09a] mt-0.5">
                        Standard
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sleek Quotation Summary Card (Span 5) */}
          <div className="lg:col-span-5 bg-[#0D3B2A] rounded-2xl border border-[#D4A24C]/40 p-4 sm:p-5 flex flex-col justify-between shadow-xl">
            
            <div>
              {/* Header Status */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs">
                <span className="text-[9.5px] sm:text-[10px] font-sans font-bold uppercase tracking-widest text-[#D4A24C]">
                  ESTIMATED QUOTATION
                </span>
                <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Standby SLA
                </span>
              </div>

              {/* Live Big Price */}
              <div className="my-2.5 sm:my-3">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#FAF7F2] tracking-tight">
                  ₹{finalTotal.toLocaleString('en-IN')}
                  <span className="text-xs font-sans font-normal text-[#90b09a] ml-1.5">
                    {includeGst ? '/mo (Incl. GST)' : '/mo + 18% GST'}
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-[11px] text-[#90b09a] mt-0.5">
                  Rate per machine: <span className="text-[#D4A24C] font-semibold">₹{unitRate.toLocaleString('en-IN')}/mo</span>
                </p>
              </div>

              {/* GST Toggle Switch */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/25 border border-white/10 text-xs mb-3">
                <span className="text-[#FAF7F2]/90 text-[10.5px] sm:text-[11px]">Include 18% GST</span>
                <button
                  type="button"
                  onClick={() => setIncludeGst(!includeGst)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    includeGst ? 'bg-[#D4A24C]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      includeGst ? 'translate-x-4' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Key Highlights */}
              <div className="space-y-1 text-[11px] sm:text-xs text-[#90b09a] pb-3">
                <div className="flex justify-between">
                  <span>Hardware:</span>
                  <span className="text-[#FAF7F2] font-semibold">{selectedTier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tenure:</span>
                  <span className="text-[#FAF7F2] font-semibold">{duration.label}</span>
                </div>
                {includeGst && (
                  <div className="flex justify-between text-[#D4A24C]">
                    <span>GST (100% Tax Credit):</span>
                    <span className="font-mono">+₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleRequestQuote}
                className="w-full py-2 sm:py-2.5 rounded-xl bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] font-sans font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
              >
                <span>Request Formal Quote (PDF)</span>
                <FileDown className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => handleAddToCart(e)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF7F2] font-sans font-semibold text-[11px] sm:text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4A24C]" />
                <span>Add Lease To Cart</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
