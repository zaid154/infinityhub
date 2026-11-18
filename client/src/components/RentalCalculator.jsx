import React, { useState } from 'react';
import { Send, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const TIERS = [
  {
    id: 'essential',
    name: 'Office Essential',
    subtitle: 'ThinkPad T490 • Core i5 • 16GB',
    price: 1350,
    icon: '💻'
  },
  {
    id: 'developer',
    name: 'Developer Pro',
    subtitle: 'ThinkPad T14 / Latitude • i7 • NVMe',
    price: 1850,
    icon: '⚡'
  },
  {
    id: 'workstation',
    name: 'Workstation / AI',
    subtitle: 'Dell Precision • 32GB • RTX GPU',
    price: 3200,
    icon: '🚀'
  }
];

const DURATIONS = [
  { id: '3m', label: '3 Months', multiplier: 1.0, discount: 0 },
  { id: '6m', label: '6 Months', multiplier: 0.95, discount: 5 },
  { id: '12m', label: '12+ Months', multiplier: 0.85, discount: 15 }
];

const PRESETS = [5, 15, 30, 50, 100];

export default function RentalCalculator({ onOpenRFQ }) {
  const { addToCart } = useCart();
  const [selectedTier, setSelectedTier] = useState(TIERS[0]);
  const [quantity, setQuantity] = useState(15);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [includeGst, setIncludeGst] = useState(false);

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

  const handleAddToCart = () => {
    addToCart(
      {
        _id: `custom-lease-${selectedTier.id}-${quantity}-${duration.id}`,
        title: `${quantity}x ${selectedTier.name} Lease (${duration.label})`,
        sale_price: finalTotal * (duration.id === '3m' ? 3 : duration.id === '6m' ? 6 : 12),
        rental_price_monthly: finalTotal,
        images: [{ url: '/products/real-thinkpad-t14-transparent.png' }],
        category: 'rental'
      },
      1
    );
    toast.success(`${quantity}x ${selectedTier.name} rental lease package added to cart!`);
  };

  return (
    <section id="rental-calculator" className="max-w-5xl mx-auto px-4 sm:px-6 select-none">
      <div className="bg-[#072117] rounded-2xl sm:rounded-3xl border border-[#D4A24C]/30 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Subtle Ambient Accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#D4A24C]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-5 border-b border-[#FAF7F2]/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#D4A24C] font-semibold block">
              Flexible Enterprise Fleet Leasing
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] font-bold tracking-tight mt-0.5">
              Corporate Rental Estimator
            </h2>
          </div>
          <p className="text-xs text-[#90b09a] sm:text-right max-w-xs leading-relaxed">
            Zero CAPEX • 24–48h replacement SLA • 100% GSTR-2B Tax Credit
          </p>
        </div>

        {/* Compact 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Interactive Controls (Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            
            {/* 1. Hardware Tier Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF7F2]">
                  Hardware Specification Tier
                </span>
                <span className="text-[11px] text-[#D4A24C] font-semibold">
                  Base ₹{selectedTier.price.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedTier.id === tier.id
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-[#FAF7F2] shadow-sm'
                        : 'bg-white/5 border-white/10 text-[#90b09a] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{tier.icon}</span>
                      <span className="font-bold text-xs truncate text-[#FAF7F2]">
                        {tier.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#90b09a] truncate">
                      {tier.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Fleet Quantity Slider + Quick Preset Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF7F2]">
                  Fleet Size
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/40 text-[#D4A24C] text-xs font-bold font-mono">
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
              <div className="flex items-center justify-between mt-2 pt-1">
                <span className="text-[10px] text-[#90b09a] uppercase font-semibold">Quick Presets:</span>
                <div className="flex items-center gap-1.5">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setQuantity(p)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition cursor-pointer ${
                        quantity === p
                          ? 'bg-[#D4A24C] text-[#072117] font-bold'
                          : 'bg-white/10 text-[#FAF7F2] hover:bg-white/20'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Lease Duration Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#FAF7F2]">
                  Lease Duration
                </span>
                {duration.discount > 0 && (
                  <span className="text-[10px] font-semibold text-[#D4A24C] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {duration.discount}% Long-Term Rebate
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      duration.id === d.id
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-[#FAF7F2] shadow-sm'
                        : 'bg-white/5 border-white/10 text-[#90b09a] hover:border-white/20'
                    }`}
                  >
                    <span>{d.label}</span>
                    {d.discount > 0 && (
                      <span className="block text-[9px] text-[#D4A24C] mt-0.5">
                        Save {d.discount}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sleek Quotation Summary Card (Span 5) */}
          <div className="lg:col-span-5 bg-[#0D3B2A] rounded-2xl border border-[#D4A24C]/40 p-5 sm:p-6 flex flex-col justify-between shadow-xl">
            
            <div>
              {/* Header Status */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#D4A24C]">
                  ESTIMATED QUOTATION
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Standby SLA
                </span>
              </div>

              {/* Live Big Price */}
              <div className="my-4">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF7F2] tracking-tight">
                  ₹{finalTotal.toLocaleString('en-IN')}
                  <span className="text-xs font-sans font-normal text-[#90b09a] ml-1.5">
                    {includeGst ? '/mo (Incl. GST)' : '/mo + 18% GST'}
                  </span>
                </div>
                <p className="text-[11px] text-[#90b09a] mt-1">
                  Rate per machine: <span className="text-[#D4A24C] font-semibold">₹{unitRate.toLocaleString('en-IN')}/mo</span>
                </p>
              </div>

              {/* GST Toggle Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/25 border border-white/10 text-xs mb-4">
                <span className="text-[#FAF7F2]/90 text-[11px]">Include 18% GST</span>
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
              <div className="space-y-1.5 text-xs text-[#90b09a] pb-4">
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
                className="w-full py-2.5 rounded-xl bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
              >
                <span>Request Formal Quote (PDF)</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF7F2] font-sans font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
