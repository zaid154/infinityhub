import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Calculator,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Zap,
  TrendingDown,
  FileCheck2,
  Send,
  HelpCircle
} from 'lucide-react';

export default function RentalPlans() {
  const { openRFQ } = useOutletContext();

  const [calcTier, setCalcTier] = useState({
    key: 'standard',
    basePrice: 1350,
    name: 'Office Essential (Core i5)'
  });
  const [calcQty, setCalcQty] = useState(20);
  const [calcDuration, setCalcDuration] = useState({
    key: '6m',
    multiplier: 1.0,
    name: '6 Months (Standard)'
  });

  const perUnitRate = Math.round(calcTier.basePrice * calcDuration.multiplier);
  const totalMonthlyCost = perUnitRate * calcQty;

  const handleBookFleet = () => {
    openRFQ(`Corporate Rental Plan: ${calcQty}x ${calcTier.name} for ${calcDuration.name} (~₹${totalMonthlyCost.toLocaleString('en-IN')}/mo)`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          Corporate Leasing & Rentals
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Flexible Enterprise IT Hardware Rentals
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Scale your team with zero capital expenditure. Rent commercial laptops (ThinkPad, Latitude, EliteBook) and monitors with 100% free on-site service and instant backup replacements.
        </p>
      </div>

      {/* Main Rental Calculator Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            Live Pricing Estimator
          </span>
          <h2 className="text-2xl font-bold">Configure Your Corporate Fleet</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Tiers */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-3">
                1. Select Machine Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button
                  onClick={() =>
                    setCalcTier({
                      key: 'standard',
                      basePrice: 1350,
                      name: 'Office Essential (Core i5)'
                    })
                  }
                  className={`p-3.5 rounded-xl text-left border transition ${
                    calcTier.key === 'standard'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="font-bold block">Office Essential</span>
                  <span className="text-[11px] opacity-80 block">Core i5 • 8GB • SSD</span>
                  <span className="text-xs font-mono mt-2 block font-semibold">₹1,350/mo</span>
                </button>

                <button
                  onClick={() =>
                    setCalcTier({
                      key: 'developer',
                      basePrice: 1850,
                      name: 'Developer Pro (Core i7)'
                    })
                  }
                  className={`p-3.5 rounded-xl text-left border transition ${
                    calcTier.key === 'developer'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="font-bold block">Developer Pro</span>
                  <span className="text-[11px] opacity-80 block">Core i7 • 16GB • NVMe</span>
                  <span className="text-xs font-mono mt-2 block font-semibold text-emerald-400">
                    ₹1,850/mo
                  </span>
                </button>

                <button
                  onClick={() =>
                    setCalcTier({
                      key: 'workstation',
                      basePrice: 3200,
                      name: 'VFX / GPU Workstation'
                    })
                  }
                  className={`p-3.5 rounded-xl text-left border transition ${
                    calcTier.key === 'workstation'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="font-bold block">VFX / GPU Rig</span>
                  <span className="text-[11px] opacity-80 block">32GB • RTX Graphics</span>
                  <span className="text-xs font-mono mt-2 block font-semibold text-purple-400">
                    ₹3,200/mo
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Quantity Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase text-slate-400 font-bold">
                  2. Device Fleet Quantity
                </label>
                <span className="text-sm font-bold font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/30">
                  {calcQty} Laptops
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={calcQty}
                onChange={(e) => setCalcQty(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>5 Units (MOQ)</span>
                <span>50 Units</span>
                <span>100 Units</span>
                <span>200+ Units</span>
              </div>
            </div>

            {/* 3. Tenure */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-3">
                3. Contract Tenure
              </label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <button
                  onClick={() =>
                    setCalcDuration({ key: '1-3m', multiplier: 1.15, name: '1–3 Months' })
                  }
                  className={`py-2.5 rounded-xl font-bold border transition ${
                    calcDuration.key === '1-3m'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  1–3 Months
                </button>
                <button
                  onClick={() =>
                    setCalcDuration({ key: '6m', multiplier: 1.0, name: '6 Months (Std)' })
                  }
                  className={`py-2.5 rounded-xl font-bold border transition ${
                    calcDuration.key === '6m'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() =>
                    setCalcDuration({ key: '12m', multiplier: 0.85, name: '12+ Months (15% Off)' })
                  }
                  className={`py-2.5 rounded-xl font-bold border transition ${
                    calcDuration.key === '12m'
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  12+ Mo (15% Off)
                </button>
              </div>
            </div>
          </div>

          {/* Output Card */}
          <div className="lg:col-span-5 bg-slate-800/80 p-6 sm:p-7 rounded-2xl border border-slate-700 space-y-5">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
              Monthly Operational Expense
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">
              ₹{totalMonthlyCost.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">/ mo + GST</span>
            </div>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Tax Deductible Operating Expense (OPEX)
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Configuration:</span>
                <span className="font-semibold text-white">{calcTier.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fleet Units:</span>
                <span className="font-semibold text-white">{calcQty} Laptops</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Per Device Rate:</span>
                <span className="font-semibold text-blue-400">₹{perUnitRate}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security Deposit:</span>
                <span className="font-semibold text-emerald-400">Waived for GST Registered Companies</span>
              </div>
            </div>

            <button
              onClick={handleBookFleet}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Lock In This Fleet Quotation</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison: Buying New vs Renting */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Why Corporates Prefer Renting Over Buying</h2>
          <p className="text-xs text-slate-500">Financial and operational breakdown for Indian companies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              100% OPEX Tax Write-Off
            </h3>
            <p className="text-slate-600 leading-relaxed">
              When you buy laptops, you tie up capital in depreciating assets over 3 years. With Nova Infotech corporate renting, every rupee paid is booked as an operational business expense, lowering your taxable corporate profit directly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              Zero Downtime SLA & Free Upgrades
            </h3>
            <p className="text-slate-600 leading-relaxed">
              No need to hire hardware repair technicians. If any rented machine develops a screen, hinge, or motherboard fault, our engineer visits your office within 24–48 hours to swap it out with a standby replacement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
