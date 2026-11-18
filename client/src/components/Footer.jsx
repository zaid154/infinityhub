import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you! You will receive our weekly fleet inventory catalog.');
    setEmail('');
  };

  return (
    <footer className="relative bg-[#072117] text-[#90b09a] pt-16 pb-8 border-t border-[#FAF7F2]/10 overflow-hidden select-none">
      {/* Top Ambient Subtle Glow */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF7F2]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* 4-Column Responsive Grid - Exactly like Al-Tooba */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-14">
          
          {/* Column 1: Brand & Bio + Luxury Pill Newsletter */}
          <div className="space-y-4">
            <BrandLogo theme="dark" />

            <p className="text-xs sm:text-sm leading-relaxed text-[#90b09a]">
              Nova Infotech® provisions enterprise-grade commercial laptops, flexible corporate rental leases, and verified hardware fleets across India with guaranteed 24–48h replacement SLA.
            </p>

            {/* Al-Tooba Signature Pill-in-Pill Newsletter */}
            <form onSubmit={handleSubscribe} className="relative w-full max-w-sm flex items-center bg-transparent border border-[#FAF7F2]/25 rounded-full p-1 mt-4 hover:border-[#D4A24C]/50 transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Corporate Email"
                className="w-full pl-4 pr-3 py-2 bg-transparent text-[#FAF7F2] placeholder-[#90b09a]/70 outline-none text-xs border-none focus:ring-0"
              />
              <button
                type="submit"
                className="rounded-full px-5 py-2 bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] text-[11px] font-sans font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer active:scale-95 shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Column 2: HARDWARE FLEETS */}
          <div className="space-y-4">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.18em] text-[#FAF7F2]">
              Hardware Fleets
            </h3>
            <ul className="text-xs sm:text-sm space-y-2.5 flex flex-col text-[#90b09a]">
              <li>
                <Link to="/products" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Complete Fleet Inventory
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Lenovo ThinkPad T-Series Fleets
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Dell Latitude Corporate Ultrabooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  HP EliteBook Executive Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Dell Precision Mobile Workstations
                </Link>
              </li>
              <li>
                <Link to="/products?category=monitor" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Frameless Ergonomic IPS Displays
                </Link>
              </li>
              <li>
                <Link to="/products?category=desktop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Dell OptiPlex Micro Form PCs
                </Link>
              </li>
              <li>
                <Link to="/products?category=ram" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Samsung & Micron DDR4 Memory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: ENTERPRISE SOLUTIONS */}
          <div className="space-y-4">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.18em] text-[#FAF7F2]">
              Enterprise Solutions
            </h3>
            <ul className="text-xs sm:text-sm space-y-2.5 flex flex-col text-[#90b09a]">
              <li>
                <Link to="/rental" className="text-[#D4A24C] font-bold hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Corporate Laptop Rentals (Zero CAPEX)
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Bulk Wholesale Procurement
                </Link>
              </li>
              <li>
                <Link to="/buyback" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  E-Waste Buyback & Asset Liquidation
                </Link>
              </li>
              <li>
                <Link to="/rental" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Fleet Cost Estimator & Calculator
                </Link>
              </li>
              <li>
                <Link to="/rental" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  24–48h On-Site Standby SLA
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  30-Point Rigorous Diagnostic Lab
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Company Quality Commitment
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: PROCUREMENT DESK & DIRECT CONTACT */}
          <div className="space-y-4">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.18em] text-[#FAF7F2]">
              Procurement Desk
            </h3>
            <div className="text-xs sm:text-sm space-y-3.5 text-[#90b09a]">
              <div>
                <span className="text-[#FAF7F2]/60 text-[11px] uppercase tracking-wider block mb-1">
                  Central Operations & Hub
                </span>
                <p className="leading-relaxed text-[#FAF7F2]/90">
                  Electronic City Phase 1, Bangalore · Okhla Industrial Area, Delhi NCR · Mumbai, India
                </p>
              </div>

              <div>
                <span className="text-[#FAF7F2]/60 text-[11px] uppercase tracking-wider block mb-1">
                  Direct B2B Desk
                </span>
                <a
                  href="tel:+919876543210"
                  className="text-[#FAF7F2] font-semibold hover:text-[#D4A24C] transition-colors block text-sm"
                >
                  +91 98765 43210
                </a>
                <a
                  href="mailto:procurement@novainfotech.in"
                  className="text-[#90b09a] hover:text-[#D4A24C] transition-colors block text-xs mt-0.5"
                >
                  procurement@novainfotech.in
                </a>
              </div>

              <div>
                <span className="text-[#FAF7F2]/60 text-[11px] uppercase tracking-wider block mb-1">
                  Commercial Hours
                </span>
                <p className="text-xs text-[#90b09a]">
                  Monday – Saturday: 9:30 AM – 7:30 PM IST
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Links Bar - Exactly like Al-Tooba */}
        <div className="py-7 border-t border-[#FAF7F2]/10">
          <ul className="flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-3 text-[10px] md:text-[11px] uppercase tracking-[0.18em] font-semibold text-[#90b09a]">
            <li>
              <Link to="/about" className="hover:text-[#D4A24C] hover:-translate-y-0.5 inline-block transition-transform duration-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#D4A24C] hover:-translate-y-0.5 inline-block transition-transform duration-300">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/rental" className="hover:text-[#D4A24C] hover:-translate-y-0.5 inline-block transition-transform duration-300">
                Rental SLA Terms
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#D4A24C] hover:-translate-y-0.5 inline-block transition-transform duration-300">
                Pan-India Dispatch Policy
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#D4A24C] hover:-translate-y-0.5 inline-block transition-transform duration-300">
                Hardware Replacement Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Copyright Row - Clean Al-Tooba Finish */}
        <div className="pt-6 border-t border-[#FAF7F2]/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#b4d6be]">
          <p className="tracking-wider text-[11px] text-[#b4d6be] uppercase">
            © 2026 NOVA INFOTECH®. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] text-[#90b09a] tracking-wider uppercase">
            100% GSTR-2B TAX COMPLIANT · ISO 9001:2015 RIGOROUS HARDWARE DIAGNOSTICS
          </p>
        </div>
      </div>
    </footer>
  );
}
