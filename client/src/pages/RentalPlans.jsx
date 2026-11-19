import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Percent,
  FileCheck2,
  Building2,
  Clock,
  Check,
  ArrowRight,
  Repeat,
  Laptop,
  Monitor,
  Cpu,
  Server,
  HardDrive,
  Layers,
  Zap,
  ChevronDown,
  PhoneCall,
  ShoppingBag,
  Award,
  Sparkles,
  PackageCheck,
  Building,
  User,
  Phone,
  Mail,
  FileText,
  Send,
  HelpCircle
} from 'lucide-react';
import RentalCalculator from '../components/RentalCalculator';
import ThemeSelect from '../components/ThemeSelect';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getSafeImageUrl } from '../utils/imageHelper';

export default function RentalPlans() {
  const { openRFQ } = useOutletContext();
  const { addToRentalCart } = useCart();

  const [rentalProducts, setRentalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  // Supplier / Vendor Hardware Procurement Form State
  const [procurementForm, setProcurementForm] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    category: 'Used Laptops Lot',
    quantity: '25 - 50 Units',
    expected_price: '',
    notes: ''
  });
  const [submittingProcurement, setSubmittingProcurement] = useState(false);

  // Fetch Live Rental Fleet from MongoDB
  useEffect(() => {
    const fetchRentalHardware = async () => {
      try {
        const res = await api.get('/products', {
          params: { available_for: 'rent', limit: 12 }
        });
        if (res.data.success) {
          setRentalProducts(res.data.products);
        }
      } catch (err) {
        console.error('[Fetch Rental Hardware Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentalHardware();
  }, []);

  // Handle Supplier Procurement Intake Submission
  const handleProcurementSubmit = async (e) => {
    e.preventDefault();
    if (!procurementForm.company_name || !procurementForm.contact_person || !procurementForm.phone) {
      toast.error('Please provide Company Name, Contact Person, and Phone Number.');
      return;
    }
    setSubmittingProcurement(true);
    try {
      const payload = {
        company_name: procurementForm.company_name,
        contact_person: procurementForm.contact_person,
        phone: procurementForm.phone,
        email: procurementForm.email,
        inquiry_type: 'other',
        product_ref: `Vendor Procurement Offer: ${procurementForm.category}`,
        quantity: procurementForm.quantity,
        city: 'Pan-India Supply',
        message: `[SUPPLIER OFFER] Category: ${procurementForm.category} | Lot Size: ${procurementForm.quantity} | Expected Valuation: ₹${procurementForm.expected_price || 'Negotiable'} | Notes: ${procurementForm.notes || 'None'}`
      };
      const res = await api.post('/inquiries', payload);
      if (res.data.success) {
        toast.success('Procurement proposal submitted! Our asset valuation team will review and connect within 4 business hours.');
        setProcurementForm({
          company_name: '',
          contact_person: '',
          phone: '',
          email: '',
          category: 'Used Laptops Lot',
          quantity: '25 - 50 Units',
          expected_price: '',
          notes: ''
        });
      }
    } catch (err) {
      console.error('[Procurement submit error]', err);
      toast.error(err.response?.data?.message || 'Failed to submit procurement offer. Please try again.');
    } finally {
      setSubmittingProcurement(false);
    }
  };

  // 1. 7 Core Hardware Categories
  const hardwareCategories = [
    {
      id: 'laptop',
      name: 'Corporate Laptops',
      desc: 'ThinkPad, Latitude & EliteBook fleets',
      icon: Laptop,
      link: '/products?category=laptop',
      badge: 'High Demand'
    },
    {
      id: 'desktop',
      name: 'Commercial Desktops',
      desc: 'Towers, SFF & Micro form factors',
      icon: Layers,
      link: '/products?category=desktop',
      badge: 'Bulk Ready'
    },
    {
      id: 'monitor',
      name: 'Business Monitors',
      desc: '24" Frameless FHD & QHD IPS displays',
      icon: Monitor,
      link: '/products?category=monitor',
      badge: 'Ergonomic'
    },
    {
      id: 'gpu',
      name: 'Workstation GPUs',
      desc: 'NVIDIA RTX & Quadro graphics cards',
      icon: Zap,
      link: '/products?category=gpu',
      badge: 'Compute'
    },
    {
      id: 'other',
      name: 'Servers & Networking',
      desc: 'Rack servers, switches & enterprise gear',
      icon: Server,
      link: '/products?category=other',
      badge: 'Enterprise'
    },
    {
      id: 'ram',
      name: 'RAM & Storage',
      desc: 'DDR4/DDR5 modules & enterprise NVMe',
      icon: HardDrive,
      link: '/products?category=ram',
      badge: 'Components'
    },
    {
      id: 'cpu',
      name: 'CPUs & Processors',
      desc: 'Intel Core & Xeon multi-core processors',
      icon: Cpu,
      link: '/products?category=cpu',
      badge: 'Diagnostic Tested'
    }
  ];

  // 2. 4 Standardized Operational Rental Packages (Compact, Elegant, Non-wrapping)
  const standardizedPlans = [
    {
      id: 'short-term',
      badge: 'Trial / Project',
      name: 'Short-Term Project Rental',
      duration: '1 – 3 Months',
      target: 'Temporary projects, software testing, events & surge hiring',
      features: [
        'ThinkPad T490 / Latitude (i5 • 16GB • 256GB SSD)',
        'Clean Win 11 Pro Enterprise Image Pre-Loaded',
        '24–48h Standby Swap SLA & Zero Long-Term Lock-in'
      ],
      price: '₹1,500',
      period: '/mo per unit',
      popular: false
    },
    {
      id: 'long-term',
      badge: '★ Best Value (OPEX)',
      name: 'Long-Term Corporate Leasing',
      duration: '6 – 36 Months',
      target: 'Full enterprise workforce workstations with 100% tax benefit',
      features: [
        'Latitude 7490 / EliteBook 840 (i5/i7 • 16GB/32GB)',
        '100% Tax Deductible OPEX & 18% GSTR-2B Credit',
        'Free Ongoing AMC, Free Spares & Annual Refresh'
      ],
      price: '₹1,200',
      period: '/mo per unit',
      popular: true
    },
    {
      id: 'bulk-fleet',
      badge: 'Volume Discount',
      name: 'Bulk Fleet Deployment',
      duration: '12 – 24 Months',
      target: 'Scaling startups, BPOs, MNC offshore centers & large teams',
      features: [
        'Standardized Fleet Mix of Laptops, Desktops & Displays',
        '5% to 15% Volume Fleet Rebates on 25+ to 100+ Units',
        'Dedicated Standby Buffer Units Staged On-Site'
      ],
      price: 'Custom Tier',
      period: 'volume quotation',
      popular: false
    },
    {
      id: 'workstation',
      badge: 'Heavy Compute',
      name: 'Custom Enterprise Workstations',
      duration: '3 – 24 Months',
      target: 'CAD/3D modeling, deep learning & high-performance rigs',
      features: [
        'NVIDIA RTX 12GB GPU • 32GB–64GB RAM • 1TB SSD',
        'ISV Certified Hardware & Thermal Stress Lab Tested',
        'Dual 24" Frameless IPS Ergonomic Displays Included'
      ],
      price: '₹3,500',
      period: '/mo per workstation',
      popular: false
    }
  ];

  // 3. 5 Key Industries Served
  const industries = [
    {
      name: 'IT & Software Development',
      desc: 'Standardized ThinkPads & high-memory laptops configured for Docker, IDEs, and secure corporate VPNs.',
      tag: 'Fast Deployment'
    },
    {
      name: 'BPOs & Customer Contact Hubs',
      desc: 'Durable, high-uptime commercial desktops and laptops built for 24/7 continuous operations.',
      tag: '24/7 Reliability'
    },
    {
      name: 'Engineering & CAD Studios',
      desc: 'Certified GPU workstations and mobile rigs capable of handling AutoCAD, SolidWorks, and rendering.',
      tag: 'Heavy Compute'
    },
    {
      name: 'FinTech, Banking & Consulting',
      desc: 'BitLocker encrypted enterprise machines complying with corporate security and privacy policies.',
      tag: 'Enterprise Security'
    },
    {
      name: 'EdTech & Corporate Training Facilities',
      desc: 'Economical bulk laptop and monitor fleets for student labs, testing centers, and batch training.',
      tag: 'Flexible Tenures'
    }
  ];

  // 4. 4-Step Onboarding Process
  const onboardingSteps = [
    {
      step: '01',
      title: 'Fleet Configuration & Custom Quote',
      desc: 'Select your machine tiers, memory/SSD configurations, and required tenure (1 to 36 months).'
    },
    {
      step: '02',
      title: 'Paperless Corporate KYC & Agreement',
      desc: 'Zero-collateral approval for GSTIN-verified entities under our corporate Master Services Agreement.'
    },
    {
      step: '03',
      title: 'Custom OS Imaging & Asset Tagging',
      desc: 'Machines pre-configured with Windows 11 Pro, your enterprise VPN, productivity suite, and asset barcode tags.'
    },
    {
      step: '04',
      title: 'Pan-India Dispatch & 24h Standby SLA',
      desc: 'Direct delivery to your central facility or remote employees across Tier-1/2 cities with replacement backup.'
    }
  ];

  // 5. Frequently Asked Questions
  const faqs = [
    {
      q: 'What is the minimum tenure for renting IT hardware?',
      a: 'We offer flexible tenures starting from 1 month for short-term project requirements, up to 36 months for long-term corporate leases with attractive tier rebates.'
    },
    {
      q: 'What security deposit is required for corporate leasing?',
      a: 'We offer zero-collateral leasing for registered corporate entities with active GSTIN filings. For early-stage startups, a nominal 1 to 2 months refundable security deposit applies based on fleet volume.'
    },
    {
      q: 'What happens if a rented machine experiences a hardware failure?',
      a: 'All leased hardware is backed by our strict 24–48 hour on-site Standby Swap SLA. If a laptop experiences motherboard, battery, or screen issues, our engineer delivers a pre-imaged replacement machine to your office so your employees experience zero work downtime.'
    },
    {
      q: 'Can we purchase the hardware outright if we decide not to rent?',
      a: 'Yes! Nova Infotech operates a dual business model: you can either lease hardware via our rental division, or purchase certified refurbished and brand-new hardware directly from our Sales Catalog with complete GST invoicing.'
    },
    {
      q: 'How does Nova Infotech purchase hardware from vendors and suppliers?',
      a: 'Through our Procurement Desk, we purchase decommissioned corporate fleets, excess distributor stock, and bulk IT hardware lots directly from suppliers with rapid valuation and upfront payment.'
    },
    {
      q: 'How does the 18% GST Input Tax Credit benefit our company?',
      a: 'Unlike capital asset purchases which tie up cash in depreciation schedules, monthly equipment rental invoices carry 100% deductible Operational Expenditure (OPEX) classification and 18% input credit verifiable directly in your GSTR-2B filing.'
    },
    {
      q: 'Can laptops be shipped directly to remote work-from-home (WFH) employees?',
      a: 'Yes. We provide white-glove direct shipping to employees residing anywhere in India across 300+ cities. Each laptop arrives packaged in tamper-evident secure transit cases with pre-configured corporate VPN and logins.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-12 select-none">
      
      {/* ======================================================== */}
      {/* SECTION 1: TRI-PILLAR HERO SECTION (RENT + BUY + PROCURE)*/}
      {/* ======================================================== */}
      <section className="text-center max-w-4xl mx-auto space-y-3 pt-2">
        <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#8A5E12] font-bold block">
          — ENTERPRISE IT INFRASTRUCTURE PARTNER
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#0D3B2A] tracking-tight leading-tight">
          Complete IT Hardware Solutions – Rent, Purchase & Sell
        </h1>
        <p className="text-xs sm:text-sm text-[#5A6B63] max-w-2xl mx-auto leading-relaxed">
          Your trusted partner for enterprise IT hardware. Explore flexible rental solutions, source quality hardware, and purchase reliable IT equipment for your business requirements.
        </p>

        {/* 3 Primary Tri-Pillar Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
          <a
            href="#rental-catalog"
            className="px-4.5 py-2 rounded-full bg-[#0D3B2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#153423] transition shadow-xs border border-[#D4A24C]/40 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Repeat className="w-3.5 h-3.5 text-[#D4A24C]" />
            <span>Explore Rental Hardware</span>
          </a>
          <Link
            to="/products?available_for=sale"
            className="px-4.5 py-2 rounded-full bg-[#FAF7F2] text-[#0D3B2A] text-xs font-bold uppercase tracking-wider hover:bg-[#F3E8D2] transition border border-[#D4A24C]/35 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#8A5E12]" />
            <span>Explore Products for Sale</span>
          </Link>
          <a
            href="#procurement-enquiry"
            className="px-4.5 py-2 rounded-full bg-white text-[#8A5E12] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF7F2] transition border border-[#D4A24C]/30 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <PackageCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
            <span>Request Hardware Procurement</span>
          </a>
        </div>

        {/* 4 Core Value Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
          <div className="p-2.5 bg-white rounded-xl border border-[#D4A24C]/25 shadow-2xs text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] block">Capital Outlay</span>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B2A] font-serif">₹0 Zero CAPEX</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-[#D4A24C]/25 shadow-2xs text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] block">Tax Credit</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-700 font-serif">100% GSTR-2B</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-[#D4A24C]/25 shadow-2xs text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] block">Standby Swap</span>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B2A] font-serif">24–48h SLA</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-[#D4A24C]/25 shadow-2xs text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] block">Ongoing AMC</span>
            <span className="text-xs sm:text-sm font-bold text-[#0D3B2A] font-serif">Free Repairs</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: HARDWARE CATEGORIES GRID                     */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#D4A24C]/20 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
              — HARDWARE PORTFOLIO
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
              Explore by Hardware Category
            </h2>
          </div>
          <p className="text-xs text-[#5A6B63]">
            Browse certified enterprise hardware available across rental leases and outright purchase.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
          {hardwareCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.link}
                className="p-4 rounded-2xl bg-white border border-[#D4A24C]/25 shadow-xs hover:shadow-md hover:border-[#0D3B2A] transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/30 flex items-center justify-center text-[#0D3B2A] group-hover:bg-[#0D3B2A] group-hover:text-[#D4A24C] transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D4A24C]/20">
                    {cat.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-serif font-bold text-[#0D3B2A] group-hover:text-[#8A5E12] transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#5A6B63] mt-0.5 leading-snug">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-[#D4A24C]/15 flex items-center justify-between text-[10px] font-bold text-[#0D3B2A]">
                  <span>View Inventory</span>
                  <ArrowRight className="w-3 h-3 text-[#D4A24C] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: 4 STANDARDIZED OPERATIONAL RENTAL PACKAGES   */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — STRUCTURED CORPORATE LEASING
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Standardized Fleet Leasing Plans
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Tailored deployment packages engineered for project timelines, corporate workforces, and volume scaling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch pt-2">
          {standardizedPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 relative ${
                plan.popular
                  ? 'bg-white border-2 border-[#D4A24C] shadow-md ring-1 ring-[#D4A24C]/25'
                  : 'bg-white border border-[#D4A24C]/30 shadow-2xs hover:shadow-sm hover:border-[#0D3B2A]/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0D3B2A] text-[#D4A24C] border border-[#D4A24C] px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-xs whitespace-nowrap">
                  ★ Most Popular
                </div>
              )}

              <div>
                {/* Header row: Badge & Duration */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5E12] truncate">
                    {plan.badge}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-[#0D3B2A] bg-[#FAF7F2] border border-[#D4A24C]/25 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {plan.duration}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold font-serif text-[#0D3B2A] tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-[11px] text-[#5A6B63] mt-0.5 leading-snug line-clamp-1">
                  {plan.target}
                </p>

                {/* 3 Core Value Features */}
                <div className="space-y-1.5 my-3 pt-2.5 border-t border-[#D4A24C]/15 text-[11px] text-[#0D3B2A]">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-1.5 leading-tight">
                      <Check className="w-3.5 h-3.5 text-[#D4A24C] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Inquire Button */}
              <div className="pt-2.5 mt-auto border-t border-[#D4A24C]/20 space-y-2">
                <div className="flex items-baseline justify-between gap-1">
                  <div className="truncate">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#8A5E12] block">
                      Starting Rate
                    </span>
                    <div className="flex items-baseline gap-1 truncate">
                      <span className="text-base sm:text-lg font-bold font-serif text-[#0D3B2A] leading-tight">
                        {plan.price}
                      </span>
                      <span className="text-[10px] font-normal text-[#5A6B63] truncate">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#0D3B2A] bg-[#FAF7F2] border border-[#D4A24C]/35 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    24h Swap SLA
                  </span>
                </div>

                <button
                  onClick={() => openRFQ(`Plan Inquiry: ${plan.name} (${plan.duration})`)}
                  className="w-full h-8 sm:h-9 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-[11px] font-bold uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-1.5 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
                >
                  <Repeat className="w-3 h-3 text-[#D4A24C]" />
                  <span>Inquire Fleet Plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: LIVE READY-TO-DEPLOY RENTAL HARDWARE FLEET   */}
      {/* ======================================================== */}
      <section id="rental-catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#D4A24C]/20 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
              — INVENTORY READINESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
              Live Ready-to-Deploy Rental Hardware
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B63] mt-0.5">
              Certified commercial machines staged in our diagnostic lab ready for immediate dispatch.
            </p>
          </div>

          <Link
            to="/products?available_for=rent"
            className="text-xs font-bold text-[#0D3B2A] hover:text-[#8A5E12] flex items-center gap-1 shrink-0 font-serif"
          >
            <span>View All Rental Fleets</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A24C]" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white rounded-2xl border border-[#D4A24C]/20 animate-pulse" />
            ))}
          </div>
        ) : rentalProducts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-[#D4A24C]/20 p-6">
            <p className="text-xs text-[#5A6B63]">No hardware currently marked for rental fleet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rentalProducts.slice(0, 6).map((p) => {
              const maxRental = p.rental_stock !== undefined ? p.rental_stock : 5;

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl p-4 border border-[#D4A24C]/25 shadow-2xs hover:shadow-sm hover:border-[#0D3B2A]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FAF7F2] text-[#8A5E12] uppercase border border-[#D4A24C]/30">
                        • {maxRental} in fleet
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#0D3B2A] bg-[#FAF7F2] border border-[#D4A24C]/25 px-2 py-0.5 rounded-full">
                        24h Swap SLA
                      </span>
                    </div>

                    <Link to={`/products/${p.slug}`} className="block">
                      <div className="h-32 rounded-xl bg-[#FAF7F2] flex items-center justify-center p-2.5 mb-2.5 border border-[#D4A24C]/20 cursor-pointer overflow-hidden">
                        <img
                          src={getSafeImageUrl(p)}
                          alt={p.title}
                          className="h-full object-contain group-hover:scale-105 transition duration-500 filter drop-shadow-sm"
                        />
                      </div>
                    </Link>

                    <Link to={`/products/${p.slug}`} className="block">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0D3B2A] font-serif line-clamp-1 group-hover:text-[#D4A24C] transition">
                        {p.title}
                      </h4>
                    </Link>

                    <p className="text-[11px] text-[#5A6B63] mt-0.5 line-clamp-1 font-mono">
                      {p.description || 'Enterprise Grade A+ certified machine with on-site warranty.'}
                    </p>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-[#D4A24C]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12]">
                        Monthly Fleet Lease
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#0D3B2A] font-serif">
                        ₹{p.rental_price_monthly?.toLocaleString('en-IN') || 1200}
                        <span className="text-xs font-normal text-[#5A6B63] font-sans">/mo</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openRFQ(`Fleet Lease Inquiry: ${p.title} (${maxRental} units in fleet)`)}
                        className="w-full h-8 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition border border-[#D4A24C]/30 text-center cursor-pointer"
                      >
                        Inquire RFQ
                      </button>

                      <button
                        onClick={() => addToRentalCart(p, 1, '6_months')}
                        className="w-full h-8 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition shadow-2xs flex items-center justify-center gap-1 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
                      >
                        <Repeat className="w-3 h-3 text-[#D4A24C]" />
                        <span>Rent Fleet</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* SECTION 5: INTERACTIVE LUXURY FLEET COST ESTIMATOR       */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — DYNAMIC COST PROJECTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Interactive Corporate Fleet Calculator
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Customize fleet volume, device specifications, and contract tenure with real-time OPEX projections.
          </p>
        </div>

        <RentalCalculator rentalProducts={rentalProducts} onOpenRFQ={openRFQ} />
      </section>

      {/* ======================================================== */}
      {/* SECTION 6: RENT VS BUY COMPARISON MATRIX                 */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl border border-[#D4A24C]/25 p-6 sm:p-10 space-y-6 shadow-sm overflow-hidden">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — STRATEGIC IT PROCUREMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Rent vs Buy: Strategic Financial Comparison
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Understand when leasing hardware (OPEX) or outright purchase (CAPEX) offers the greatest return for your business.
          </p>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#072117] text-[#FAF7F2] font-mono uppercase tracking-wider text-[10px]">
                <th className="py-4 px-4 sm:px-6 rounded-l-xl">Strategic Decision Metric</th>
                <th className="py-4 px-4 sm:px-6 text-[#D4A24C] font-bold bg-[#0D3B2A]">RENT (Nova Corporate Lease)</th>
                <th className="py-4 px-4 sm:px-6 text-emerald-300 rounded-r-xl">BUY (Outright Direct Purchase)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4A24C]/15 font-sans">
              <tr className="hover:bg-[#FAF7F2]/60 transition">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A]">Upfront Capital Expenditure</td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A] bg-[#FAF7F2]">₹0 Zero Upfront (100% Cash Flow Preserved)</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600">Full capital payment (Assets owned immediately)</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2]/60 transition">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A]">Corporate Tax Deductibility</td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-700 bg-[#FAF7F2]">100% Tax Deductible OPEX in Current FY</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600">Depreciation claimed slowly over 3–5 years</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2]/60 transition">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A]">GST Input Tax Credit</td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A] bg-[#FAF7F2]">Monthly 18% GSTR-2B Input Credit on Invoices</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600">One-time capital purchase ITC claim</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2]/60 transition">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A]">Maintenance & AMC</td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-700 bg-[#FAF7F2]">100% Free AMC, Free Spares & Diagnostics</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600">Standard warranty / optional AMC contract</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2]/60 transition">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A]">Hardware Breakdown Support</td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A] bg-[#FAF7F2]">24–48h Standby Laptop Replacement On-Site</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600">OEM service center repair turnaround (5–10 days)</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2]/60 transition">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A]">Technology Refresh Lifecycle</td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-[#0D3B2A] bg-[#FAF7F2]">Upgrade to Next-Gen Fleets every 12–24 Months</td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600">Retain machine until retirement / resale value</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#D4A24C]/20">
          <a
            href="#rental-catalog"
            className="px-6 py-2.5 rounded-full bg-[#0D3B2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#153423] transition shadow-sm border border-[#D4A24C]/40"
          >
            Explore Corporate Rental Fleets
          </a>
          <Link
            to="/products?available_for=sale"
            className="px-6 py-2.5 rounded-full bg-[#FAF7F2] text-[#0D3B2A] text-xs font-bold uppercase tracking-wider hover:bg-[#F3E8D2] transition border border-[#D4A24C]/35"
          >
            Browse Products for Outright Purchase
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 7: B2B HARDWARE PROCUREMENT & SUPPLIER INTAKE   */}
      {/* ======================================================== */}
      <section id="procurement-enquiry" className="bg-[#FAF7F2] rounded-3xl border border-[#D4A24C]/35 p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — VENDOR & SUPPLIER PROCUREMENT DESK
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Sell Your IT Hardware to Nova Infotech
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63] leading-relaxed">
            We purchase decommissioned corporate fleets, surplus distributor inventory, and commercial components from enterprise suppliers, IT asset managers, and vendors across India.
          </p>
        </div>

        <form onSubmit={handleProcurementSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0D3B2A] mb-1">Company / Vendor Organization *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#8A5E12] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex IT Solutions Pvt Ltd"
                  value={procurementForm.company_name}
                  onChange={(e) => setProcurementForm({ ...procurementForm, company_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D3B2A] mb-1">Contact Person Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A5E12] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma (IT Asset Manager)"
                  value={procurementForm.contact_person}
                  onChange={(e) => setProcurementForm({ ...procurementForm, contact_person: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D3B2A] mb-1">Direct Phone / WhatsApp *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8A5E12] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={procurementForm.phone}
                  onChange={(e) => setProcurementForm({ ...procurementForm, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D3B2A] mb-1">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A5E12] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="procurement@company.com"
                  value={procurementForm.email}
                  onChange={(e) => setProcurementForm({ ...procurementForm, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D3B2A] mb-1">Hardware Category Offered</label>
              <ThemeSelect
                value={procurementForm.category}
                onChange={(val) => setProcurementForm({ ...procurementForm, category: val })}
                options={[
                  { value: 'Used Laptops Lot', label: 'Commercial Laptops (ThinkPad, Dell, HP)' },
                  { value: 'Desktop Towers & Monitors', label: 'Desktop Towers & Business Monitors' },
                  { value: 'Workstations & Servers', label: 'Workstations, Servers & Rack Gear' },
                  { value: 'RAM / GPU / CPU Scrap Lot', label: 'Component Lots (RAM, GPUs, CPUs)' },
                  { value: 'Mixed Asset Liquidation', label: 'Mixed Enterprise IT Assets / Liquidation' }
                ]}
                variant="form"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D3B2A] mb-1">Approximate Unit Volume</label>
              <ThemeSelect
                value={procurementForm.quantity}
                onChange={(val) => setProcurementForm({ ...procurementForm, quantity: val })}
                options={[
                  { value: '10 - 25 Units', label: '10 – 25 Units' },
                  { value: '25 - 50 Units', label: '25 – 50 Units' },
                  { value: '50 - 100 Units', label: '50 – 100 Units' },
                  { value: '100+ Units (Bulk Lot)', label: '100+ Units (Bulk Enterprise Lot)' }
                ]}
                variant="form"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D3B2A] mb-1">Hardware Specifications / Manifest Details</label>
            <textarea
              rows="2"
              placeholder="e.g. Lot of 35 Lenovo ThinkPad T490 Core i5 8th Gen, tested working condition, located in Gurgaon facility..."
              value={procurementForm.notes}
              onChange={(e) => setProcurementForm({ ...procurementForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] shadow-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#5A6B63]">
              🔒 Confidential vendor intake. Never shared with third parties.
            </span>
            <button
              type="submit"
              disabled={submittingProcurement}
              className="px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm border border-[#D4A24C]/40 flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>{submittingProcurement ? 'Submitting Offer...' : 'Submit Procurement Offer'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* ======================================================== */}
      {/* SECTION 8: 4-STEP ENTERPRISE ONBOARDING PROCESS         */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — FRICTIONLESS DEPLOYMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            4-Step Corporate Onboarding Process
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            How we provision, image, and deliver enterprise laptop fleets across India with zero paperwork bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {onboardingSteps.map((s, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3 relative group">
              <span className="text-2xl font-bold font-serif text-[#D4A24C] block leading-none">
                {s.step}
              </span>
              <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">
                {s.title}
              </h3>
              <p className="text-xs text-[#5A6B63] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 9: INDUSTRIES WE SERVE                          */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — TAILORED FLEETS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Industries We Power Across India
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Customized hardware configurations engineered for the exact operational needs of different sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {industries.map((ind, iIdx) => (
            <div
              key={iIdx}
              className="p-5 rounded-2xl bg-white border border-[#D4A24C]/25 shadow-xs hover:shadow-md transition space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A5E12] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D4A24C]/20">
                  {ind.tag}
                </span>
                <h3 className="font-serif font-bold text-sm text-[#0D3B2A] mt-2">
                  {ind.name}
                </h3>
                <p className="text-xs text-[#5A6B63] leading-relaxed mt-1">
                  {ind.desc}
                </p>
              </div>
            </div>
          ))}

          {/* 6th Card: All Industries Quote Box */}
          <div className="p-5 rounded-2xl bg-[#0D3B2A] text-white border border-[#D4A24C]/40 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4A24C] bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                Custom Deployments
              </span>
              <h3 className="font-serif font-bold text-sm text-white mt-2">
                Have a Unique Industry Requirement?
              </h3>
              <p className="text-xs text-[#FAF7F2]/80 leading-relaxed mt-1">
                Our solutions team structures customized memory, GPU, and dual-monitor bundles for specialized corporate workflows.
              </p>
            </div>
            <button
              onClick={() => openRFQ('Custom Industry Fleet Proposal Request')}
              className="w-full py-2 rounded-full bg-[#D4A24C] text-[#072117] text-[11px] font-bold uppercase tracking-wider hover:bg-[#c5943b] transition cursor-pointer"
            >
              Request Custom Proposal
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 10: PAN-INDIA LOGISTICS HUBS & REMOTE DISPATCH  */}
      {/* ======================================================== */}
      <section className="bg-[#072117] rounded-3xl border border-[#D4A24C]/30 p-8 sm:p-10 space-y-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#FAF7F2]/10 pb-5">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4A24C] font-bold block">
              — NATIONWIDE TRANSIT SLA
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2] mt-0.5">
              Pan-India Hub Dispatch & WFH Logistics
            </h2>
          </div>
          <p className="text-xs text-[#90b09a] max-w-md leading-relaxed">
            Centralized fulfillment hubs equipped with diagnostic test benches ensuring rapid deployment directly to corporate offices or remote employees' doorsteps.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-[#D4A24C] font-serif block">📍 Delhi NCR Hub</span>
            <span className="text-[11px] text-[#FAF7F2] font-semibold block">Same-Day / 24h Delivery</span>
            <span className="text-[10px] text-[#90b09a]">Noida, Gurgaon, Delhi, Faridabad</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-[#D4A24C] font-serif block">📍 Bangalore Hub</span>
            <span className="text-[11px] text-[#FAF7F2] font-semibold block">24-Hour Delivery</span>
            <span className="text-[10px] text-[#90b09a]">Electronic City, Whitefield, ORR</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-[#D4A24C] font-serif block">📍 Mumbai & Pune</span>
            <span className="text-[11px] text-[#FAF7F2] font-semibold block">24–48h Transit SLA</span>
            <span className="text-[10px] text-[#90b09a]">BKC, Andheri, Hinjewadi, Magarpatta</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-[#D4A24C] font-serif block">📍 Pan-India & Remote WFH</span>
            <span className="text-[11px] text-[#FAF7F2] font-semibold block">Insured Tracked Courier</span>
            <span className="text-[10px] text-[#90b09a]">Direct to employee homes in 300+ cities</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 11: ENTERPRISE RENTAL & POLICIES FAQS           */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-6 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — CLARIFICATIONS & POLICIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Transparent answers regarding security deposits, SLA swaps, lease renewals, sales, and tax credits.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto pt-2">
          {faqs.map((faq, fIdx) => (
            <div
              key={fIdx}
              className="rounded-2xl border border-[#D4A24C]/20 bg-[#FAF7F2] overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                className="w-full p-4.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#0D3B2A] font-serif cursor-pointer hover:text-[#8A5E12] transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#D4A24C] shrink-0 transition-transform duration-200 ${
                    openFaq === fIdx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === fIdx && (
                <div className="px-4.5 pb-4 pt-1 text-xs text-[#5A6B63] leading-relaxed border-t border-[#D4A24C]/15 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 12: ENTERPRISE CONSULTATION CTA BAR             */}
      {/* ======================================================== */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0D3B2A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#D4A24C]/50 shadow-2xl">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4A24C] font-bold block">
            NEED A CUSTOM SPECIFICATION OR FLEET ESTIMATE?
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Speak with an Enterprise Solutions Specialist
          </h3>
          <p className="text-xs text-[#FAF7F2]/80 max-w-xl leading-relaxed">
            Our engineers help structure custom RAM/GPU configurations, multi-city delivery schedules, and dedicated master leasing agreements tailored to your headcount projections.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => openRFQ('Custom Enterprise Fleet Rental Consultation Request')}
            className="px-6 py-3.5 rounded-full bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
          >
            Request Fleet Proposal
          </button>
          <a
            href="tel:+919876543210"
            className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
            title="Call Procurement Desk"
          >
            <PhoneCall className="w-4 h-4 text-[#D4A24C]" />
          </a>
        </div>
      </div>

    </div>
  );
}
