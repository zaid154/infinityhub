import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#072117] text-slate-300 pt-16 pb-12 border-t border-[#D4A24C]/30 relative overflow-hidden">
      {/* Decorative Golden Arch Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#D4A24C] to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#D4A24C]/20">
        {/* Col 1: Brand & Newsletter */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#0D3B2A] border border-[#D4A24C]/60 flex items-center justify-center text-[#D4A24C] shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#FAF7F2] font-serif">
              NOVA <span className="text-[#D4A24C] italic font-normal">INFOTECH</span>
            </span>
          </Link>
          <p className="text-xs text-slate-300 leading-relaxed">
            India's premier enterprise IT infrastructure vendor. Grade A+ certified commercial laptops, flexible corporate rental leases, memory & GPU modules, and certified e-waste asset liquidation.
          </p>

          {/* Newsletter Input - Al-Tooba Style */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4A24C] block mb-2 font-semibold">
              Subscribe to Fleet Stock Updates
            </span>
            <div className="flex items-center rounded-full bg-[#0D3B2A] border border-[#D4A24C]/40 p-1">
              <input
                type="email"
                placeholder="Enter corporate email..."
                className="bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none flex-1"
              />
              <button className="px-4 py-1.5 rounded-full bg-[#D4A24C] hover:bg-[#c5943b] text-[#0D3B2A] font-bold text-xs uppercase tracking-wider transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Col 2: Solutions */}
        <div className="space-y-3 text-xs">
          <h4 className="font-serif text-base font-bold text-[#D4A24C] tracking-wide">Enterprise Solutions</h4>
          <ul className="space-y-2.5 text-slate-300">
            <li>
              <Link to="/products?category=laptop" className="hover:text-[#D4A24C] transition flex items-center gap-1.5">
                <span className="text-[#D4A24C]">✦</span> Bulk ThinkPad & Latitude Fleets
              </Link>
            </li>
            <li>
              <Link to="/rental" className="hover:text-[#D4A24C] transition flex items-center gap-1.5">
                <span className="text-[#D4A24C]">✦</span> Zero CAPEX Corporate Rental
              </Link>
            </li>
            <li>
              <Link to="/products?category=monitor" className="hover:text-[#D4A24C] transition flex items-center gap-1.5">
                <span className="text-[#D4A24C]">✦</span> Commercial IPS Ergonomic Displays
              </Link>
            </li>
            <li>
              <Link to="/products?category=ram" className="hover:text-[#D4A24C] transition flex items-center gap-1.5">
                <span className="text-[#D4A24C]">✦</span> Wholesale DDR4/DDR5 Memory
              </Link>
            </li>
            <li>
              <Link to="/products?category=gpu" className="hover:text-[#D4A24C] transition flex items-center gap-1.5">
                <span className="text-[#D4A24C]">✦</span> Workstation & AI Graphics Cards
              </Link>
            </li>
            <li>
              <Link to="/buyback" className="hover:text-[#D4A24C] transition flex items-center gap-1.5">
                <span className="text-[#D4A24C]">✦</span> Corporate Asset Liquidation (Buyback)
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Fleets */}
        <div className="space-y-3 text-xs">
          <h4 className="font-serif text-base font-bold text-[#D4A24C] tracking-wide">Ready Fleet Stock</h4>
          <ul className="space-y-2 text-slate-300">
            <li>Lenovo ThinkPad T480 / T490 / T14</li>
            <li>Dell Latitude 5400 / 7490 Ultrabooks</li>
            <li>HP EliteBook 840 G5 / G6 Aluminum</li>
            <li>Dell 24" & 27" Height-Adjustable IPS</li>
            <li>Samsung / Micron 16GB & 32GB RAM</li>
            <li>NVIDIA RTX 3060 / 3070 AI Workstation Rigs</li>
          </ul>
          <div className="pt-2 text-[11px] font-mono text-[#D4A24C]">
            <p>GSTIN: 07AAACN8412K1Z9</p>
            <p className="flex items-center gap-1 text-emerald-400 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" /> ISO 9001:2015 Diagnostic Lab
            </p>
          </div>
        </div>

        {/* Col 4: Warehouse Contact */}
        <div className="space-y-3 text-xs">
          <h4 className="font-serif text-base font-bold text-[#D4A24C] tracking-wide">Procurement Facility</h4>
          <p className="flex items-start gap-2 text-slate-300 leading-relaxed">
            <MapPin className="w-4 h-4 text-[#D4A24C] shrink-0 mt-0.5" />
            Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR. (Pan-India Dispatch)
          </p>
          <p className="flex items-center gap-2 text-[#FAF7F2] font-semibold">
            <Phone className="w-4 h-4 text-[#D4A24C]" />
            +91 98765 43210 (Direct Desk)
          </p>
          <p className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-[#D4A24C]" />
            procurement@novainfotech.in
          </p>
          <p className="text-[11px] text-[#D4A24C]/80 font-mono">
            Operating Hours: Mon–Sat (9:30 AM – 7:30 PM)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#FAF7F2]/60 gap-4">
        <p>© 2026 Nova Infotech Solutions. All rights reserved.</p>
        <div className="flex space-x-6 text-xs">
          <span className="hover:text-[#D4A24C] transition cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#D4A24C] transition cursor-pointer">Rental SLA Terms</span>
          <span className="hover:text-[#D4A24C] transition cursor-pointer">Hardware Replacement Policy</span>
        </div>
      </div>
    </footer>
  );
}
