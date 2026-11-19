import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import BrandLogo from './BrandLogo';

export default function Navbar({ onOpenRFQ }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isSolidNav = !isHome || scrolled;

  // Scroll detection for seamless transparent-to-frosted glass transition on Home
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
        isSolidNav
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D4A24C]/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
          : 'bg-gradient-to-b from-black/75 via-black/35 to-transparent border-b border-transparent'
      }`}
    >
      {/* Main Transparent / Frosted Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Unified Single Source Asset */}
        <BrandLogo isSolidNav={isSolidNav} className="shrink-0" />

        {/* Desktop Navigation Links - Switches White to Deep Emerald on Scroll */}
        <nav className={`hidden lg:flex items-center space-x-4 xl:space-x-7 text-[11px] xl:text-[12px] uppercase font-bold tracking-[0.12em] xl:tracking-[0.16em] transition-colors whitespace-nowrap ${
          isSolidNav ? 'text-[#072117]' : 'text-white'
        }`}>
          <Link to="/" className={`transition-colors ${isSolidNav ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Home
          </Link>
          <Link to="/products" className={`transition-colors ${isSolidNav ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Products
          </Link>
          <Link to="/rental" className={`transition-colors ${isSolidNav ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Rental
          </Link>
          <Link to="/buyback" className={`transition-colors ${isSolidNav ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Liquidation
          </Link>
          <Link to="/about" className={`transition-colors ${isSolidNav ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            About
          </Link>
          <Link to="/contact" className={`transition-colors ${isSolidNav ? 'hover:text-[#D4A24C]' : 'hover:text-[#F59E0B] drop-shadow-sm'}`}>
            Contact Us
          </Link>
        </nav>

        {/* Right CTA Actions - User, Cart, RFQ Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* User / Auth State */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-semibold shadow transition border border-[#D4A24C]/40 whitespace-nowrap shrink-0"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#D4A24C]" />
                    Admin
                  </Link>
                  <Link
                    to="/admin"
                    className={`sm:hidden p-2 transition rounded-full ${
                      isSolidNav ? 'text-[#072117] hover:bg-black/5' : 'text-white hover:bg-white/10'
                    }`}
                    title="Admin Console"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#D4A24C]" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition backdrop-blur-sm whitespace-nowrap shrink-0 ${
                      isSolidNav
                        ? 'bg-[#072117]/10 text-[#072117] border-[#072117]/20 hover:bg-[#072117]/20'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    {user.name.split(' ')[0]}
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`sm:hidden p-2 transition rounded-full ${
                      isSolidNav ? 'text-[#072117] hover:bg-black/5' : 'text-white hover:bg-white/10'
                    }`}
                    title="Account Dashboard"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className={`hidden sm:inline-flex p-2 transition rounded-full shrink-0 ${
                  isSolidNav ? 'text-[#072117]/70 hover:text-red-500 hover:bg-black/5' : 'text-white/70 hover:text-red-400 hover:bg-white/10'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`p-2.5 transition rounded-full shrink-0 ${
                isSolidNav
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
            className={`relative p-2.5 transition rounded-full shrink-0 ${
              isSolidNav
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

          {/* Request Quote Main Button - Elegant Gold Pill (Never Wraps) */}
          <button
            type="button"
            onClick={() => onOpenRFQ?.('General Bulk RFQ')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e5b663] via-[#D4A24C] to-[#c99238] hover:brightness-105 text-[#072117] text-xs font-sans font-extrabold uppercase tracking-wider shadow-[0_4px_14px_rgba(212,162,76,0.35)] active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Request RFQ</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#072117]" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full transition ${
              isSolidNav
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

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRFQ?.('Mobile General RFQ');
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#eec373] via-[#D4A24C] to-[#eec373] text-[#072117] font-extrabold text-xs uppercase tracking-widest text-center shadow-lg cursor-pointer"
            >
              Request Quick RFQ
            </button>

            {user ? (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/70 px-1">
                  <span>Signed in as <strong className="text-white">{user.name}</strong></span>
                  {isAdmin && <span className="bg-[#D4A24C] text-[#072117] text-[10px] font-bold px-2 py-0.5 rounded">ADMIN</span>}
                </div>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition"
                  >
                    Admin Management Console
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition"
                  >
                    Customer Dashboard & Orders
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left py-2 px-3 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-white/10 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center rounded-xl bg-[#D4A24C] text-[#072117] text-xs font-bold hover:brightness-105 transition"
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
