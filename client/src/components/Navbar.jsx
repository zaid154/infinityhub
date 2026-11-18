import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  FileText,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenRFQ }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll detection for seamless transparent-to-frosted glass transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D4A24C]/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
          : 'bg-gradient-to-b from-black/75 via-black/35 to-transparent border-b border-transparent'
      }`}
    >
      {/* Main Transparent / Frosted Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Al-Tooba Style (Gold & White / Dark Emerald) */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#0D3B2A] border border-[#D4A24C]/60 flex items-center justify-center text-[#D4A24C] shadow-lg group-hover:scale-105 transition">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <div className={`text-xl sm:text-2xl font-bold tracking-tight font-serif flex items-center gap-1.5 transition-colors ${
              scrolled ? 'text-[#072117]' : 'text-white drop-shadow-md'
            }`}>
              NOVA <span className={`${scrolled ? 'text-[#D4A24C]' : 'text-[#F59E0B]'} font-normal italic`}>INFOTECH</span>
            </div>
            <p className={`text-[9px] tracking-[0.2em] uppercase font-semibold transition-colors ${
              scrolled ? 'text-[#5A6B63]' : 'text-white/70'
            }`}>
              Certified Enterprise Hardware
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links - Switches White to Deep Emerald on Scroll */}
        <nav className={`hidden lg:flex items-center space-x-8 text-[12px] uppercase font-bold tracking-[0.16em] transition-colors ${
          scrolled ? 'text-[#072117]' : 'text-white'
        }`}>
          <Link to="/" className={`transition-colors ${scrolled ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Home
          </Link>
          <Link to="/products" className={`transition-colors ${scrolled ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Products
          </Link>
          <Link to="/rental" className={`transition-colors ${scrolled ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Rental
          </Link>
          <Link to="/buyback" className={`transition-colors ${scrolled ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Liquidation
          </Link>
          <Link to="/about" className={`transition-colors ${scrolled ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            About
          </Link>
          <Link to="/contact" className={`transition-colors ${scrolled ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Contact Us
          </Link>
        </nav>

        {/* Right CTA Actions - User, Cart, RFQ Button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* User / Auth State */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-semibold shadow transition border border-[#D4A24C]/40"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#D4A24C]" />
                  Admin
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition backdrop-blur-sm ${
                    scrolled
                      ? 'bg-[#072117]/10 text-[#072117] border-[#072117]/20 hover:bg-[#072117]/20'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  {user.name.split(' ')[0]}
                </Link>
              )}
              <button
                onClick={logout}
                className={`p-2 transition rounded-full ${
                  scrolled ? 'text-[#072117]/70 hover:text-red-500 hover:bg-black/5' : 'text-white/70 hover:text-red-400 hover:bg-white/10'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`p-2.5 transition rounded-full ${
                scrolled
                  ? 'text-[#072117] hover:text-[#D4A24C] hover:bg-black/5'
                  : 'text-white hover:text-[#F59E0B] hover:bg-white/10'
              }`}
              title="Sign In / Account"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

          {/* Cart Icon - Al-Tooba Bag Style */}
          <Link
            to="/cart"
            className={`relative p-2.5 transition rounded-full ${
              scrolled
                ? 'text-[#072117] hover:text-[#D4A24C] hover:bg-black/5'
                : 'text-white hover:text-[#F59E0B] hover:bg-white/10'
            }`}
            title="Quotation Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4A24C] text-[#072117] rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Request Quote Main Button - Al-Tooba Gold Pill */}
          <button
            onClick={() => onOpenRFQ?.('General Bulk RFQ')}
            className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-gradient-to-r from-[#eec373] via-[#D4A24C] to-[#eec373] text-[#072117] text-xs font-sans font-extrabold uppercase tracking-wider shadow-[0_4px_16px_rgba(212,162,76,0.4)] hover:brightness-105 active:scale-95 transition-all items-center gap-1.5 cursor-pointer"
          >
            <span>Request RFQ</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#072117]" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full transition ${
              scrolled
                ? 'text-[#072117] hover:text-[#D4A24C] hover:bg-black/5'
                : 'text-white hover:text-[#F59E0B] hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation - Al-Tooba Sacred Forest Style */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#072117]/95 backdrop-blur-2xl text-white border-b border-[#D4A24C]/30 px-6 pt-6 pb-8 space-y-4 animate-in slide-in-from-top duration-300">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-white hover:text-[#F59E0B] border-b border-white/10"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-white hover:text-[#F59E0B] border-b border-white/10"
          >
            Products
          </Link>
          <Link
            to="/rental"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-white hover:text-[#F59E0B] border-b border-white/10"
          >
            Rental Calculator
          </Link>
          <Link
            to="/buyback"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-white hover:text-[#F59E0B] border-b border-white/10"
          >
            Asset Liquidation
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-white hover:text-[#F59E0B] border-b border-white/10"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-serif italic text-xl text-white hover:text-[#F59E0B] border-b border-white/10"
          >
            Contact
          </Link>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRFQ?.('Mobile General RFQ');
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#eec373] via-[#D4A24C] to-[#eec373] text-[#072117] font-extrabold text-xs uppercase tracking-widest text-center shadow-lg"
            >
              Request Quick RFQ
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
