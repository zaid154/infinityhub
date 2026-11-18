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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Enterprise Information Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-2 text-emerald-400 font-semibold font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Stock: 1,450+ Units Available (Ready to Ship)
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Pan-India Dispatch • 24–48h SLA Replacement • 100% Tax Invoicing (GSTR-2B)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+919876543210"
              className="hover:text-white transition flex items-center gap-1.5 font-medium text-[11px]"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              +91 98765 43210 (Procurement Desk)
            </a>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => onOpenRFQ?.('Corporate Inventory Catalog')}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-[11px]"
            >
              <FileText className="w-3 h-3" />
              Request Catalog (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition">
            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 font-heading">
              NOVA <span className="text-blue-600 font-medium">INFOTECH</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono font-semibold">
                B2B
              </span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-medium">
              Enterprise Hardware & Rentals
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-700">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-600 transition">
            Hardware Inventory
          </Link>
          <Link to="/rental" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-bold">
              Hot
            </span>
            Rental Calculator
          </Link>
          <Link to="/buyback" className="hover:text-blue-600 transition">
            Asset Liquidation
          </Link>
          <Link to="/about" className="hover:text-blue-600 transition">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-3">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 text-slate-600 hover:text-blue-600 transition rounded-lg hover:bg-slate-100"
            title="Quotation Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow">
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
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition"
                >
                  <User className="w-3.5 h-3.5" />
                  {user.name.split(' ')[0]}
                </Link>
              )}
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:border-slate-400 text-xs font-semibold transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Request Quote Main Button */}
          <button
            onClick={() => onOpenRFQ?.('General Bulk RFQ')}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide shadow-md shadow-blue-600/25 transition flex items-center gap-1.5"
          >
            <span>Request RFQ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Hardware Inventory (Laptops, Monitors, Parts)
          </Link>
          <Link
            to="/rental"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Corporate Rental Calculator
          </Link>
          <Link
            to="/buyback"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Sell Old IT Assets (Buyback)
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            About Us & Testing Protocol
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600 border-b border-slate-100"
          >
            Contact & Location
          </Link>

          <div className="pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold"
                  >
                    Go to Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"
                  >
                    Customer Account
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg border border-slate-300 text-slate-800 text-xs font-bold"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
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
