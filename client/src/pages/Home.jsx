import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Laptop,
  Monitor,
  Cpu,
  Wrench,
  Recycle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  FileCheck2,
  BatteryCharging,
  HardDrive,
  Thermometer,
  ChevronDown,
  Send,
  Building,
  Phone,
  Star,
  Check
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import VideoReels from '../components/VideoReels';
import EnterpriseCategoryShowcase from '../components/EnterpriseCategoryShowcase';
import BestSellersSection from '../components/BestSellersSection';
import CompleteCollectionSection from '../components/CompleteCollectionSection';
import RentalCalculator from '../components/RentalCalculator';
import { useCompany } from '../context/SettingsContext';
import { AnimatedAccordion, AppleReveal, useReducedMotionSafe, APPLE_EASE } from '../animations';

export default function Home() {
  const { company } = useCompany();
  const shouldReduce = useReducedMotionSafe();
  const brandName = company?.brand_name || 'Demo Infotech';
  const brandShort = company?.brand_name_short || 'Demo';
  const brandTagline = company?.tagline || 'Enterprise Hardware Solutions';
  const { openRFQ } = useOutletContext();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const heroVideoRef = useRef(null);

  // Guarantee hero video playback on load
  useEffect(() => {
    if (heroVideoRef.current) {
      const playPromise = heroVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Hero video autoplay notice:', err);
        });
      }
    }
  }, []);

  // Helper to format specs for any hardware category
  const getProductSpecSummary = (p) => {
    if (p.category === 'monitor') {
      const parts = [p.specs?.screen_size, p.specs?.resolution, p.specs?.panel_type || p.specs?.ports].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'Full HD IPS Frameless Display';
    }
    if (p.category === 'charger') {
      const parts = [p.specs?.wattage, p.specs?.connector_type, p.specs?.compatibility].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'Fast-Charge Power Adapter';
    }
    if (p.category === 'desktop') {
      const parts = [p.specs?.processor, p.specs?.ram, p.specs?.storage || p.specs?.form_factor].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'Commercial Enterprise Desktop';
    }
    if (p.category === 'gpu') {
      const parts = [p.specs?.vram, p.specs?.cuda_cores, p.specs?.outputs].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'GDDR6 Workstation Graphics';
    }
    if (p.category === 'ram') {
      const parts = [p.specs?.ram, p.specs?.speed, p.specs?.form_factor].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'DDR4 High-Speed Memory';
    }
    if (p.category === 'cpu') {
      const parts = [p.specs?.cores_threads, p.specs?.clock_speed, p.specs?.socket].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'Enterprise Multi-Core Processor';
    }
    const laptopParts = [p.specs?.processor, p.specs?.ram, p.specs?.storage].filter(Boolean);
    if (laptopParts.length > 0) return laptopParts.join(' • ');

    if (p.specs && typeof p.specs === 'object') {
      const generic = Object.values(p.specs).filter((v) => typeof v === 'string' && v.trim());
      if (generic.length > 0) return generic.slice(0, 3).join(' • ');
    }

    return p.description || 'Enterprise Grade A+ Hardware';
  };

  // Helper to ensure genuine hardware imagery
  const getProductImage = (p) => {
    const url = p.images?.[0]?.url;
    if (!url || url.includes('photo-1544717305-2782549b5136') || p.slug?.includes('hp-elitebook')) {
      return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80';
    }
    return url;
  };

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Buyback Quick Form State
  const [buybackForm, setBuybackForm] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    asset_type: 'Used Laptops (ThinkPad, Dell, HP)',
    approx_quantity: 20,
    city: 'Delhi NCR'
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products/featured/list');
        if (res.data.success) {
          setFeaturedProducts(res.data.featured || []);
        }
      } catch (err) {
        console.error('[Error fetching featured products]', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleBuybackSubmit = async (e) => {
    e.preventDefault();
    if (!buybackForm.company_name || !buybackForm.phone) {
      toast.error('Please enter Company Name and Phone number.');
      return;
    }

    try {
      const res = await api.post('/buyback', buybackForm);
      if (res.data.success) {
        toast.success('Asset liquidation request logged! Our valuer will connect shortly.');
        setBuybackForm({
          company_name: '',
          contact_person: '',
          phone: '',
          asset_type: 'Used Laptops (ThinkPad, Dell, HP)',
          approx_quantity: 20,
          city: 'Delhi NCR'
        });
      }
    } catch (err) {
      toast.error('Failed to submit asset liquidation request.');
    }
  };



  const faqs = [
    {
      q: 'Can our company claim 100% GST input tax credit on purchases and rentals?',
      a: 'Yes, absolutely. We issue a formal Tax Invoice carrying your company’s 15-digit GSTIN number for all hardware purchases, component orders, and monthly rental contracts. Your accounting team can claim 18% GST input credit seamlessly on GSTR-2B.'
    },
    {
      q: 'What happens if a rental laptop breaks down or develops a fault?',
      a: 'Our B2B rental contracts include an ironclad 24 to 48-hour hardware replacement SLA. If a laptop screen, motherboard, or keyboard fails during working hours, our technician will visit your office with an equivalent standby machine to swap it immediately so your employee faces zero downtime.'
    },
    {
      q: 'Are the refurbished laptops genuinely Grade A+ enterprise machines?',
      a: 'We deal exclusively in tier-1 commercial series laptops (ThinkPad, Dell Latitude, HP EliteBook) sourced directly from corporate refresh cycles. Unlike plastic consumer laptops, these feature magnesium-alloy roll cages, spill-resistant keyboards, and military-grade durability. Each unit undergoes our 30-point diagnostics before dispatch.'
    },
    {
      q: 'Can we test sample machines before placing a 50+ unit order?',
      a: 'Yes! For orders of 15 units or more, we deliver 1 or 2 evaluation units to your office location for a 3-day testing window. Your IT team can install custom company images, check performance metrics, and test battery life before signing off on the bulk fleet contract.'
    }
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#111827]">
      <Helmet>
        <title>{brandName} | {brandTagline}</title>
        <meta
          name="description"
          content={`${brandName} - Corporate IT hardware partner in India. Grade A+ enterprise refurbished laptops, flexible rental leases, and asset liquidation with 24-48h standby replacement SLA.`}
        />
      </Helmet>
      {/* 1. HERO SECTION - ULTRA-RESPONSIVE FULL VIEWPORT LAYOUT */}
      <section className="relative w-full min-h-[100svh] sm:h-screen sm:min-h-[640px] flex flex-col justify-center overflow-hidden bg-[#072117] text-white pt-24 pb-16 sm:py-0 px-5 sm:px-8 border-b border-[#D4A24C]/30">
        {/* Ambient Video Background - Dedicated Enterprise Corporate Suite */}
        <video
          ref={heroVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/hero-ambient-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-85 filter contrast-105 brightness-100 pointer-events-none"
        >
          <source src="/videos/hero-ambient.mp4" type="video/mp4" />
        </video>

        {/* Ambient Video Overlay Gradient - Crisp Visibility Across All Screens */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#072117]/40 via-transparent to-[#072117]/85 z-[1] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#072117]/90 via-[#072117]/40 to-transparent z-[1] pointer-events-none hidden lg:block"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#D4A24C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-[1]"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full my-auto">
          {/* Left Column: Al-Tooba Style Typography & Responsive CTAs */}
          <div className="lg:col-span-7 space-y-4">
            {/* Majestic Heading - Responsive across mobile, laptop, desktop */}
            <motion.h1
              initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: APPLE_EASE }}
              className="text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-normal tracking-tight text-white font-serif leading-[1.14] sm:leading-[1.12] drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
            >
              Authentic <span className="text-[#F59E0B] italic font-serif font-extrabold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">Laptops & Systems,</span> <br />
              proven <span className="text-[#F59E0B] italic font-serif font-extrabold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">performance.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: APPLE_EASE }}
              className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-medium max-w-lg"
            >
              Equip your enterprise workforce with certified Grade A+ commercial laptops, workstation graphics, and pivot displays. Available for immediate bulk dispatch or flexible monthly leasing with guaranteed 24-48h replacement SLA.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: APPLE_EASE }}
              className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3"
            >
              <Link
                to="/products"
                className="group relative overflow-hidden rounded-full px-6 sm:px-7 py-3 text-xs font-sans font-extrabold uppercase tracking-[0.12em] sm:tracking-[0.15em] bg-gradient-to-r from-[#eec373] via-[#D4A24C] to-[#eec373] text-[#072117] shadow-[0_8px_25px_rgba(212,162,76,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>EXPLORE INVENTORY</span>
                  <ArrowRight className="w-4 h-4 text-[#072117]" />
                </span>
                <div className="absolute inset-0 bg-white/25 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </Link>

              <a
                href="#rental-calculator"
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition flex items-center justify-center gap-2 shadow-sm text-center whitespace-nowrap"
              >
                <Calculator className="w-4 h-4 text-[#D4A24C]" />
                <span>Rental Calculator</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Completely unobstructed for full ambient video visibility */}
          <div className="lg:col-span-5 hidden lg:block" />
        </div>
      </section>

      {/* 2. AL-TOOBA RUNNING GOLD TICKER MARQUEE STRIP */}
      <div className="w-full bg-[#183623] border-b border-[#D4A24C]/30 py-3.5 sm:py-4 overflow-hidden relative z-10 [contain:paint]">
        <div className="animate-marquee">
          <div className="flex shrink-0 items-center gap-10 sm:gap-14 text-white/90 font-serif italic text-sm sm:text-base pr-10 sm:pr-14">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="flex items-center gap-4 sm:gap-6 shrink-0">
                <span>Enterprise Refurbished Hardware to Perfection</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  • {brandName.toUpperCase()}
                </span>
                <span>24-48h Standby Replacement SLA</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  • GST TAX INVOICED
                </span>
                <span>Grade A+ 30-Point Rigorously Certified</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  • ZERO HIDDEN CHARGES
                </span>
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-10 sm:gap-14 text-white/90 font-serif italic text-sm sm:text-base pr-10 sm:pr-14" aria-hidden="true">
            {[...Array(3)].map((_, i) => (
              <span key={`dup-${i}`} className="flex items-center gap-4 sm:gap-6 shrink-0">
                <span>Enterprise Refurbished Hardware to Perfection</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  • {brandName.toUpperCase()}
                </span>
                <span>24-48h Standby Replacement SLA</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  • GST TAX INVOICED
                </span>
                <span>Grade A+ 30-Point Rigorously Certified</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  • ZERO HIDDEN CHARGES
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-12 sm:space-y-16 pt-6 sm:pt-8 pb-16">
        {/* 3. ENTERPRISE HARDWARE SHOWCASE */}
        <EnterpriseCategoryShowcase />

        {/* 4. AL-TOOBA 1:1 OUR BEST SELLERS SECTION */}
        <BestSellersSection onOpenRFQ={openRFQ} />

        {/* 5. ASYMMETRIC BENTO GRID - 5 CORE SOLUTIONS (AL-TOOBA HAMPERS STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A24C] font-semibold block">
            — END-TO-END IT INFRASTRUCTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0D3B2A] font-serif">
            Enterprise Solutions & Packages
          </h2>
          <p className="text-sm text-[#5A6B63]">
            Whether provisioning 10 laptops or setting up a 500-seat corporate center, we deliver reliable solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Major Bento Card (Span 7) */}
          <div className="lg:col-span-7 bg-[#0D3B2A] text-[#FAF7F2] rounded-3xl p-8 sm:p-10 border border-[#D4A24C]/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-5 relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-[#D4A24C] text-[#0D3B2A] text-[10px] font-bold uppercase tracking-widest inline-block">
                Most Preferred by Enterprises
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#FAF7F2] leading-tight">
                Corporate Laptop Rentals with <br />
                <span className="italic text-[#D4A24C]">Zero CAPEX & On-Site SLA</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Rent top-grade Core i5 and i7 business laptops on flexible monthly contracts. 100% operational expense (OPEX) tax write-off, free repair maintenance, and standby replacements within 24–48 hours.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 border-t border-[#D4A24C]/20 text-slate-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A24C]" /> Standby Backup Laptops Included
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A24C]" /> 18% GST Input Credit with Tax Invoices
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A24C]" /> Minimum Tenure: 1 to 36 Months
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A24C]" /> Free OS Imaging & Deployment
                </div>
              </div>
            </div>

            <div className="pt-8 relative z-10">
              <button
                onClick={() => openRFQ('Corporate Rental Lease Inquiry')}
                className="px-8 py-3.5 rounded-full bg-[#D4A24C] hover:bg-[#c5943b] text-[#0D3B2A] font-bold text-xs uppercase tracking-widest shadow transition flex items-center gap-2"
              >
                <span>Inquire Rental Rates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Stacked Bento Cards (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Card 1: Bulk Sourcing */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D4A24C]/30 shadow-sm hover:shadow-md transition space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4A24C] font-bold">
                Wholesale Sourcing
              </span>
              <h4 className="font-serif text-lg font-bold text-[#0D3B2A]">
                Direct Bulk Supply (ThinkPad/Dell/HP)
              </h4>
              <p className="text-xs text-[#5A6B63] leading-relaxed">
                Wholesale procurement of commercial laptops, desktops, and displays. 60% lower costs than brand-new retail with genuine Windows licensing.
              </p>
              <button
                onClick={() => openRFQ('Bulk Laptop Supply')}
                className="text-xs font-bold text-[#0D3B2A] hover:text-[#D4A24C] flex items-center gap-1 pt-1"
              >
                <span>Explore Bulk Supply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Asset Buyback */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D4A24C]/30 shadow-sm hover:shadow-md transition space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4A24C] font-bold">
                Corporate ITAD
              </span>
              <h4 className="font-serif text-lg font-bold text-[#0D3B2A]">
                E-Waste Buyback & Asset Liquidation
              </h4>
              <p className="text-xs text-[#5A6B63] leading-relaxed">
                Upgrading office machines? We buy outdated laptops and servers with NIST 800-88 certified data wipe and immediate wire payout.
              </p>
              <Link
                to="/buyback"
                className="text-xs font-bold text-[#0D3B2A] hover:text-[#D4A24C] flex items-center gap-1 pt-1"
              >
                <span>Calculate Asset Valuation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AL-TOOBA 1:1 OUR COMPLETE COLLECTION - RENTING & SELLING FLEETS */}
      <CompleteCollectionSection onOpenRFQ={openRFQ} />

      {/* 7. 3D VIDEO REELS CAROUSEL (Temporarily disabled as requested) */}
      {/* <VideoReels /> */}

      {/* 7. SPIRITUAL / CORE VALUE BANNER (AL-TOOBA SIGNATURE QUOTE) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-[#FAF7F2] border-2 border-[#D4A24C]/40 rounded-3xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
          <div className="w-12 h-0.5 bg-[#D4A24C] mx-auto mb-4 opacity-60"></div>
          <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#0D3B2A] leading-relaxed max-w-3xl mx-auto">
            "Indeed, trade is blessed with growth and longevity when conducted with truthfulness, transparent terms, and zero compromise on quality."
          </blockquote>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4A24C] font-bold mt-4 font-sans">
            — THE COMMITMENT TO UNCOMPROMISED HARDWARE INTEGRITY
          </p>
        </div>
      </section>

      {/* 8. COMPACT LUXURY CORPORATE RENTAL CALCULATOR */}
      <RentalCalculator onOpenRFQ={openRFQ} />

      {/* 8. 30-POINT TESTING PROTOCOL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A24C] font-semibold block">
            — ZERO DEFECT COMMITMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0D3B2A] font-serif">
            Our 30-Point Testing Protocol
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Every single laptop and component undergoes rigorous diagnostic stress-testing before delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-6 rounded-3xl bg-white border border-[#D4A24C]/30 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F3E8D2] text-[#0D3B2A] flex items-center justify-center font-bold">
              <BatteryCharging className="w-5 h-5 text-[#0D3B2A]" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#0D3B2A]">Battery & Charger Health</h4>
            <p className="text-[#5A6B63] leading-relaxed">
              Minimum 80%+ battery health retention verified. Weak battery cells are rejected and OEM original chargers are tested under full load.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#D4A24C]/30 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F3E8D2] text-[#0D3B2A] flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5 text-[#0D3B2A]" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#0D3B2A]">SSD & RAM Diagnostics</h4>
            <p className="text-[#5A6B63] leading-relaxed">
              MemTest86 memory benchmark tests and CrystalDiskInfo 100% SMART health checks to verify 0 bad sectors on NVMe drives.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#D4A24C]/30 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F3E8D2] text-[#0D3B2A] flex items-center justify-center font-bold">
              <Thermometer className="w-5 h-5 text-[#0D3B2A]" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#0D3B2A]">Thermal Repasting & Clean</h4>
            <p className="text-[#5A6B63] leading-relaxed">
              Internal heatsink fan overhaul and fresh Arctic MX-4 thermal paste application to eliminate thermal throttling under heavy workloads.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#D4A24C]/30 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F3E8D2] text-[#0D3B2A] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#0D3B2A]" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#0D3B2A]">Clean Legal Enterprise Title</h4>
            <p className="text-[#5A6B63] leading-relaxed">
              Sourced legally from corporate asset refreshes with serial number logging, full GST tax invoicing, and clear ownership documentation.
            </p>
          </div>
        </div>
      </section>

      {/* 9. QUICK BUYBACK / LIQUIDATION VALUATION FORM */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D4A24C]/40 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-bold bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/30 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                Asset Liquidation
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#0D3B2A] leading-tight">
                Got Outdated Office Hardware? We Buy In Bulk.
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6B63] leading-relaxed">
                If your company is replacing older laptops, desktop towers, or LCD screens, don't let them gather dust. We purchase used IT hardware lots from 10 to 1,000+ units with certified data wiping and instant payment.
              </p>
              <ul className="text-xs text-[#0D3B2A] space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A24C]" /> Free on-site hardware inspection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A24C]" /> NIST 800-88 compliant secure data wiping
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4A24C]" /> Doorstep collection across India
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 bg-[#FAF7F2] p-6 sm:p-7 rounded-3xl border border-[#D4A24C]/30 shadow-inner">
              <form onSubmit={handleBuybackSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-lg font-bold text-[#0D3B2A]">Get Instant Asset Valuation</h3>

                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex FinTech Solutions"
                    value={buybackForm.company_name}
                    onChange={(e) => setBuybackForm({ ...buybackForm, company_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D4A24C]/30 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0D3B2A] mb-1">Contact Person</label>
                    <input
                      type="text"
                      placeholder="e.g. IT Manager"
                      value={buybackForm.contact_person}
                      onChange={(e) => setBuybackForm({ ...buybackForm, contact_person: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D4A24C]/30 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0D3B2A] mb-1">WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={buybackForm.phone}
                      onChange={(e) => setBuybackForm({ ...buybackForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D4A24C]/30 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0D3B2A] mb-1">Approx Quantity</label>
                    <input
                      type="number"
                      value={buybackForm.approx_quantity}
                      onChange={(e) => setBuybackForm({ ...buybackForm, approx_quantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D4A24C]/30 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0D3B2A] mb-1">Office City</label>
                    <input
                      type="text"
                      value={buybackForm.city}
                      onChange={(e) => setBuybackForm({ ...buybackForm, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D4A24C]/30 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold uppercase tracking-wider transition shadow border border-[#D4A24C]/40"
                >
                  Request Asset Valuation Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PROCUREMENT FAQ ACCORDION */}
      <AppleReveal className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A24C] font-semibold block">
            — TRANSPARENCY & CLARITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#0D3B2A]">
            Frequently Asked Procurement Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                onClick={() => setExpandedFaq(isExpanded ? null : index)}
                className="bg-white rounded-2xl border border-[#D4A24C]/30 p-5 cursor-pointer hover:border-[#D4A24C] transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-serif text-sm font-bold text-[#0D3B2A]">{faq.q}</h4>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4A24C] transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <AnimatedAccordion isOpen={isExpanded}>
                  <p className="text-xs text-[#5A6B63] mt-3 leading-relaxed border-t border-[#FAF7F2] pt-3">
                    {faq.a}
                  </p>
                </AnimatedAccordion>
              </div>
            );
          })}
        </div>
      </AppleReveal>
      </div>
    </div>
  );
}
