import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Sparkles,
  Layers,
  Send,
  Building,
  Phone
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Home() {
  const { openRFQ } = useOutletContext();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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

  const faqs = [
    {
      q: 'Can we claim 100% GST input tax credit on purchases and rentals?',
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
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ISO 9001:2015 Diagnostic Facility • Pan-India Logistics • Direct GSTR-2B Credit
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12] font-heading">
              Commercial IT Hardware, <br />
              <span className="text-blue-600">Bulk Laptop Rentals</span> & Parts <br />
              at 60% Lower TCO.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Equip your workforce with Grade A+ certified commercial laptops, high-performance workstation GPUs, and frameless IPS displays. Available for <strong className="text-slate-900">immediate bulk wholesale purchase</strong> or <strong className="text-slate-900">flexible monthly lease</strong> with guaranteed same-day replacement SLA.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openRFQ('Urgent Bulk Requirement')}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Get Instant Bulk Quote (Under 2 Hrs)</span>
              </button>

              <a
                href="#rental-calculator"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-sm transition flex items-center gap-2 shadow-sm"
              >
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Calculate Rental Rates</span>
              </a>
            </div>

            {/* Trust Mini Strip */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200">
              <div>
                <div className="text-2xl font-bold text-slate-900 font-mono">1,450+</div>
                <div className="text-xs text-slate-500 font-medium">Ready in Warehouse</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 font-mono">24-48h</div>
                <div className="text-xs text-slate-500 font-medium">On-Site SLA Swap</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 font-mono">100%</div>
                <div className="text-xs text-slate-500 font-medium">GST Input Credit</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 font-mono">Grade A+</div>
                <div className="text-xs text-slate-500 font-medium">30-Point Certified</div>
              </div>
            </div>
          </div>

          {/* Right Hero Card: Live Fleet Dispatch */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">
                    Warehouse Dispatch
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Live Corporate Fleet Status</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Stock
                </span>
              </div>

              {/* Item 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-blue-300 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">ThinkPad T490 / T14 Fleets</h4>
                    <p className="text-[11px] text-slate-500">Core i5/i7 • 16GB • 512GB NVMe</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">85 Units</span>
                  <p className="text-[10px] text-slate-400">Rent ₹1,450/mo</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-blue-300 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Dell UltraSharp 24" IPS Displays</h4>
                    <p className="text-[11px] text-slate-500">Height Adjustable Pivot Stand</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">110 Units</span>
                  <p className="text-[10px] text-slate-400">Wholesale ₹5,499</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-blue-300 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">16GB DDR4 & RTX 3060 Parts</h4>
                    <p className="text-[11px] text-slate-500">MemTest86 & FurMark Certified</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">In Stock</span>
                  <p className="text-[10px] text-slate-400">Ready to Ship</p>
                </div>
              </div>

              <button
                onClick={() => openRFQ('Priority Sample Inspection')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition shadow flex items-center justify-center gap-2"
              >
                <span>Book Priority Inspection Sample</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTOR BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-mono font-semibold">
          Supplying Hardware Infrastructure to Leading Sectors
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" /> BPOs & 24/7 Call Centers
          </span>
          <span className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-600" /> Software & SaaS Startups
          </span>
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600" /> 3D VFX & Animation Studios
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> CA, Auditing & Law Firms
          </span>
        </div>
      </section>

      {/* 3. 5 CORE ENTERPRISE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
            Complete Asset Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our 5 Core Corporate IT Solutions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From provisioning 10 laptops to furnishing a 500-seat corporate office facility, we handle hardware sourcing, repair maintenance, and e-waste buyback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Bulk Laptops */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                Bulk Laptop & Desktop Supply
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct wholesale sourcing of tier-1 enterprise series machines (ThinkPad, Latitude, EliteBook). 100% genuine components with Windows 11 Pro genuine licensing.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Minimum Order: 5 to 500+ Units
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 6 to 12 Months Hardware Warranty
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 60% lower costs than brand-new retail
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => openRFQ('Bulk Laptop Supply Inquiry')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Inquire Wholesale Rates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Corporate Rental */}
          <div className="bg-white rounded-2xl p-7 border-2 border-blue-600 shadow-xl shadow-blue-600/10 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular B2B
            </span>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Corporate Laptop Rentals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero capital expenditure (CAPEX). Rent top-grade Core i5/i7 laptops and monitors on monthly or annual contracts with free on-site maintenance.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Flexible tenure: 1 month to 3 years
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free replacement machines during repairs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Zero security deposit for GST entities
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <a
                href="#rental-calculator"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <span>Use Rental Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Components Trading */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-purple-400 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition">
                Components Trading (RAM/GPU/CPU)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bulk supply of high-demand PC hardware components: DDR4/DDR5 RAM sticks, PCIe NVMe SSDs, workstation GPUs, and processors.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Samsung / Micron 8GB, 16GB, 32GB RAM
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> NVIDIA RTX 3060 / 3070 / 4060 GPUs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Burn-in bench tested with MemTest86
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => openRFQ('Wholesale Component Inquiry')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Get Component Price Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Corporate Repair & AMC */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition">
                Chip-Level Repair & Corporate AMC
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated hardware support contracts for offices. Motherboard chip-level diagnostics, broken display replacements, thermal servicing, and system upgrades.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Standby backup laptop during repair
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Quarterly preventive maintenance checks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> On-site engineer visit within 24 hours
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => openRFQ('Corporate AMC Setup Inquiry')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Setup AMC Contract</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 5: IT Asset Buyback (2 cols on lg) */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group lg:col-span-2">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">
                Corporate Asset Liquidation & E-Waste Buyback
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upgrading your office IT fleet? Turn your outdated, slow, or scrap laptops, monitors, and servers into instant cash. We offer fair market bulk valuations, certified data sanitization certificates, and seamless doorstep collection.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  100% Certified Data Wipe
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Immediate Wire Transfer / Cheque
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Doorstep Logistics Pickup
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Link
                to="/buyback"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow"
              >
                <span>Calculate Asset Buyback Valuation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOG SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
              Ready Stock Catalog
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Commercial Hardware
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Grade A+ tested units available for immediate dispatch or rental lease.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Grade A+ Certified
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      Stock: {p.stock_quantity} Units
                    </span>
                  </div>

                  <div className="h-44 rounded-xl bg-slate-50 flex items-center justify-center p-3 mb-4 overflow-hidden border border-slate-100">
                    <img
                      src={getProductImage(p)}
                      alt={p.title}
                      className="h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <Link to={`/products/${p.slug}`} className="hover:text-blue-600 transition">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 font-heading">{p.title}</h3>
                  </Link>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 min-h-[32px] font-mono text-[11px]">
                    {getProductSpecSummary(p)}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Buy / Rent
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      ₹{p.sale_price.toLocaleString('en-IN')}{' '}
                      {p.rental_price_monthly > 0 && (
                        <span className="text-xs text-slate-500 font-normal">
                          or ₹{p.rental_price_monthly.toLocaleString('en-IN')}/mo
                        </span>
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => openRFQ(`${p.title} (${p.stock_quantity} in stock)`)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow"
                  >
                    Inquire Bulk
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. INTERACTIVE CORPORATE RENTAL CALCULATOR */}
      <section id="rental-calculator" className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Instant Cost Projection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Corporate Rental Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Customize device tier, fleet size, and tenure to calculate accurate operating costs with zero maintenance overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Tier Selection */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-3">
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
                    className={`p-3.5 rounded-xl text-left border transition ${
                      calcTier.key === 'standard'
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="font-bold block">Office Essential</span>
                    <span className="text-[11px] opacity-80 block">Core i5 • 8GB • SSD</span>
                    <span className="text-xs font-mono mt-2 block font-semibold">₹1,350/mo</span>
                  </button>

                  <button
                    onClick={() =>
                      setCalcTier({
                        key: 'developer',
                        basePrice: 1850,
                        name: 'Developer Pro (Core i7)'
                      })
                    }
                    className={`p-3.5 rounded-xl text-left border transition ${
                      calcTier.key === 'developer'
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="font-bold block">Developer Pro</span>
                    <span className="text-[11px] opacity-80 block">Core i7 • 16GB • NVMe</span>
                    <span className="text-xs font-mono mt-2 block font-semibold text-emerald-400">
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
                    className={`p-3.5 rounded-xl text-left border transition ${
                      calcTier.key === 'workstation'
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="font-bold block">VFX / GPU Rig</span>
                    <span className="text-[11px] opacity-80 block">32GB • RTX Graphics</span>
                    <span className="text-xs font-mono mt-2 block font-semibold text-purple-400">
                      ₹3,200/mo
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. Quantity Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono uppercase text-slate-400 font-bold">
                    2. Device Fleet Quantity
                  </label>
                  <span className="text-sm font-bold font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/30">
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
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>5 Units (MOQ)</span>
                  <span>50 Units</span>
                  <span>100 Units</span>
                  <span>150+ Units</span>
                </div>
              </div>

              {/* 3. Duration Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-3">
                  3. Contract Tenure
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() =>
                      setCalcDuration({ key: '1-3m', multiplier: 1.15, name: '1–3 Months' })
                    }
                    className={`py-2.5 rounded-xl font-bold border transition ${
                      calcDuration.key === '1-3m'
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    1–3 Months
                  </button>
                  <button
                    onClick={() =>
                      setCalcDuration({ key: '6m', multiplier: 1.0, name: '6 Months (Std)' })
                    }
                    className={`py-2.5 rounded-xl font-bold border transition ${
                      calcDuration.key === '6m'
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    6 Months
                  </button>
                  <button
                    onClick={() =>
                      setCalcDuration({ key: '12m', multiplier: 0.85, name: '12+ Months (15% Off)' })
                    }
                    className={`py-2.5 rounded-xl font-bold border transition ${
                      calcDuration.key === '12m'
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    12+ Mo (15% Off)
                  </button>
                </div>
              </div>
            </div>

            {/* Estimate Summary */}
            <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-7 rounded-2xl border border-slate-700/80 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono font-semibold">
                  Fleet Quotation Estimate
                </span>
                {volumeDiscountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    {volumeDiscountPercent}% Fleet Rebate Applied
                  </span>
                )}
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono">
                  ₹{totalMonthlyRental.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-slate-400 font-sans">
                    {includeGst ? '/ month (Incl. 18% GST)' : '/ month + 18% GST'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800">
                  <span>Include 18% GST in Display</span>
                  <button
                    type="button"
                    onClick={() => setIncludeGst(!includeGst)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                      includeGst ? 'bg-blue-600' : 'bg-slate-700'
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

              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 24-48h SLA swap standby machines & on-site repair included
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
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
                  <span className="font-semibold text-blue-400">₹{perUnitRental}/mo</span>
                </div>
                {includeGst && (
                  <div className="flex justify-between text-slate-400 border-t border-slate-800/60 pt-2">
                    <span>18% GST (100% Tax Credit on GSTR-2B):</span>
                    <span className="font-mono text-emerald-400">+₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleRentalBook}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Lock In This Fleet Quotation</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 30-POINT TESTING PROTOCOL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
            Zero-Defect Commitment
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Our 30-Point Hardware Testing Protocol
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Every single laptop and component undergoes rigorous diagnostic stress-testing before delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Battery & Charger Health</h4>
            <p className="text-slate-600 leading-relaxed">
              Minimum 80%+ battery health capacity verified. Degraded battery cells are rejected and OEM original chargers are tested under load.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">SSD & RAM Stress Diagnostics</h4>
            <p className="text-slate-600 leading-relaxed">
              MemTest86 memory benchmark tests and CrystalDiskInfo 100% SMART health checks to verify 0 bad sectors on NVMe drives.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Thermometer className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Thermal Repasting & Clean</h4>
            <p className="text-slate-600 leading-relaxed">
              Internal heatsink fan overhaul and fresh Arctic MX-4 thermal paste application to eliminate thermal throttling under developer workloads.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Clean Legal Enterprise Title</h4>
            <p className="text-slate-600 leading-relaxed">
              Sourced legally from corporate asset refreshes with serial number logging, full GST tax invoicing, and clear ownership documentation.
            </p>
          </div>
        </div>
      </section>

      {/* 7. QUICK BUYBACK / LIQUIDATION VALUATION FORM */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-md uppercase font-mono tracking-wider">
                Asset Liquidation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Got Outdated Office Hardware? We Buy In Bulk.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If your company is replacing older laptops, desktop towers, or LCD screens, don't let them gather dust. We purchase used IT hardware lots from 10 to 1,000+ units with certified data wiping and instant payment.
              </p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free on-site hardware inspection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> NIST 800-88 compliant secure data wiping
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Doorstep collection across India
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm">
              <form onSubmit={handleBuybackSubmit} className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900">Get Instant Asset Valuation</h3>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex FinTech Solutions"
                    value={buybackForm.company_name}
                    onChange={(e) => setBuybackForm({ ...buybackForm, company_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      placeholder="e.g. IT Manager"
                      value={buybackForm.contact_person}
                      onChange={(e) => setBuybackForm({ ...buybackForm, contact_person: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={buybackForm.phone}
                      onChange={(e) => setBuybackForm({ ...buybackForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Approx Quantity</label>
                    <input
                      type="number"
                      value={buybackForm.approx_quantity}
                      onChange={(e) => setBuybackForm({ ...buybackForm, approx_quantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Office City</label>
                    <input
                      type="text"
                      value={buybackForm.city}
                      onChange={(e) => setBuybackForm({ ...buybackForm, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow"
                >
                  Request Asset Valuation Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PROCUREMENT FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
            Clarity for IT Heads & Procurement
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
                className="bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer hover:border-slate-300 transition"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {isExpanded && (
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
