import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Server,
  Phone,
  ShieldCheck,
  FileText,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenRFQ }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#0D3B2A]/10 transition-all duration-300">
      {/* Top Enterprise Information Bar - Al-Tooba Style */}
      <div className="bg-[#072117] text-[#D4A24C] text-[11px] py-2 px-4 sm:px-8 border-b border-[#D4A24C]/20 tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span>✨</span>
              <span>PAN-INDIA DISPATCH ✦ 24–48H ONSITE SLA ✦ 100% GSTR-2B TAX CREDIT</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <a
              href="tel:+919876543210"
              className="hover:text-white transition flex items-center gap-1.5 font-medium text-slate-200"
            >
              <Phone className="w-3 h-3 text-[#D4A24C]" />
              +91 98765 43210 (Procurement Desk)
            </a>
            <span className="text-[#D4A24C]/40">|</span>
            <button
              onClick={() => onOpenRFQ?.('Corporate Inventory Catalog')}
              className="text-[#D4A24C] hover:text-white font-semibold flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Request Catalog (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Al-Tooba Style */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#0D3B2A] border border-[#D4A24C]/50 flex items-center justify-center text-[#D4A24C] shadow-md group-hover:scale-105 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#0D3B2A] font-serif flex items-center gap-1.5">
              NOVA <span className="text-[#D4A24C] font-normal italic">INFOTECH</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#0D3B2A] text-[#FAF7F2] font-mono tracking-widest font-semibold">
                B2B
              </span>
            </div>
            <p className="text-[9px] text-[#5A6B63] tracking-[0.2em] uppercase font-semibold">
              Certified Enterprise Hardware
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-[12px] uppercase font-semibold tracking-[0.14em] text-[#0D3B2A]">
          <Link to="/" className="hover:text-[#D4A24C] transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-[#D4A24C] transition">
            Inventory
          </Link>
          <Link to="/rental" className="hover:text-[#D4A24C] transition flex items-center gap-1">
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/30 font-bold">
              Hot
            </span>
            Rental Calculator
          </Link>
          <Link to="/buyback" className="hover:text-[#D4A24C] transition">
            Asset Liquidation
          </Link>
          <Link to="/about" className="hover:text-[#D4A24C] transition">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-[#D4A24C] transition">
            Contact
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-3">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2.5 text-[#0D3B2A] hover:text-[#D4A24C] transition rounded-full hover:bg-[#F3E8D2]/40"
            title="Quotation Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4A24C] text-[#0D3B2A] rounded-full text-[10px] font-bold flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User / Auth State */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-semibold shadow transition border border-[#D4A24C]/30"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#D4A24C]" />
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/40 text-xs font-semibold hover:bg-[#E6D5B8] transition"
                >
                  <User className="w-3.5 h-3.5" />
                  {user.name.split(' ')[0]}
                </Link>
              )}
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-600 transition rounded-full hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="hidden sm:inline-flex px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#0D3B2A] hover:text-[#D4A24C] transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex px-4 py-2 rounded-full border border-[#D4A24C] text-[#0D3B2A] hover:bg-[#D4A24C]/10 text-xs font-semibold uppercase tracking-wider transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Request Quote Main Button - Al-Tooba Gold & Emerald Pill */}
          <button
            onClick={() => onOpenRFQ?.('General Bulk RFQ')}
            className="px-5 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider shadow-md border border-[#D4A24C]/50 transition flex items-center gap-1.5"
          >
            <span>Request RFQ</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4A24C]" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0D3B2A] hover:text-[#D4A24C] rounded-full hover:bg-[#F3E8D2]/40"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation - Al-Tooba Sacred Forest Style */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D3B2A] text-white border-b border-[#D4A24C]/30 px-6 pt-6 pb-8 space-y-4 animate-in slide-in-from-top duration-300">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-[#FAF7F2] hover:text-[#D4A24C] border-b border-[#D4A24C]/10"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-[#FAF7F2] hover:text-[#D4A24C] border-b border-[#D4A24C]/10"
          >
            Hardware Inventory
          </Link>
          <Link
            to="/rental"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-[#FAF7F2] hover:text-[#D4A24C] border-b border-[#D4A24C]/10"
          >
            Corporate Rental Calculator
          </Link>
          <Link
            to="/buyback"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-[#FAF7F2] hover:text-[#D4A24C] border-b border-[#D4A24C]/10"
          >
            Asset Liquidation
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-[#FAF7F2] hover:text-[#D4A24C] border-b border-[#D4A24C]/10"
          >
            About Us & Testing Protocol
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-[#FAF7F2] hover:text-[#D4A24C] border-b border-[#D4A24C]/10"
          >
            Contact & Procurement Desk
          </Link>

          <div className="pt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-full bg-[#D4A24C] text-[#0D3B2A] text-xs font-bold uppercase tracking-wider"
                  >
                    Go to Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-full bg-[#F3E8D2] text-[#0D3B2A] text-xs font-bold"
                  >
                    Customer Account
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-red-300 hover:text-red-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-full border border-[#D4A24C] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-full bg-[#D4A24C] text-[#0D3B2A] text-xs font-bold uppercase tracking-wider"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
