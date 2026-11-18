import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  FileText,
  Truck,
  RotateCcw,
  Lock,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  ArrowRight,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Award
} from 'lucide-react';

const TABS = [
  {
    id: 'terms',
    label: 'Terms & Conditions',
    subtitle: 'Master B2B Sales & Purchase Agreement',
    icon: Scale,
    badge: 'Legal Agreement'
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    subtitle: 'DPDP Act 2023 & Enterprise Confidentiality',
    icon: Lock,
    badge: 'Data Security'
  },
  {
    id: 'rental-sla',
    label: 'Corporate Rental SLA',
    subtitle: 'Fleet Master Service Agreement & Uptime Guarantee',
    icon: ShieldCheck,
    badge: 'SLA Guaranteed'
  },
  {
    id: 'shipping',
    label: 'Pan-India Dispatch Policy',
    subtitle: 'Logistics, Transit Insurance & WFH Delivery',
    icon: Truck,
    badge: '100% Insured'
  },
  {
    id: 'warranty',
    label: 'Warranty & Replacement',
    subtitle: '30-Day DOA Swap & Comprehensive Hardware Coverage',
    icon: RotateCcw,
    badge: 'Grade A+ Certified'
  }
];

export default function Legal({ defaultTab = 'terms' }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path or prop
  const getTabFromPath = () => {
    const path = location.pathname.replace(/^\//, '').toLowerCase();
    if (path === 'terms') return 'terms';
    if (path === 'privacy') return 'privacy';
    if (path === 'rental-sla') return 'rental-sla';
    if (path === 'shipping-policy' || path === 'shipping') return 'shipping';
    if (path === 'warranty-policy' || path === 'warranty') return 'warranty';
    return defaultTab;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, defaultTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Map tabId to standard URL route
    const routeMap = {
      terms: '/terms',
      privacy: '/privacy',
      'rental-sla': '/rental-sla',
      shipping: '/shipping-policy',
      warranty: '/warranty-policy'
    };
    navigate(routeMap[tabId] || `/legal?tab=${tabId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0D3B2A] font-sans antialiased pb-20">
      {/* ── TOP HERO / HEADER ────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#0D3B2A] to-[#124E38] text-[#FAF7F2] pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4A24C]/30 relative overflow-hidden">
        {/* Subtle background luxury pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4A24C_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2]/10 border border-[#D4A24C]/40 text-[#D4A24C] text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#D4A24C]" />
              Official Corporate Compliance Portal
            </div>

            <div className="flex items-center gap-2 text-xs text-[#FAF7F2]/70">
              <span>Effective Date:</span>
              <span className="font-mono text-[#FAF7F2] font-semibold">April 1, 2026 (FY 2026-27)</span>
              <span className="text-[#D4A24C]">·</span>
              <span>CIN:</span>
              <span className="font-mono text-[#FAF7F2]/90">U72900DL2021PTC123456</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#FAF7F2] tracking-tight leading-tight mb-3">
                Legal Instruments & Commercial Governance
              </h1>
              <p className="text-sm sm:text-base text-[#FAF7F2]/80 leading-relaxed">
                Legally binding frameworks, statutory GST billing protocols, NIST-compliant cryptographic data protection, and enterprise SLA commitments governing Nova Infotech Enterprise Solutions.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 border border-[#FAF7F2]/20 text-xs font-semibold text-[#FAF7F2] transition-colors cursor-pointer"
                title="Print or Save PDF copy of this legal policy"
              >
                <Printer className="w-4 h-4 text-[#D4A24C]" />
                Print / Save PDF
              </button>
              <a
                href="mailto:legal@novainfotech.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4A24C] hover:bg-[#c29342] text-[#0D3B2A] text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                <Mail className="w-4 h-4" />
                Legal Desk
              </a>
            </div>
          </div>

          {/* Quick Legal Entity Card */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#092B1E]/60 border border-[#D4A24C]/25 text-xs">
            <div>
              <div className="text-[#FAF7F2]/60 uppercase tracking-wider text-[10px]">Registered Entity</div>
              <div className="font-semibold text-[#FAF7F2] mt-0.5">Nova Infotech Solutions Pvt. Ltd.</div>
            </div>
            <div>
              <div className="text-[#FAF7F2]/60 uppercase tracking-wider text-[10px]">GSTIN Registration</div>
              <div className="font-mono font-semibold text-[#D4A24C] mt-0.5">07AABCN1234F1Z8 (Delhi)</div>
            </div>
            <div>
              <div className="text-[#FAF7F2]/60 uppercase tracking-wider text-[10px]">Jurisdiction</div>
              <div className="font-semibold text-[#FAF7F2] mt-0.5">Courts of New Delhi, India</div>
            </div>
            <div>
              <div className="text-[#FAF7F2]/60 uppercase tracking-wider text-[10px]">Compliance Standard</div>
              <div className="font-semibold text-[#FAF7F2] mt-0.5">ISO 9001:2015 & DPDP 2023</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT WORKSPACE ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── STICKY SIDEBAR NAVIGATION (4 Cols) ───────────────────── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-[#D4A24C]/25 p-4 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0D3B2A]/70 mb-3 px-2">
                Legal Documents Index
              </h2>

              <nav className="space-y-1.5" aria-label="Legal navigation">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3.5 group cursor-pointer ${
                        isActive
                          ? 'bg-[#0D3B2A] text-[#FAF7F2] shadow-md'
                          : 'hover:bg-[#FAF7F2] text-[#0D3B2A] border border-transparent hover:border-[#D4A24C]/20'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#D4A24C] text-[#0D3B2A]'
                            : 'bg-[#0D3B2A]/5 text-[#0D3B2A] group-hover:bg-[#D4A24C]/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isActive ? 'text-[#FAF7F2]' : 'text-[#0D3B2A]'}`}>
                            {tab.label}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              isActive
                                ? 'bg-[#FAF7F2]/20 text-[#FAF7F2]'
                                : 'bg-[#0D3B2A]/5 text-[#0D3B2A]/70'
                            }`}
                          >
                            {tab.badge}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-[#FAF7F2]/80' : 'text-[#0D3B2A]/60'}`}>
                          {tab.subtitle}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                          isActive ? 'text-[#D4A24C] translate-x-0.5' : 'text-gray-300 group-hover:text-[#0D3B2A]'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>

              {/* Direct Help / Verification Box */}
              <div className="mt-6 p-4 rounded-xl bg-[#0D3B2A]/5 border border-[#D4A24C]/20 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#0D3B2A] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#D4A24C]" />
                  Statutory Invoicing Verification
                </div>
                <p className="text-[11px] text-[#0D3B2A]/80 leading-relaxed mb-3">
                  All enterprise purchase and rental invoices carry valid HSN/SAC codes (8471 / 997314) and reflect in your GST portal GSTR-2B for eligible ITC claims.
                </p>
                <div className="pt-2 border-t border-[#0D3B2A]/10 flex flex-col gap-1 text-[11px]">
                  <span className="text-[#0D3B2A]/70">Grievance / Dispute Officer:</span>
                  <a href="mailto:grievance@novainfotech.com" className="font-semibold text-[#0D3B2A] hover:text-[#D4A24C] underline">
                    grievance@novainfotech.com
                  </a>
                  <span className="text-[#0D3B2A]/70 mt-1">Official Desk: +91 98100 00000</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── ACTIVE DOCUMENT CONTENT (8 Cols) ────────────────────── */}
          <main className="lg:col-span-8 bg-white rounded-2xl border border-[#D4A24C]/25 p-6 sm:p-10 shadow-sm">
            
            {/* 1. TERMS & CONDITIONS */}
            {activeTab === 'terms' && (
              <article className="space-y-8 animate-fadeIn">
                <header className="border-b border-[#0D3B2A]/10 pb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A24C] uppercase tracking-wider mb-1">
                    <Scale className="w-4 h-4" />
                    Instrument No. NI-MSA-2026-v2.4
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
                    Master Commercial Terms & Conditions of Sale
                  </h2>
                  <p className="text-xs sm:text-sm text-[#0D3B2A]/70 mt-1">
                    Governing outright purchase of refurbished & brand-new IT workstations, laptops, components, and enterprise server hardware.
                  </p>
                </header>

                <div className="space-y-6 text-sm text-[#0D3B2A]/85 leading-relaxed">
                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">1</span>
                      Scope of Agreement & Corporate Eligibility
                    </h3>
                    <p>
                      This Master Commercial Sales Agreement is entered into by and between <strong>Nova Infotech Enterprise Solutions Pvt. Ltd.</strong> ("Seller", "Nova Infotech") and the entity or individual ("Buyer", "Customer") placing a purchase order or electronic checkout transaction through this portal.
                    </p>
                    <p>
                      Corporate clients seeking business invoicing must provide a legitimate, active 15-digit Goods and Services Tax Identification Number (GSTIN) during checkout. Orders placed under corporate GSTIN are deemed B2B commercial transactions and are governed by commercial contract laws of India.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">2</span>
                      Quotations, Purchase Orders & Invoicing
                    </h3>
                    <p>
                      Formal electronic quotations generated via the "Request RFQ" system remain legally binding for <strong>15 calendar days</strong> from the timestamp of issuance, subject to physical stock availability. Nova Infotech reserves the right to adjust commercial quotations if global semiconductor or currency exchange rates fluctuate beyond 5%.
                    </p>
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/30 text-xs space-y-1.5">
                      <div className="font-bold text-[#0D3B2A] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#0D3B2A]" />
                        Tax Invoicing & GSTR-2B Reconciliation Guarantee
                      </div>
                      <p className="text-[#0D3B2A]/80">
                        Every commercial transaction is accompanied by an 18% GST tax invoice (HSN Code 8471 for computers & peripherals). Invoices are uploaded to the GSTN portal on or before the 11th of each consecutive month, guaranteeing seamless Input Tax Credit (ITC) reflection in your GSTR-2B statement.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">3</span>
                      Grade A+ Certification & Quality Benchmark
                    </h3>
                    <p>
                      Unless explicitly marked as "Brand New Sealed", all corporate systems sold by Nova Infotech are classified as <strong>Grade A+ Certified Enterprise Refurbished</strong>. Each device undergoes our proprietary 30-Point Rigorous Diagnostic Audit, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0D3B2A]/80">
                      <li>Motherboard logic board VRM stress test and zero-corrosion visual inspection.</li>
                      <li>SMART health verification of NVMe/SSD storage (&gt;85% endurance threshold).</li>
                      <li>OEM Battery capacity benchmark retaining a minimum of 80% original design milliampere-hour (mAh) capacity.</li>
                      <li>Thermals repasted using premium thermal interface materials (Shin-Etsu / Arctic MX-4).</li>
                      <li>Cosmetic chassis grading confirming minimal micro-abrasions with zero structural fissures or missing keyboard mechanics.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">4</span>
                      Payment Terms & Title of Goods
                    </h3>
                    <p>
                      Full title, ownership, and property in the goods shall remain with Nova Infotech and will not pass to the Buyer until the invoice value, including applicable GST and shipping levies, has been settled in full. For pre-approved enterprise clients operating on Net-30 credit lines, default in payment beyond 30 days shall attract commercial interest at 18% per annum computed from the due date.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">5</span>
                      Governing Law & Dispute Resolution
                    </h3>
                    <p>
                      This Agreement and all purchase contracts executed hereunder shall be construed in accordance with the substantive laws of the Republic of India. Any controversy, claim, or dispute arising out of or relating to this Agreement shall be referred to arbitration under the <em>Arbitration and Conciliation Act, 1996</em>. The seat and venue of arbitration shall be New Delhi, India. The courts of New Delhi shall possess sole and exclusive jurisdiction.
                    </p>
                  </section>
                </div>
              </article>
            )}

            {/* 2. PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <article className="space-y-8 animate-fadeIn">
                <header className="border-b border-[#0D3B2A]/10 pb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A24C] uppercase tracking-wider mb-1">
                    <Lock className="w-4 h-4" />
                    DPDP Act 2023 & ISO 27001 Alignment
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
                    Corporate Privacy Policy & Data Protection Framework
                  </h2>
                  <p className="text-xs sm:text-sm text-[#0D3B2A]/70 mt-1">
                    Our strict statutory obligations under the Digital Personal Data Protection Act, 2023 and cryptographic storage sanitization protocols.
                  </p>
                </header>

                <div className="space-y-6 text-sm text-[#0D3B2A]/85 leading-relaxed">
                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">1</span>
                      Statutory Commitment & Non-Commercialization of Data
                    </h3>
                    <p>
                      Nova Infotech Enterprise Solutions respects your enterprise privacy. <strong>We do not sell, rent, monetize, or broker corporate purchaser contact records, procurement orders, or technical inventory lists to third-party data brokers or marketing syndicates.</strong> All data acquired during RFQ submissions, account registrations, or KYC checks is utilized strictly for order fulfillment, statutory taxation, and warranty execution.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">2</span>
                      Information Collected for Corporate Verification
                    </h3>
                    <p>
                      To satisfy Indian Anti-Money Laundering (AML) standards and GST statutory requirements, we collect:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0D3B2A]/80">
                      <li>Corporate entity details: Registered corporate name, GSTIN certificate, PAN card copy.</li>
                      <li>Authorized administrative contact: Full name, business email address, direct phone contact.</li>
                      <li>Dispatch coordinates: Corporate facility address, floor/dock details, or verified WFH residential shipping addresses for remote team members.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <div className="p-4 rounded-xl bg-[#0D3B2A]/5 border border-[#D4A24C]/30 space-y-2">
                      <div className="font-bold text-[#0D3B2A] flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#D4A24C]" />
                        NIST SP 800-88 Rev. 1 Cryptographic Data Sanitization Guarantee
                      </div>
                      <p className="text-xs sm:text-sm text-[#0D3B2A]/80 leading-relaxed">
                        When acquiring decommissioned corporate assets through our <strong>Liquidation & Buyback Desk</strong> or processing returned rental workstations, every magnetic spindle (HDD) and solid-state flash module (NVMe/SATA SSD) is subjected to a permanent 3-Pass Overwrite sanitization adhering strictly to <strong>NIST SP 800-88 Rev. 1 guidelines</strong>. An electronic, tamper-proof Certificate of Destruction (CoD) referencing device serial numbers is issued upon batch completion.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">3</span>
                      Data Principal Rights under DPDP Act 2023
                    </h3>
                    <p>
                      Corporate representatives and individual customers maintain full legal rights under the DPDP Act 2023 to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0D3B2A]/80">
                      <li>Request a summary of personal and commercial data processed by our systems.</li>
                      <li>Request the rectification of inaccurate contact or corporate GST records.</li>
                      <li>Exercise the right to erasure, subject to mandatory 8-year preservation under Indian Income Tax & GST audit regulations.</li>
                      <li>Nominate an alternate corporate representative for operational ticket management.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">4</span>
                      Data Protection Officer (DPO) Contact
                    </h3>
                    <p>
                      For privacy inquiries, audit reviews, or formal data principal grievance redressals, contact our designated Data Protection Officer:
                    </p>
                    <div className="p-4 rounded-xl bg-white border border-[#D4A24C]/25 text-xs space-y-1">
                      <div className="font-bold text-[#0D3B2A]">Office of the Data Protection Officer</div>
                      <div className="text-[#0D3B2A]/70">Nova Infotech Enterprise Solutions Pvt. Ltd.</div>
                      <div className="text-[#0D3B2A]/70">Nehru Place Commercial Complex, New Delhi - 110019</div>
                      <div className="text-[#0D3B2A]">Email: <a href="mailto:dpo@novainfotech.com" className="font-bold underline text-[#D4A24C]">dpo@novainfotech.com</a></div>
                    </div>
                  </section>
                </div>
              </article>
            )}

            {/* 3. CORPORATE RENTAL SLA */}
            {activeTab === 'rental-sla' && (
              <article className="space-y-8 animate-fadeIn">
                <header className="border-b border-[#0D3B2A]/10 pb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A24C] uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    Enterprise Uptime & Swap Guarantee
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
                    Corporate Rental Service Level Agreement (SLA)
                  </h2>
                  <p className="text-xs sm:text-sm text-[#0D3B2A]/70 mt-1">
                    Contractual terms governing Zero-CAPEX leasing, 24–48h hardware hot-swap standby units, security deposits, and maintenance obligations.
                  </p>
                </header>

                <div className="space-y-6 text-sm text-[#0D3B2A]/85 leading-relaxed">
                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">1</span>
                      Rental Tenures & Billing Cycles
                    </h3>
                    <p>
                      Equipment leased under our Corporate Rental Program is subject to an agreed minimum operational tenure (1 Month, 3 Months, 6 Months, or 12+ Months). Rental billing cycles operate on a monthly advance model, invoiced on the 1st of each calendar month with standard Net-15 corporate credit settlement terms.
                    </p>
                  </section>

                  {/* Highlighted 24-48h Swap Guarantee */}
                  <div className="p-5 rounded-xl bg-gradient-to-r from-[#0D3B2A] to-[#164E37] text-[#FAF7F2] space-y-2.5 shadow-md">
                    <div className="flex items-center gap-2 text-[#D4A24C] font-bold text-xs uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      Statutory Standby Replacement SLA (Tier 1 & Tier 2)
                    </div>
                    <div className="text-lg font-serif font-bold">
                      24h to 48h Guaranteed Hardware Swap or Credit Adjustment
                    </div>
                    <p className="text-xs text-[#FAF7F2]/80 leading-relaxed">
                      In the event of hardware component failure (Motherboard, GPU, Display, or SSD corruption) not resolvable via remote technical desk intervention, Nova Infotech will dispatch an identical or superior standby unit within <strong>24 hours</strong> across Delhi NCR, and within <strong>48 hours</strong> across all Tier-1 metro destinations (Bangalore, Mumbai, Pune, Hyderabad, Chennai). If we fail to dispatch within this window, a pro-rata daily rental credit is automatically applied to your account.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">2</span>
                      Zero-Collateral Security Deposit Criteria
                    </h3>
                    <p>
                      Enterprises meeting our risk underwriting criteria enjoy <strong>Zero Upfront Security Deposit</strong> leasing:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0D3B2A]/80">
                      <li>Active GSTIN registration with minimum 12 months filing history and zero defaults.</li>
                      <li>Registered Private Limited / Public Limited / LLP corporate structure.</li>
                      <li>Execution of Corporate Master Services Agreement (MSA) signed by authorized director/signatory.</li>
                    </ul>
                    <p className="text-xs text-[#0D3B2A]/70">
                      <em>Early-stage startups, newly incorporated entities, or individual contractors may be requested to maintain a refundable security deposit equivalent to 1 to 2 months rental value.</em>
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">3</span>
                      Fair Wear & Tear vs Accidental Physical Damage
                    </h3>
                    <p>
                      <strong>Included Without Surcharge:</strong> Normal operational wear and tear, micro keyboard key polish, gentle palm-rest rubbing, and natural lithium battery cycle depletion are 100% absorbed by Nova Infotech.
                    </p>
                    <p>
                      <strong>Accidental Damage Policy:</strong> Liquid spillage, cracked display panels caused by drop impact, or physical chassis fracture are billed strictly at <strong>direct OEM component wholesale procurement price</strong> without administrative penalty surcharges. Optional comprehensive accidental damage protection riders are available at ₹150/system/month.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">4</span>
                      Rent-to-Own & Asset Buyout Clause
                    </h3>
                    <p>
                      Tenants leasing workstations for more than 12 consecutive months can convert their rental agreement into an outright purchase through our <strong>Asset Equity Buyout Plan</strong>. Up to 40% of the aggregate rental fees paid over the tenancy will be credited towards the discounted residual salvage value of the equipment.
                    </p>
                  </section>
                </div>
              </article>
            )}

            {/* 4. SHIPPING POLICY */}
            {activeTab === 'shipping' && (
              <article className="space-y-8 animate-fadeIn">
                <header className="border-b border-[#0D3B2A]/10 pb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A24C] uppercase tracking-wider mb-1">
                    <Truck className="w-4 h-4" />
                    Pan-India Logistics & Secure Freight
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
                    Pan-India Logistics, Transit Insurance & Dispatch Policy
                  </h2>
                  <p className="text-xs sm:text-sm text-[#0D3B2A]/70 mt-1">
                    Transit timelines, specialized multi-layer shockproof packaging, and direct-to-employee WFH distribution protocols across 300+ cities.
                  </p>
                </header>

                <div className="space-y-6 text-sm text-[#0D3B2A]/85 leading-relaxed">
                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">1</span>
                      Dispatch Lead Times & Geographic SLA
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/25">
                        <div className="text-xs font-bold text-[#0D3B2A]">Delhi NCR Hub</div>
                        <div className="text-lg font-serif font-bold text-[#0D3B2A] mt-1">Same-Day / 24h</div>
                        <p className="text-[11px] text-[#0D3B2A]/70 mt-1">Dedicated company express delivery fleet with technician handover.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/25">
                        <div className="text-xs font-bold text-[#0D3B2A]">Metro Hubs</div>
                        <div className="text-lg font-serif font-bold text-[#0D3B2A] mt-1">24h to 48h</div>
                        <p className="text-[11px] text-[#0D3B2A]/70 mt-1">Bangalore, Mumbai, Pune, Hyderabad, Chennai, Kolkata via Air Express.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/25">
                        <div className="text-xs font-bold text-[#0D3B2A]">Rest of India</div>
                        <div className="text-lg font-serif font-bold text-[#0D3B2A] mt-1">3 to 4 Days</div>
                        <p className="text-[11px] text-[#0D3B2A]/70 mt-1">Tier-2 and Tier-3 commercial locations via Bluedart, Delhivery & Safexpress.</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">2</span>
                      100% Commercial Transit Insurance
                    </h3>
                    <p>
                      All equipment dispatches—whether a single graphics card or a 200-node corporate laptop fleet—are covered under our comprehensive <strong>All-Risk Marine Transit Cargo Insurance</strong>. In the improbable event of transit theft, road carrier collision, or water damage, Nova Infotech shoulders 100% of the replacement burden and dispatches replacement hardware immediately upon FIR / survey filing.
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">3</span>
                      Multi-Layer Cushioning & Static-Safe Packaging
                    </h3>
                    <p>
                      To prevent microscopic shock trauma during transit, our packaging lab follows a strict 4-step encapsulation process:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0D3B2A]/80">
                      <li><strong>Anti-Static Shielding:</strong> Sealed in conductive ESD anti-static bubble sleeves to eliminate capacitive discharge.</li>
                      <li><strong>Corner Armor:</strong> High-density molded polyurethane foam corner caps absorbing up to 50G impact shock.</li>
                      <li><strong>Heavy-Gauge Corrugation:</strong> 5-ply double-walled burst-tested corrugated shipping outer cartons.</li>
                      <li><strong>Tamper-Evident Tape:</strong> Serialized security barcode tape that reveals void patterns if breached in transit.</li>
                    </ul>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">4</span>
                      Direct-to-Employee (WFH) Enterprise Distribution
                    </h3>
                    <p>
                      Corporate clients undergoing workforce onboarding can submit an employee dispatch roster. Nova Infotech handles individualized pick-pack-and-ship directly to employee residences across 19,000+ Indian pincodes, complete with real-time tracking links sent via SMS and corporate email to HR/IT managers.
                    </p>
                  </section>
                </div>
              </article>
            )}

            {/* 5. WARRANTY POLICY */}
            {activeTab === 'warranty' && (
              <article className="space-y-8 animate-fadeIn">
                <header className="border-b border-[#0D3B2A]/10 pb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A24C] uppercase tracking-wider mb-1">
                    <RotateCcw className="w-4 h-4" />
                    Comprehensive Hardware Guarantee
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
                    Certified Hardware Warranty & 30-Day Instant Replacement
                  </h2>
                  <p className="text-xs sm:text-sm text-[#0D3B2A]/70 mt-1">
                    Zero-hassle component coverage, 30-day DOA machine replacement, and doorstep reverse logistics for all Grade A+ certified systems.
                  </p>
                </header>

                <div className="space-y-6 text-sm text-[#0D3B2A]/85 leading-relaxed">
                  {/* 30-Day Instant Replacement Highlight */}
                  <div className="p-5 rounded-xl bg-[#FAF7F2] border-2 border-[#D4A24C] space-y-2">
                    <div className="flex items-center gap-2 text-[#0D3B2A] font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-[#D4A24C]" />
                      Unconditional 30-Day DOA (Dead-on-Arrival) Replacement
                    </div>
                    <div className="text-lg font-serif font-bold text-[#0D3B2A]">
                      Instant 1-to-1 Device Replacement at Zero Cost
                    </div>
                    <p className="text-xs sm:text-sm text-[#0D3B2A]/80 leading-relaxed">
                      If any workstation, corporate laptop, or enterprise monitor exhibits hardware anomalies (display flicker, thermal throttling, logic board reboot, or memory failure) within <strong>30 calendar days</strong> of receiving the shipment, Nova Infotech issues an instant 1-to-1 replacement machine. We arrange free doorstep reverse pickup and dispatch the replacement immediately upon carrier tracking generation.
                    </p>
                  </div>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">1</span>
                      Standard Warranty Tenures & Subsystem Coverage
                    </h3>
                    <p>
                      Unless extended warranty packages are elected on the invoice, the following baseline warranty applies:
                    </p>
                    <div className="border border-[#0D3B2A]/15 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-[#0D3B2A] text-[#FAF7F2]">
                          <tr>
                            <th className="p-3 font-semibold">Hardware Classification</th>
                            <th className="p-3 font-semibold">Standard Warranty</th>
                            <th className="p-3 font-semibold">Coverage Scope</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0D3B2A]/10">
                          <tr className="bg-white">
                            <td className="p-3 font-bold text-[#0D3B2A]">Grade A+ Refurbished Laptops & Desktops</td>
                            <td className="p-3 font-semibold text-[#0D3B2A]">6 to 12 Months</td>
                            <td className="p-3 text-[#0D3B2A]/80">Motherboard, Processor, RAM, SSD, Display, Trackpad & Charger</td>
                          </tr>
                          <tr className="bg-[#FAF7F2]/60">
                            <td className="p-3 font-bold text-[#0D3B2A]">Brand New Sealed Units</td>
                            <td className="p-3 font-semibold text-[#0D3B2A]">12 to 36 Months</td>
                            <td className="p-3 text-[#0D3B2A]/80">Official OEM Manufacturer On-Site Support (Dell/Lenovo/HP/Apple)</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="p-3 font-bold text-[#0D3B2A]">Workstation GPUs & Dedicated Cards</td>
                            <td className="p-3 font-semibold text-[#0D3B2A]">6 Months Replacement</td>
                            <td className="p-3 text-[#0D3B2A]/80">VRAM, Fan mechanics, VRM circuitry, PCIe bus integrity</td>
                          </tr>
                          <tr className="bg-[#FAF7F2]/60">
                            <td className="p-3 font-bold text-[#0D3B2A]">Internal Batteries (Refurbished)</td>
                            <td className="p-3 font-semibold text-[#0D3B2A]">3 Months</td>
                            <td className="p-3 text-[#0D3B2A]/80">Guaranteed &gt;80% capacity retention; instant battery replacement if degraded</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">2</span>
                      Simple 3-Step Warranty Claim Protocol
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/20 text-xs">
                        <div className="font-bold text-[#0D3B2A] mb-1">Step 1: Ticket Logging</div>
                        <p className="text-[#0D3B2A]/70">
                          Submit serial number and issue video via support portal or WhatsApp Support desk (+91 98100 00000).
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/20 text-xs">
                        <div className="font-bold text-[#0D3B2A] mb-1">Step 2: Remote Triage</div>
                        <p className="text-[#0D3B2A]/70">
                          Senior diagnostic engineer conducts remote telemetry inspection within 2 business hours.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/20 text-xs">
                        <div className="font-bold text-[#0D3B2A] mb-1">Step 3: Doorstep Swap</div>
                        <p className="text-[#0D3B2A]/70">
                          Pre-paid reverse air pickup or direct technician visit scheduled for immediate replacement.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-base font-serif font-bold text-[#0D3B2A] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D3B2A] text-[#FAF7F2] text-xs flex items-center justify-center font-mono font-bold">3</span>
                      Warranty Exclusions
                    </h3>
                    <p className="text-xs text-[#0D3B2A]/80 leading-relaxed">
                      Warranty coverage will be invalidated if equipment displays evidence of: unauthorized third-party board-level soldering/rework, deliberate serial barcode removal/defacement, high-voltage lightning surge damages without surge protectors, or liquid submersion not protected by an optional accidental coverage rider.
                    </p>
                  </section>
                </div>
              </article>
            )}

            {/* Bottom Support / Escalation Footer */}
            <div className="mt-10 pt-6 border-t border-[#0D3B2A]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#0D3B2A]/70">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4A24C]" />
                <span>Need legal clarification on corporate lease agreements?</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="mailto:legal@novainfotech.com" className="font-bold text-[#0D3B2A] hover:text-[#D4A24C] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#D4A24C]" />
                  legal@novainfotech.com
                </a>
                <span className="text-[#D4A24C]">·</span>
                <Link to="/contact" className="font-bold text-[#0D3B2A] hover:text-[#D4A24C] flex items-center gap-1">
                  Contact Helpdesk
                  <ArrowRight className="w-3 h-3 text-[#D4A24C]" />
                </Link>
              </div>
            </div>

          </main>

        </div>
      </div>
    </div>
  );
}
