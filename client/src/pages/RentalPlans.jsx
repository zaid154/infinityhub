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
  Cpu,
  Zap,
  HelpCircle,
  ChevronDown,
  PhoneCall,
  ShoppingBag,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import RentalCalculator from '../components/RentalCalculator';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function RentalPlans() {
  const { openRFQ } = useOutletContext();
  const { addToRentalCart } = useCart();

  const [rentalProducts, setRentalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

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

  const getProductImage = (p) => {
    const s = (p.title || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    if (cat === 'gpu' || s.includes('rtx 3060') || s.includes('graphics')) {
      return '/products/real-rtx-3060-gpu-transparent.png';
    }
    if (cat === 'monitor' || s.includes('p2419h') || s.includes('display')) {
      return '/products/real-dell-display-transparent.png';
    }
    if (s.includes('latitude')) {
      return '/products/real-dell-latitude-transparent.png';
    }
    if (s.includes('thinkpad')) {
      return '/products/real-thinkpad-t14-transparent.png';
    }
    if (s.includes('elitebook') || s.includes('hp')) {
      return '/products/real-mobile-workstation-transparent.png';
    }
    return p.images?.[0]?.url || '/products/real-thinkpad-t14-transparent.png';
  };

  const fleetTiers = [
    {
      id: 'office',
      name: 'Starter Office Fleet',
      rate: '1,350',
      tagline: 'Ideal for Telecalling, BPO, Sales & General Operations',
      specs: [
        'Intel Core i5 (8th/10th Gen vPro)',
        '8GB DDR4 RAM (Upgradable)',
        '256GB High-Speed NVMe SSD',
        '14.0" Anti-Glare FHD Display',
        'Genuine Windows 11 Pro 64-Bit',
        'Dual Array Noise-Cancelling Mic'
      ],
      sla: '48h On-Site Standby Replacement',
      popular: false,
      badge: 'Tier 1'
    },
    {
      id: 'developer',
      name: 'Developer Pro Fleet',
      rate: '1,850',
      tagline: 'Optimal for Full-Stack Developers, QA Engineers & Analysts',
      specs: [
        'Intel Core i7 / AMD Ryzen 7 Pro',
        '16GB Dual-Channel DDR4/DDR5',
        '512GB PCIe M.2 NVMe SSD',
        'Lenovo ThinkPad T14 / Dell Latitude',
        'Genuine Windows 11 Pro / Ubuntu LTS',
        'Backlit Ergonomic Keyboard & TrackPoint'
      ],
      sla: '24h Priority On-Site Standby Swap',
      popular: true,
      badge: 'Most Popular'
    },
    {
      id: 'workstation',
      name: 'Workstation & AI Rig',
      rate: '3,200',
      tagline: 'High-Performance Rigs for 3D Modeling, Video & ML Workloads',
      specs: [
        'Intel Core i7/i9 Hexa-Core Workstation',
        '32GB 3200MHz DDR4 Memory',
        '1TB NVMe Gen4 High-IOPS SSD',
        'Dedicated NVIDIA RTX GPU (4GB–12GB VRAM)',
        'Dell Precision / HP Mobile Workstation',
        'Calibrated Anti-Glare IPS Color Display'
      ],
      sla: '24h VIP Direct Engineer Dispatch',
      popular: false,
      badge: 'Enterprise Flagship'
    }
  ];

  const onboardingSteps = [
    {
      step: '01',
      title: 'Fleet Configuration & Custom Quote',
      desc: 'Select your machine tiers, memory/SSD configurations, and required tenure (3 to 36 months).'
    },
    {
      step: '02',
      title: 'Paperless Corporate KYC & MSA',
      desc: 'Zero-collateral security deposit approval for GSTIN-verified entities under our corporate Master Services Agreement.'
    },
    {
      step: '03',
      title: 'Custom OS Imaging & Serial Tagging',
      desc: 'Machines pre-configured with genuine Windows 11 Pro, your enterprise VPN, productivity suite, and asset barcode tags.'
    },
    {
      step: '04',
      title: 'Pan-India Dispatch & 24h Standby SLA',
      desc: 'White-glove delivery directly to your central IT facility or distributed work-from-home employees across Tier-1/2 cities.'
    }
  ];

  const faqs = [
    {
      q: 'What security deposit is required for corporate leasing?',
      a: 'We offer zero-collateral leasing for registered corporate entities with active GSTIN filings. For early-stage startups, a nominal 1 to 2 months refundable security deposit applies based on fleet volume.'
    },
    {
      q: 'What happens if a rented machine experiences a hardware failure?',
      a: 'All leased hardware is backed by our strict 24–48 hour on-site Standby Swap SLA. If a laptop experiences motherboard, battery, or screen issues, our engineer delivers a pre-imaged replacement machine to your office so your employees experience zero work downtime.'
    },
    {
      q: 'Can we scale our fleet count up or down during the lease tenure?',
      a: 'Yes! Corporate clients can flexibly add machines at the same contracted monthly rate as hiring surges, or return surplus units at contract renewal intervals with zero termination penalties.'
    },
    {
      q: 'Is there a Rent-to-Own (Asset Purchase) option at the end of the tenure?',
      a: 'Yes. At the conclusion of a 12 or 24-month lease, companies have the option to purchase the hardware outright at heavily depreciated salvage values, or refresh their entire workforce to newer generation machines.'
    },
    {
      q: 'How does the 18% GST Input Tax Credit benefit our company?',
      a: 'Unlike asset capital purchases which tie up cash in depreciation schedules, monthly equipment rental invoices carry 100% deductible Operational Expenditure (OPEX) classification and 18% input credit verifiable directly in your GSTR-2B filing.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-16 select-none">
      
      {/* ======================================================== */}
      {/* SECTION 1: EXECUTIVE HERO & OPEX VALUE PROPS            */}
      {/* ======================================================== */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#8A5E12] font-bold block">
          — ZERO CAPEX CORPORATE IT INFRASTRUCTURE
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0D3B2A] tracking-tight leading-tight">
          Flexible Enterprise IT Fleet Leasing
        </h1>
        <p className="text-sm sm:text-base text-[#5A6B63] leading-relaxed">
          Equip your teams with certified Grade A+ commercial laptops (ThinkPad, Latitude, EliteBook) on flexible monthly contracts with guaranteed on-site maintenance, standby swap SLA, and zero capital expenditure.
        </p>

        {/* 4 Value Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
          <div className="p-3 bg-white rounded-2xl border border-[#D4A24C]/25 shadow-sm text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5E12] block">Capital Outlay</span>
            <span className="text-sm font-bold text-[#0D3B2A] font-serif">₹0 Zero CAPEX</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#D4A24C]/25 shadow-sm text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5E12] block">Tax Credit</span>
            <span className="text-sm font-bold text-emerald-700 font-serif">100% GSTR-2B</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#D4A24C]/25 shadow-sm text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5E12] block">Standby Swap</span>
            <span className="text-sm font-bold text-[#0D3B2A] font-serif">24–48h SLA</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#D4A24C]/25 shadow-sm text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5E12] block">Ongoing AMC</span>
            <span className="text-sm font-bold text-[#0D3B2A] font-serif">Free Repairs</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: 3 PRE-CONFIGURED ENTERPRISE FLEET PACKAGES   */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — STANDARDIZED CORPORATE TIERS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Pre-Packaged Fleet Leasing Plans
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Engineered for corporate role-based deployments with guaranteed genuine components and OS licensing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
          {fleetTiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                tier.popular
                  ? 'bg-white border-2 border-[#D4A24C] shadow-xl ring-4 ring-[#D4A24C]/10'
                  : 'bg-white border border-[#D4A24C]/25 shadow-sm hover:shadow-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0D3B2A] text-[#D4A24C] border border-[#D4A24C] px-3.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#D4A24C]/15 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A5E12]">
                      {tier.badge}
                    </span>
                    <h3 className="text-lg font-bold font-serif text-[#0D3B2A]">
                      {tier.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#5A6B63] block">Starting at</span>
                    <span className="text-xl sm:text-2xl font-bold font-serif text-[#0D3B2A]">
                      ₹{tier.rate}
                    </span>
                    <span className="text-[10px] text-[#5A6B63] block font-sans">/month + GST</span>
                  </div>
                </div>

                <p className="text-xs text-[#5A6B63] leading-relaxed min-h-[36px]">
                  {tier.tagline}
                </p>

                {/* Specs List */}
                <div className="space-y-2 pt-1 border-t border-[#D4A24C]/15 text-xs text-[#0D3B2A]">
                  {tier.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/20 text-[11px] text-[#5A6B63] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#D4A24C] shrink-0" />
                  <span className="font-semibold text-[#0D3B2A]">{tier.sla}</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => openRFQ(`Fleet Rental Tier Selection: ${tier.name} (Starting ₹${tier.rate}/mo)`)}
                  className={`w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer flex items-center justify-center gap-1.5 ${
                    tier.popular
                      ? 'bg-[#0D3B2A] hover:bg-[#153423] text-white border border-[#D4A24C]/50'
                      : 'bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/30'
                  }`}
                >
                  <span>Select {tier.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4A24C]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: LIVE READY-TO-DEPLOY RENTAL HARDWARE FLEET   */}
      {/* ======================================================== */}
      <section className="space-y-6">
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
            <span>View Full Rental Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A24C]" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-white rounded-3xl border border-[#D4A24C]/20 animate-pulse" />
            ))}
          </div>
        ) : rentalProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#D4A24C]/20 p-6">
            <p className="text-xs text-[#5A6B63]">No hardware currently marked for rental fleet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalProducts.slice(0, 6).map((p) => {
              const maxRental = p.rental_stock !== undefined ? p.rental_stock : 5;

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-3xl p-5 border border-[#0D3B2A]/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#8A5E12] uppercase border border-[#D4A24C]/30">
                        Fleet Stock: {maxRental} Units
                      </span>
                      <span className="text-[10px] font-mono text-[#0D3B2A] font-bold">
                        24h Swap SLA
                      </span>
                    </div>

                    <Link to={`/products/${p.slug}`} className="block">
                      <div className="h-40 rounded-2xl bg-[#FAF7F2] flex items-center justify-center p-3 mb-3 border border-[#D4A24C]/20 cursor-pointer overflow-hidden">
                        <img
                          src={getProductImage(p)}
                          alt={p.title}
                          className="h-full object-contain group-hover:scale-105 transition duration-500 filter drop-shadow-sm"
                        />
                      </div>
                    </Link>

                    <Link to={`/products/${p.slug}`} className="block">
                      <h4 className="text-sm font-bold text-[#0D3B2A] font-serif line-clamp-1 group-hover:text-[#D4A24C] transition">
                        {p.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-[#5A6B63] mt-1 line-clamp-2 min-h-[32px] font-mono text-[11px]">
                      {p.description || 'Enterprise Grade A+ certified machine with on-site warranty.'}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#D4A24C]/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B63]">
                        Monthly Fleet Lease
                      </span>
                      <span className="text-base font-bold text-[#0D3B2A] font-serif">
                        ₹{p.rental_price_monthly?.toLocaleString('en-IN') || 1350}
                        <span className="text-xs font-normal text-[#5A6B63] font-sans">/mo</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openRFQ(`Fleet Lease Inquiry: ${p.title} (${maxRental} units in fleet)`)}
                        className="w-full py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] text-[11px] font-bold uppercase tracking-wider transition border border-[#D4A24C]/30 text-center cursor-pointer"
                      >
                        Inquire Fleet
                      </button>

                      <button
                        onClick={() => addToRentalCart(p, 1, '6_months')}
                        className="w-full py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-[11px] font-bold uppercase tracking-wider transition shadow flex items-center justify-center gap-1 border border-[#D4A24C]/40 cursor-pointer"
                      >
                        <Repeat className="w-3.5 h-3.5 text-[#D4A24C]" />
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
      {/* SECTION 4: INTERACTIVE LUXURY FLEET COST ESTIMATOR       */}
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

        <RentalCalculator onOpenRFQ={openRFQ} />
      </section>

      {/* ======================================================== */}
      {/* SECTION 5: 4-STEP ENTERPRISE ONBOARDING WORKFLOW        */}
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
      {/* SECTION 6: IRONCLAD SLA TERMS & ENTERPRISE GUARANTEES   */}
      {/* ======================================================== */}
      <section id="sla" className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — SERVICE LEVEL AGREEMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Ironclad Corporate Rental SLA Terms
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Every corporate rental contract is governed by standard enterprise-grade commitments:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">24–48h Standby Swap SLA</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              If any leased machine encounters a hardware fault, we deliver a pre-configured replacement machine on-site within 24 to 48 hours. Zero workforce downtime.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">100% GSTR-2B Input Tax Credit</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              Monthly lease invoices carry full 18% GST credits directly verifiable on your GST portal. 100% tax-deductible as Operational Expenditure (OPEX).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">Free Maintenance & Repairs</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              All ongoing technical diagnostics, thermal repasting, RAM/SSD upgrades, and battery replacements are provided completely free of charge during the rental term.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">Flexible Tenures (1–36 Months)</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              Start with a 1-month trial, a 6-month project term, or a multi-year fleet contract. Scale up or scale down machine counts as your hiring fluctuates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">Clean OS Imaging Included</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              Machines arrive pre-loaded with genuine Windows 11 Pro 64-bit and your organization's custom enterprise software stack, ready for immediate employee sign-in.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">Up to 15% Long-Term Rebates</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              Tier discounts of 5% on 6-month leases and 15% on 12+ month contracts, plus volume bonuses on fleets of 25+ and 50+ laptops.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 7: ENTERPRISE RENTAL FAQS ACCORDION             */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-6 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — CLARIFICATIONS & POLICIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Frequently Asked Rental Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Transparent answers regarding security deposits, SLA swaps, lease renewals, and tax credits.
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
      {/* SECTION 8: ENTERPRISE CONSULTATION CTA BAR              */}
      {/* ======================================================== */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0D3B2A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#D4A24C]/50 shadow-2xl">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4A24C] font-bold block">
            NEED A CUSTOM FLEET SPECIFICATION?
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Speak with an Enterprise Procurement Specialist
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
            title="Call Helpline"
          >
            <PhoneCall className="w-4 h-4 text-[#D4A24C]" />
          </a>
        </div>
      </div>

    </div>
  );
}
