import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
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
  Sparkles,
  Send,
  Building,
  Phone,
  Star,
  Check
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import VideoReels from '../components/VideoReels';

export default function Home() {
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

  // Rental Calculator State
  const [calcTier, setCalcTier] = useState({
    key: 'standard',
    basePrice: 1350,
    name: 'Office Essential (Core i5)'
  });
  const [calcQty, setCalcQty] = useState(15);
  const [calcDuration, setCalcDuration] = useState({
    key: '6m',
    multiplier: 1.0,
    name: '6 Months (Std)'
  });
  const [includeGst, setIncludeGst] = useState(false);

  // Helper to format specs for any hardware category
  const getProductSpecSummary = (p) => {
    if (p.category === 'monitor') {
      const parts = [p.specs?.screen_size, p.specs?.ports, p.specs?.ergonomics].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'Full HD IPS Frameless Display';
    }
    if (p.category === 'gpu') {
      const parts = [p.specs?.vram, p.specs?.cuda_cores, p.specs?.outputs].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'GDDR6 Workstation Graphics';
    }
    if (p.category === 'ram') {
      const parts = [p.specs?.ram, p.specs?.speed, p.specs?.form_factor].filter(Boolean);
      return parts.length > 0 ? parts.join(' • ') : 'DDR4 High-Speed Memory';
    }
    const laptopParts = [p.specs?.processor, p.specs?.ram, p.specs?.storage].filter(Boolean);
    if (laptopParts.length > 0) return laptopParts.join(' • ');
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

  const volumeDiscountPercent = calcQty >= 100 ? 10 : calcQty >= 50 ? 5 : 0;
  const basePerUnit = Math.round(calcTier.basePrice * calcDuration.multiplier);
  const perUnitRental = Math.round(basePerUnit * (1 - volumeDiscountPercent / 100));
  const subtotalMonthly = perUnitRental * calcQty;
  const gstAmount = Math.round(subtotalMonthly * 0.18);
  const totalMonthlyRental = includeGst ? subtotalMonthly + gstAmount : subtotalMonthly;

  const handleRentalBook = () => {
    const context = `Rental Fleet: ${calcQty}x ${calcTier.name} for ${calcDuration.name} (Subtotal: ₹${subtotalMonthly.toLocaleString('en-IN')}/mo${includeGst ? ' + 18% GST: ₹' + totalMonthlyRental.toLocaleString('en-IN') : ''})`;
    openRFQ(context);
  };

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

  const categoriesMoorish = [
    {
      id: 'laptop',
      name: 'ThinkPad Fleets',
      count: '85+ Fleets Ready',
      desc: 'T480, T490 & T14 Enterprise Series',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'monitor',
      name: 'Frameless IPS Displays',
      count: '120+ Units Ready',
      desc: 'Dell 24" & 27" Height Pivot Ergonomic',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'gpu',
      name: 'AI & VFX Graphics',
      count: '24+ Workstations',
      desc: 'NVIDIA RTX 3060 / 3070 12GB VRAM',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'ram',
      name: 'Certified Memory',
      count: '350+ Sticks',
      desc: 'Samsung & Micron 16GB/32GB DDR4',
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80'
    }
  ];

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
            <h1 className="text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-normal tracking-tight text-white font-serif leading-[1.14] sm:leading-[1.12] drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] select-none">
              Authentic <span className="text-[#F59E0B] italic font-serif font-extrabold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">IT Fleets,</span> <br />
              proven <span className="text-[#F59E0B] italic font-serif font-extrabold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">performance.</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-medium max-w-lg">
              Equip your enterprise workforce with certified Grade A+ commercial fleets, workstation graphics, and pivot displays. Available for immediate bulk dispatch or flexible monthly leasing with guaranteed 24-48h replacement SLA.
            </p>

            {/* Action Buttons - Clean 2-Row Stack on Mobile, 1-Row Flow on Desktop */}
            <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => openRFQ('Priority Fleet Requirement')}
                className="group relative overflow-hidden rounded-full px-6 sm:px-7 py-3 text-xs font-sans font-extrabold uppercase tracking-[0.12em] sm:tracking-[0.15em] bg-gradient-to-r from-[#eec373] via-[#D4A24C] to-[#eec373] text-[#072117] shadow-[0_8px_25px_rgba(212,162,76,0.45)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>EXPLORE INVENTORY</span>
                  <ArrowRight className="w-4 h-4 text-[#072117]" />
                </span>
                <div className="absolute inset-0 bg-white/25 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </button>

              <div className="flex items-center gap-2 sm:gap-2.5">
                <a
                  href="#video-reels"
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-black/55 hover:bg-black/80 text-white border border-[#D4A24C]/60 font-bold text-[11px] sm:text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-lg text-center whitespace-nowrap"
                >
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
                  <span>▶ Watch Reels</span>
                </a>

                <a
                  href="#rental-calculator"
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider backdrop-blur-md transition flex items-center justify-center gap-1.5 shadow-sm text-center whitespace-nowrap"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#D4A24C]" />
                  <span>Calculator</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Completely unobstructed for full ambient video visibility */}
          <div className="lg:col-span-5 hidden lg:block" />
        </div>
      </section>

      {/* 2. AL-TOOBA RUNNING GOLD TICKER MARQUEE STRIP */}
      <div className="w-full bg-[#183623] border-b border-[#D4A24C]/30 py-3.5 sm:py-4 overflow-hidden relative z-10 select-none [contain:paint]">
        <div className="animate-marquee">
          <div className="flex shrink-0 items-center gap-10 sm:gap-14 text-white/90 font-serif italic text-sm sm:text-base pr-10 sm:pr-14">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="flex items-center gap-4 sm:gap-6 shrink-0">
                <span>Enterprise Refurbished Hardware to Perfection</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  ✦ NOVA INFOTECH
                </span>
                <span>24-48h Pan-India Replacement SLA</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  ✦ 100% GSTR-2B TAX CREDIT
                </span>
                <span>Grade A+ 30-Point Rigorously Certified</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  ✦ ZERO HIDDEN CHARGES
                </span>
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-10 sm:gap-14 text-white/90 font-serif italic text-sm sm:text-base pr-10 sm:pr-14" aria-hidden="true">
            {[...Array(3)].map((_, i) => (
              <span key={`dup-${i}`} className="flex items-center gap-4 sm:gap-6 shrink-0">
                <span>Enterprise Refurbished Hardware to Perfection</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  ✦ NOVA INFOTECH
                </span>
                <span>24-48h Pan-India Replacement SLA</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  ✦ 100% GSTR-2B TAX CREDIT
                </span>
                <span>Grade A+ 30-Point Rigorously Certified</span>
                <span className="text-[#F59E0B] font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  ✦ ZERO HIDDEN CHARGES
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-20 pt-16 pb-20">
        {/* 3. AL-TOOBA SIGNATURE MOORISH ARCH CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A24C] font-semibold block">
            — DISCOVER BY HARDWARE FLEET
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0D3B2A] font-serif">
            Shop by Commercial Categories
          </h2>
          <p className="text-sm text-[#5A6B63]">
            Sourced directly from verified corporate refresh cycles, stress-tested and Grade A+ guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesMoorish.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="arch-card bg-white border border-[#D4A24C]/40 hover:border-[#D4A24C] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center space-y-4"
            >
              <div className="w-36 h-36 rounded-full bg-[#FAF7F2] border border-[#D4A24C]/20 p-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition duration-300">
                <img src={cat.image} alt={cat.name} className="h-full object-contain" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#F3E8D2] text-[#0D3B2A] text-[10px] font-bold tracking-widest uppercase mb-2">
                  {cat.count}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0D3B2A] group-hover:text-[#D4A24C] transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#5A6B63] mt-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. ASYMMETRIC BENTO GRID - 5 CORE SOLUTIONS (AL-TOOBA HAMPERS STYLE) */}
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
                  <Check className="w-4 h-4 text-[#D4A24C]" /> 18% GST Input Credit on GSTR-2B
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

      {/* 5. FEATURED COMMERCIAL HARDWARE - AL-TOOBA LUXURY PRODUCT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A24C] font-semibold block">
              — VERIFIED INVENTORY CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#0D3B2A] font-serif mt-1">
              Featured Commercial Hardware
            </h2>
            <p className="text-[#5A6B63] text-xs sm:text-sm mt-1">
              Grade A+ tested units available for immediate dispatch or rental lease.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-[#0D3B2A] hover:text-[#D4A24C] flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All Inventory</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A24C]" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white rounded-3xl border border-[#D4A24C]/20 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-3xl p-6 border border-[#0D3B2A]/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,59,42,0.08)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#F3E8D2] text-[#0D3B2A] tracking-wider uppercase">
                      {p.category.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-[#5A6B63] font-semibold">
                      Stock: {p.stock_quantity} Units
                    </span>
                  </div>

                  <div className="h-48 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/15 flex items-center justify-center p-4 mb-4 overflow-hidden">
                    <img
                      src={getProductImage(p)}
                      alt={p.title}
                      className="h-full object-contain group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Rating Stars - Al-Tooba Style */}
                  <div className="flex items-center gap-1 text-[#D4A24C] text-xs mb-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current text-[#D4A24C]" />
                    ))}
                    <span className="text-slate-600 font-semibold text-[11px] ml-1">4.9 (Grade A+)</span>
                  </div>

                  <Link to={`/products/${p.slug}`} className="hover:text-[#D4A24C] transition">
                    <h3 className="font-serif text-base font-bold text-[#0D3B2A] line-clamp-1">{p.title}</h3>
                  </Link>

                  <p className="text-xs text-[#5A6B63] mt-1 line-clamp-2 min-h-[32px] font-mono text-[11px]">
                    {getProductSpecSummary(p)}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#D4A24C]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#5A6B63] uppercase tracking-wider block font-semibold">
                      Buy / Rent
                    </span>
                    <span className="text-base font-bold text-[#0D3B2A] font-serif">
                      ₹{p.sale_price.toLocaleString('en-IN')}{' '}
                      {p.rental_price_monthly > 0 && (
                        <span className="text-xs text-[#D4A24C] font-normal font-sans">
                          or ₹{p.rental_price_monthly.toLocaleString('en-IN')}/mo
                        </span>
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => openRFQ(`${p.title} (${p.stock_quantity} in stock)`)}
                    className="px-5 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider border border-[#D4A24C]/40 transition shadow"
                  >
                    Inquire Bulk
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. AL-TOOBA STYLE 3D VIDEO REELS CAROUSEL */}
      <VideoReels />

      {/* 7. SPIRITUAL / CORE VALUE BANNER (AL-TOOBA SIGNATURE QUOTE) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-[#FAF7F2] border-2 border-[#D4A24C]/40 rounded-3xl p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
          <div className="text-[#D4A24C] text-sm tracking-[0.3em] font-serif mb-3">✦ ✦ ✦</div>
          <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#0D3B2A] leading-relaxed max-w-3xl mx-auto">
            "Indeed, trade is blessed with growth and longevity when conducted with truthfulness, transparent terms, and zero compromise on quality."
          </blockquote>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4A24C] font-bold mt-4 font-sans">
            — THE COMMITMENT TO UNCOMPROMISED HARDWARE INTEGRITY
          </p>
        </div>
      </section>

      {/* 7. INTERACTIVE CORPORATE RENTAL CALCULATOR - AL-TOOBA DARK FOREST STYLE */}
      <section id="rental-calculator" className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="bg-[#072117] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#D4A24C]/40 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4A24C] font-bold">
              Instant Operating Cost Projection
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#FAF7F2]">
              Interactive Corporate Rental Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Customize device tier, fleet size, and tenure with zero maintenance overhead and GSTR-2B input credit.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Tier Selection */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#D4A24C] font-bold mb-3">
                  1. Machine Configuration Tier
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
                    className={`p-3.5 rounded-2xl text-left border transition ${
                      calcTier.key === 'standard'
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-white shadow-md'
                        : 'bg-black/30 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="font-bold block font-serif">Office Essential</span>
                    <span className="text-[11px] opacity-80 block">Core i5 • 8GB • SSD</span>
                    <span className="text-xs font-mono mt-2 block font-semibold text-[#D4A24C]">
                      ₹1,350/mo
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      setCalcTier({
                        key: 'developer',
                        basePrice: 1850,
                        name: 'Developer Pro (Core i7)'
                      })
                    }
                    className={`p-3.5 rounded-2xl text-left border transition ${
                      calcTier.key === 'developer'
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-white shadow-md'
                        : 'bg-black/30 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="font-bold block font-serif">Developer Pro</span>
                    <span className="text-[11px] opacity-80 block">Core i7 • 16GB • NVMe</span>
                    <span className="text-xs font-mono mt-2 block font-semibold text-[#D4A24C]">
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
                    className={`p-3.5 rounded-2xl text-left border transition ${
                      calcTier.key === 'workstation'
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-white shadow-md'
                        : 'bg-black/30 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span className="font-bold block font-serif">VFX / GPU Rig</span>
                    <span className="text-[11px] opacity-80 block">32GB • RTX Graphics</span>
                    <span className="text-xs font-mono mt-2 block font-semibold text-[#D4A24C]">
                      ₹3,200/mo
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. Quantity Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono uppercase text-[#D4A24C] font-bold">
                    2. Device Fleet Quantity
                  </label>
                  <span className="text-sm font-bold font-mono text-[#D4A24C] bg-[#0D3B2A] px-3 py-1 rounded-full border border-[#D4A24C]/40">
                    {calcQty} Laptops
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={calcQty}
                  onChange={(e) => setCalcQty(Number(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#D4A24C]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>5 Units (MOQ)</span>
                  <span>50 Units</span>
                  <span>100 Units</span>
                  <span>150+ Units</span>
                </div>
              </div>

              {/* 3. Duration Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#D4A24C] font-bold mb-3">
                  3. Contract Tenure
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() =>
                      setCalcDuration({ key: '1-3m', multiplier: 1.15, name: '1–3 Months' })
                    }
                    className={`py-2.5 rounded-full font-bold border transition ${
                      calcDuration.key === '1-3m'
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-white'
                        : 'bg-black/30 border-slate-700 text-slate-300'
                    }`}
                  >
                    1–3 Months
                  </button>
                  <button
                    onClick={() =>
                      setCalcDuration({ key: '6m', multiplier: 1.0, name: '6 Months (Std)' })
                    }
                    className={`py-2.5 rounded-full font-bold border transition ${
                      calcDuration.key === '6m'
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-white'
                        : 'bg-black/30 border-slate-700 text-slate-300'
                    }`}
                  >
                    6 Months
                  </button>
                  <button
                    onClick={() =>
                      setCalcDuration({ key: '12m', multiplier: 0.85, name: '12+ Months (15% Off)' })
                    }
                    className={`py-2.5 rounded-full font-bold border transition ${
                      calcDuration.key === '12m'
                        ? 'bg-[#0D3B2A] border-[#D4A24C] text-white'
                        : 'bg-black/30 border-slate-700 text-slate-300'
                    }`}
                  >
                    12+ Mo (15% Off)
                  </button>
                </div>
              </div>
            </div>

            {/* Estimate Summary Box */}
            <div className="lg:col-span-5 bg-[#0D3B2A]/90 p-6 sm:p-7 rounded-3xl border border-[#D4A24C]/40 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-300 font-mono font-semibold">
                  Fleet Quotation Estimate
                </span>
                {volumeDiscountPercent > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4A24C] text-[#0D3B2A] text-[10px] font-bold">
                    {volumeDiscountPercent}% Fleet Rebate Applied
                  </span>
                )}
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#D4A24C] font-mono">
                  ₹{totalMonthlyRental.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-slate-300 font-sans">
                    {includeGst ? '/ month (Incl. 18% GST)' : '/ month + 18% GST'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-300 bg-black/30 px-3 py-2 rounded-2xl border border-slate-700">
                  <span>Include 18% GST in Display</span>
                  <button
                    type="button"
                    onClick={() => setIncludeGst(!includeGst)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                      includeGst ? 'bg-[#D4A24C]' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        includeGst ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              <p className="text-xs text-emerald-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A24C]" /> 24-48h SLA swap standby machines & on-site repair included
              </p>

              <div className="space-y-2 text-xs text-slate-200 pt-3 border-t border-[#D4A24C]/20">
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Tier:</span>
                  <span className="font-semibold text-white">{calcTier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fleet Volume:</span>
                  <span className="font-semibold text-white">{calcQty} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tenure:</span>
                  <span className="font-semibold text-white">{calcDuration.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Rate Per Unit:</span>
                  <span className="font-semibold text-[#D4A24C]">₹{perUnitRental}/mo</span>
                </div>
                {includeGst && (
                  <div className="flex justify-between text-slate-300 border-t border-slate-700/60 pt-2">
                    <span>18% GST (100% Tax Credit on GSTR-2B):</span>
                    <span className="font-mono text-[#D4A24C]">+₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleRentalBook}
                className="w-full py-3.5 rounded-full bg-[#D4A24C] hover:bg-[#c5943b] text-[#0D3B2A] font-bold text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>Lock In This Fleet Quotation</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

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
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
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
                {isExpanded && (
                  <p className="text-xs text-[#5A6B63] mt-3 leading-relaxed border-t border-[#FAF7F2] pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
      </div>
    </div>
  );
}
