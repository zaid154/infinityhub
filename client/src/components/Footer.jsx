import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
        {/* Col 1: About Nova Infotech */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-blue-700 flex items-center justify-center text-white shadow-md">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-heading">
              NOVA <span className="text-blue-500 font-medium">INFOTECH</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            India's authorized B2B enterprise IT infrastructure vendor. Refurbished commercial laptops, flexible corporate rental leases, certified memory & GPU modules, and certified e-waste asset liquidation.
          </p>
          <div className="text-xs text-slate-400 font-mono space-y-1.5 pt-1">
            <p className="text-slate-300">GSTIN: 07AAACN8412K1Z9</p>
            <p className="flex items-center gap-1.5 text-emerald-400 font-sans font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" /> ISO 9001:2015 Refurbishment & Diagnostic Lab
            </p>
          </div>
        </div>

        {/* Col 2: Solutions */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider font-mono">B2B Solutions</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/products?category=laptop" className="hover:text-blue-400 transition">
                Bulk Refurbished Laptops (ThinkPad/Dell/HP)
              </Link>
            </li>
            <li>
              <Link to="/rental" className="hover:text-blue-400 transition">
                Corporate Laptop Rental & Leasing
              </Link>
            </li>
            <li>
              <Link to="/products?category=monitor" className="hover:text-blue-400 transition">
                Commercial Frameless IPS Monitors
              </Link>
            </li>
            <li>
              <Link to="/products?category=ram" className="hover:text-blue-400 transition">
                Wholesale DDR4/DDR5 RAM Modules
              </Link>
            </li>
            <li>
              <Link to="/products?category=gpu" className="hover:text-blue-400 transition">
                Workstation & AI Graphics Cards
              </Link>
            </li>
            <li>
              <Link to="/buyback" className="hover:text-blue-400 transition">
                Corporate Asset Liquidation (Buyback)
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Fleets */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider font-mono">Ready Fleets</h4>
          <ul className="space-y-2 text-slate-400">
            <li>Lenovo ThinkPad T480 / T490 / T14</li>
            <li>Dell Latitude 5400 / 7490 Ultrabooks</li>
            <li>HP EliteBook 840 G5 / G6 Aluminum</li>
            <li>Dell 24" & 27" Height-Adjustable IPS</li>
            <li>Samsung / Micron 16GB & 32GB RAM</li>
            <li>NVIDIA RTX 3060 / 3070 AI Workstation Rigs</li>
          </ul>
        </div>

        {/* Col 4: Warehouse Contact */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider font-mono">Procurement Warehouse</h4>
          <p className="flex items-start gap-2 text-slate-400 leading-relaxed">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR. (Pan-India Shipping)
          </p>
          <p className="flex items-center gap-2 text-white font-semibold">
            <Phone className="w-4 h-4 text-emerald-400" />
            +91 98765 43210 (Direct Desk)
          </p>
          <p className="flex items-center gap-2 text-slate-400">
            <Mail className="w-4 h-4 text-blue-400" />
            procurement@novainfotech.in
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Operating Hours: Mon–Sat (9:30 AM – 7:30 PM)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 Nova Infotech Solutions. All rights reserved.</p>
        <div className="flex space-x-6">
          <span className="hover:text-slate-400 transition cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-400 transition cursor-pointer">Rental SLA Terms</span>
          <span className="hover:text-slate-400 transition cursor-pointer">Hardware Replacement Policy</span>
        </div>
      </div>
    </footer>
  );
}
