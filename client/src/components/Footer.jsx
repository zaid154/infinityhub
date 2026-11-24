import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import BrandLogo from './BrandLogo';
import { useCompany } from '../context/SettingsContext';
import { AnimatedCheck } from '../animations';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Enterprise B2B Footer (Al-Tooba Sacred Forest Minimalist Style)
 * Clean, spacious, uncluttered typography matching the exact aesthetic of Al-Tooba:
 * - Left: Brand wordmark, 2-line bio, inline pill newsletter input
 * - Center: Structured navigation columns (Hardware Fleets, Enterprise Solutions)
 * - Right: Contact, Headquarters, and Statutory Compliance Desk
 * - Divider: Clean full-width line
 * - Bottom Bar: Wide-tracked uppercase legal policy links + copyright
 */
export default function Footer() {
  const { company } = useCompany();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Helper to remove any stray [PLACEHOLDER] or [DEMO] tags from settings data
  const sanitize = (text, fallback = '') => {
    if (!text || typeof text !== 'string') return fallback;
    const clean = text
      .replace(/\s*\[PLACEHOLDER\]/gi, '')
      .replace(/\s*\[DEMO\]/gi, '')
      .trim();
    return clean || fallback;
  };

  const brandName = sanitize(company?.brand_name, 'Demo Infotech');
  const legalName = sanitize(company?.legal_name, 'Demo Infotech Private Limited');
  const gstin = sanitize(company?.gst_number, '07AAAAA0000A1Z5');
  const cin = sanitize(company?.cin_number, 'U72900DL2024PTC394812');
  const regAddress = sanitize(
    company?.registered_address || company?.address,
    'Unit No. 101, First Floor, Commercial Tower, Barakhamba Road, Connaught Place, New Delhi 110001, India'
  );
  const phone = sanitize(company?.phone, '+91 11 4123 4567');
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const supportEmail = sanitize(company?.procurement_email || company?.email, 'procurement@demoinfotech.in');
  const grievance = {
    name: sanitize(company?.grievance_officer?.name, 'Adv. R. K. Sharma'),
    designation: sanitize(company?.grievance_officer?.designation, 'Head of Legal & Enterprise Compliance'),
    email: sanitize(company?.grievance_officer?.email, 'grievance@demoinfotech.in'),
    phone: sanitize(company?.grievance_officer?.phone, '+91 11 4123 4568'),
    address: sanitize(
      company?.grievance_officer?.address,
      'Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001'
    )
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your work email address.');
      return;
    }
    if (!consent) {
      toast.error('Please accept the DPDP corporate email consent.');
      return;
    }

    setSubscribing(true);
    try {
      const res = await api.post('/newsletter/subscribe', {
        email,
        consent_given: true,
        source: 'footer_form'
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'Thank you! You are subscribed to our enterprise fleet updates.');
        setEmail('');
        setConsent(false);
        setSubscribed(true);
        setTimeout(() => setSubscribed(false), 4000);
      } else {
        toast.error(res.data?.message || 'Subscription could not be completed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed. Please contact our procurement desk.');
    } finally {
      setSubscribing(false);
    }
  };

  // Structured JSON-LD Organization Schema for Enterprise SEO & Legal Verifiability
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brandName,
    legalName: legalName,
    url: company?.website_url || 'http://localhost:5173',
    logo: company?.logo_url || 'http://localhost:5173/server.svg',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: phone,
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi']
      }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: regAddress,
      addressCountry: 'IN'
    }
  };

  return (
    <footer className="relative bg-[#072117] text-[#90b09a] pt-16 pb-10 border-t border-[#FAF7F2]/10 overflow-hidden font-sans">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-12">
        {/* ======================================================== */}
        {/* ROW 1: 4-COLUMN AL-TOOBA STYLE ARCHITECTURE              */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1 (lg:col-span-4): Brand Logo, Bio & Pill Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-5 pr-0 lg:pr-6">
            <BrandLogo theme="dark" showSubtitle={false} size="lg" />

            <p className="text-xs sm:text-sm leading-relaxed text-[#90b09a]/90 font-sans max-w-sm">
              {brandName} provisions enterprise commercial hardware, flexible corporate rental leases, and verified IT asset disposition across India with guaranteed 24–48h SLA response.
            </p>

            {/* Al-Tooba Style Inline Pill Newsletter Form */}
            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1 max-w-sm">
              <div className="flex items-center bg-[#0D3B2A]/70 border border-[#FAF7F2]/25 rounded-full p-1 hover:border-[#D4A24C]/60 transition-colors focus-within:border-[#D4A24C] shadow-sm min-h-11">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Work Email Address"
                  className="w-full pl-4 pr-2 py-2 bg-transparent text-[#FAF7F2] placeholder-[#90b09a]/70 outline-none text-base sm:text-xs border-none focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={subscribing || subscribed}
                  className="rounded-full px-5 py-2 min-h-10 sm:min-h-8 bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] text-[10px] font-sans font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer active:scale-95 disabled:opacity-70 flex items-center gap-1.5 shadow-sm"
                >
                  {subscribed ? (
                    <>
                      <AnimatedCheck size={13} color="#072117" circleColor="#D4A24C" />
                      <span>Subscribed</span>
                    </>
                  ) : subscribing ? (
                    'Joining...'
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>

              {/* DPDP Act 2023 Consent Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer text-[10px] text-[#90b09a]/80 leading-snug select-none pl-1">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 accent-[#D4A24C] rounded shrink-0 cursor-pointer"
                />
                <span>
                  I consent to {brandName} processing my corporate email for hardware & laptop availability updates under the{' '}
                  <Link to="/privacy" className="text-[#D4A24C] underline hover:text-[#FAF7F2]">
                    Privacy Policy
                  </Link>
                  . Unsubscribe anytime.
                </span>
              </label>
            </form>
          </div>

          {/* Column 2 (lg:col-span-2): SHOP & EXPLORE (Hardware Fleets) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-white">
              Shop & Explore
            </h3>
            <ul className="text-xs space-y-2.5 flex flex-col text-[#90b09a]">
              <li>
                <Link to="/products" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  All Inventory
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  ThinkPad T-Series
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  Dell Latitude Series
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  HP EliteBook Corporate
                </Link>
              </li>
              <li>
                <Link to="/products?category=gpu" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  Precision Workstations
                </Link>
              </li>
              <li>
                <Link to="/products?category=monitor" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  Frameless IPS Displays
                </Link>
              </li>
              <li>
                <Link to="/refurbished-disclosure" className="text-[#D4A24C] hover:text-white hover:translate-x-1 inline-block font-semibold transition-transform duration-200">
                  Grade A+ Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 (lg:col-span-3): OUR SERVICES & SOLUTIONS */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-white">
              Solutions & SLA
            </h3>
            <ul className="text-xs space-y-2.5 flex flex-col text-[#90b09a]">
              <li>
                <Link to="/rental" className="text-[#D4A24C] font-bold hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  Corporate Laptop Rentals
                </Link>
              </li>
              <li>
                <Link to="/rental" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  Rental Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/buyback" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  Asset Buyback & ITAD
                </Link>
              </li>
              <li>
                <Link to="/rental-sla" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  24–48h Standby SLA Scope
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  Pan-India WFH Courier
                </Link>
              </li>
              <li>
                <Link to="/replacement-policy" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  Hardware Replacement
                </Link>
              </li>
              <li>
                <Link to="/ewaste-policy" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
                  E-Waste & EPR Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 (lg:col-span-3): CONTACT US & COMPLIANCE */}
          <div className="lg:col-span-3 space-y-4 text-xs">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-white">
              Contact & Support
            </h3>
            
            <div className="space-y-3.5 text-[#90b09a]">
              {/* Direct Support & RFQ Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#D4A24C] font-bold flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#D4A24C]" />
                  Direct Support & RFQ
                </span>

                <div className="space-y-1.5 pt-0.5">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center gap-2 text-white hover:text-[#D4A24C] transition-colors group"
                  >
                    <span className="text-xs font-semibold tracking-wide text-white group-hover:text-[#D4A24C]">
                      {phone}
                    </span>
                  </a>

                  <a
                    href={`mailto:${supportEmail}`}
                    className="flex items-center gap-1.5 text-[#90b09a] hover:text-white transition-colors text-[11px] break-all"
                  >
                    <Mail className="w-3 h-3 text-[#D4A24C]/80 shrink-0" />
                    <span>{supportEmail}</span>
                  </a>
                </div>
              </div>

              {/* Grievance Redressal Desk */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-white/50 block font-semibold">
                  Grievance Redressal Desk
                </span>
                <p className="text-[11px] text-[#90b09a]/90 font-medium">
                  {grievance.name} • {grievance.designation}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <a
                    href={`mailto:${grievance.email}`}
                    className="text-[#D4A24C] hover:underline text-[11px]"
                  >
                    {grievance.email}
                  </a>
                  <span className="text-white/20">•</span>
                  <Link
                    to="/grievance"
                    className="text-[#D4A24C] hover:underline text-[10.5px] font-semibold"
                  >
                    File Ticket →
                  </Link>
                </div>
              </div>

              {/* Statutory Registrations (Clean non-wrapping layout) */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50 text-[10px] font-semibold">GSTIN:</span>
                  <span className="font-mono text-white/90 bg-white/5 px-2 py-0.5 rounded border border-white/10 tracking-wide text-[10.5px]">
                    {gstin}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50 text-[10px] font-semibold">CIN:</span>
                  <span className="font-mono text-white/90 bg-white/5 px-2 py-0.5 rounded border border-white/10 tracking-wide text-[10px]">
                    {cin}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* ROW 2: AL-TOOBA STYLE HORIZONTAL LEGAL LINKS BAR         */}
        {/* ======================================================== */}
        <div className="pt-2">
          <nav aria-label="Statutory policies and agreements">
            <ul className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 sm:gap-y-3 text-[10.5px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.18em] text-white/90">
              <li>
                <Link to="/privacy" className="py-1.5 inline-block hover:text-[#D4A24C] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="py-1.5 inline-block hover:text-[#D4A24C] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="py-1.5 inline-block hover:text-[#D4A24C] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="py-1.5 inline-block hover:text-[#D4A24C] transition-colors">
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="py-1.5 inline-block hover:text-[#D4A24C] transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/rental-sla" className="py-1.5 inline-block hover:text-[#D4A24C] transition-colors">
                  Rental SLA
                </Link>
              </li>
              <li>
                <Link to="/warranty-policy" className="py-1.5 inline-block hover:text-[#D4A24C] transition-colors">
                  Warranty Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="py-1.5 inline-block hover:text-[#D4A24C] transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="py-1.5 inline-block hover:text-[#D4A24C] text-[#D4A24C] transition-colors">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* ======================================================== */}
        {/* ROW 3: OEM TRADEMARK DISCLAIMER & COPYRIGHT BAR          */}
        {/* ======================================================== */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <p className="text-[10px] leading-relaxed text-[#90b09a]/60 font-sans">
            All third-party trademarks, product names, logos, and brands (including Lenovo, ThinkPad, Dell, Latitude, HP, EliteBook, Apple, Intel, AMD, and NVIDIA) are the registered property of their respective owners. Mention of these names is strictly for hardware identification, specification reference, and compatibility purposes, and implies no endorsement or direct affiliation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10.5px] font-sans font-semibold tracking-wider uppercase text-white/75 pt-2">
            <p>
              © {CURRENT_YEAR} {legalName}. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[#D4A24C] font-mono text-[10px] tracking-normal">
              GST Tax Invoice provided with every order · 100% GSTR-1 Compliant
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
