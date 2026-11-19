import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  Building,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import BrandLogo from './BrandLogo';
import { useCompany } from '../context/SettingsContext';

export default function Footer() {
  const { company } = useCompany();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const brandName = company?.brand_name || 'Demo Infotech';
  const legalName = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const gstin = company?.gst_number || '07AAAAA0000A1Z5 [PLACEHOLDER]';
  const cin = company?.cin_number || 'U72900DL2024PTC000000 [PLACEHOLDER]';
  const regAddress = company?.registered_address || company?.address || 'Unit No. 101, Commercial Tower, Barakhamba Road, Connaught Place, New Delhi 110001 [PLACEHOLDER]';
  const opsAddress = company?.operations_address || company?.warehouse_locations || 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore [PLACEHOLDER]';
  const phone = company?.phone || '+91 XXXXX XXXXX [PLACEHOLDER]';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const supportEmail = company?.procurement_email || company?.email || 'procurement@example.com [PLACEHOLDER]';
  const businessHours = company?.business_hours || 'Monday – Saturday: 9:30 AM – 7:30 PM IST';
  const grievance = company?.grievance_officer || {
    name: 'Statutory Grievance Officer [PLACEHOLDER]',
    designation: 'Head of Legal & Enterprise Compliance',
    email: 'grievance@example.com [PLACEHOLDER]',
    phone: '+91 XXXXX XXXXX [PLACEHOLDER]',
    address: 'Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001 [PLACEHOLDER]'
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your work email address.');
      return;
    }
    if (!consent) {
      toast.error('You must consent to receiving corporate procurement communications pursuant to the DPDP Act 2023.');
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
    <footer className="relative bg-[#072117] text-[#90b09a] pt-16 pb-8 border-t border-[#FAF7F2]/10 overflow-hidden font-sans">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      {/* Top Ambient Subtle Glow */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF7F2]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-12">
        {/* ======================================================== */}
        {/* ROW 1: 5-COLUMN ENTERPRISE ARCHITECTURE                  */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-10 border-b border-[#FAF7F2]/10">
          
          {/* Column 1: Brand Wordmark, Bio & Consent-Based Newsletter */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6">
            <BrandLogo theme="dark" />

            <p className="text-xs sm:text-sm leading-relaxed text-[#90b09a]">
              {brandName} provisions enterprise-grade commercial laptops, flexible corporate rental leases, and verified hardware fleets across India with guaranteed 24–48h replacement SLA (subject to Rental SLA Terms).
            </p>

            {/* Statutory DPDP-Compliant Newsletter Form */}
            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-2">
              <span className="text-[10px] uppercase tracking-wider text-[#FAF7F2]/70 font-semibold block">
                Corporate Fleet Dispatch Newsletter
              </span>
              <div className="flex items-center bg-[#0D3B2A]/70 border border-[#FAF7F2]/25 rounded-full p-1 hover:border-[#D4A24C]/60 transition-colors focus-within:border-[#D4A24C]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-4 pr-2 py-1.5 bg-transparent text-[#FAF7F2] placeholder-[#90b09a]/70 outline-none text-xs border-none focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="rounded-full px-4 py-2 bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] text-[10px] font-sans font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {subscribing ? 'Joining...' : 'Subscribe'}
                </button>
              </div>

              {/* Mandatory Unbundled DPDP Act 2023 Consent Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer text-[10px] text-[#90b09a]/90 leading-tight select-none pt-1">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 accent-[#D4A24C] rounded shrink-0 cursor-pointer"
                />
                <span>
                  I consent to {brandName} processing my corporate email for fleet availability and price updates under the{' '}
                  <Link to="/privacy" className="text-[#D4A24C] underline hover:text-[#FAF7F2]">
                    Privacy Policy
                  </Link>
                  . Unsubscribe anytime.
                </span>
              </label>
            </form>
          </div>

          {/* Column 2: HARDWARE FLEETS */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#FAF7F2]">
              Hardware Fleets
            </h3>
            <ul className="text-xs space-y-2.5 flex flex-col text-[#90b09a]">
              <li>
                <Link to="/products" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Complete Fleet Inventory
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Lenovo ThinkPad T-Series
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Dell Latitude Ultrabooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  HP EliteBook Corporate
                </Link>
              </li>
              <li>
                <Link to="/products?category=laptop" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Precision Mobile Workstations
                </Link>
              </li>
              <li>
                <Link to="/products?category=monitor" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Pivot Frameless IPS Displays
                </Link>
              </li>
              <li>
                <Link to="/refurbished-disclosure" className="text-[#D4A24C] hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200 font-semibold">
                  Grade A+ Refurbished Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: ENTERPRISE SOLUTIONS */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#FAF7F2]">
              Enterprise Solutions
            </h3>
            <ul className="text-xs space-y-2.5 flex flex-col text-[#90b09a]">
              <li>
                <Link to="/rental" className="text-[#D4A24C] font-bold hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Corporate Laptop Rentals
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Wholesale Procurement
                </Link>
              </li>
              <li>
                <Link to="/buyback" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Asset Buyback & ITAD
                </Link>
              </li>
              <li>
                <Link to="/rental-sla" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  24–48h Standby SLA Scope
                </Link>
              </li>
              <li>
                <Link to="/ewaste-policy" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  E-Waste & EPR Governance
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Pan-India WFH Courier
                </Link>
              </li>
              <li>
                <Link to="/replacement-policy" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Hardware Replacement Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SUPPORT & GOVERNANCE */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#FAF7F2]">
              Support & Desk
            </h3>
            <ul className="text-xs space-y-2.5 flex flex-col text-[#90b09a]">
              <li>
                <Link to="/contact" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Procurement Inquiry Desk
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  30-Point Diagnostics Lab
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Customer Portal & Invoices
                </Link>
              </li>
              <li>
                <Link to="/warranty-policy" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Warranty Claim Procedures
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  Cookie Policy & Consent
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="text-[#D4A24C] font-semibold hover:text-[#FAF7F2] hover:translate-x-1 inline-block transition-transform duration-200">
                  DPDP Data Deletion Request
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ======================================================== */}
        {/* ROW 2: STATUTORY CORPORATE ENTITY & GRIEVANCE OFFICER    */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 border-b border-[#FAF7F2]/10 text-xs">
          
          {/* Statutory Entity Details */}
          <div className="lg:col-span-7 space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4A24C] font-bold block">
              Corporate Legal Entity & Registrations
            </span>
            <div className="space-y-1 text-slate-300">
              <p className="font-bold text-[#FAF7F2] text-sm font-serif">
                {legalName}
              </p>
              <p className="text-[11px] leading-relaxed text-[#90b09a]">
                <strong>Registered Office:</strong> {regAddress}
              </p>
              <p className="text-[11px] leading-relaxed text-[#90b09a]">
                <strong>Central Logistics Hub:</strong> {opsAddress}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-[#FAF7F2]/90 pt-1">
                <span><strong>GSTIN:</strong> {gstin}</span>
                <span>•</span>
                <span><strong>CIN:</strong> {cin}</span>
                <span>•</span>
                <span><strong>Jurisdiction:</strong> {company?.jurisdiction_city || 'New Delhi'}, India</span>
              </div>
            </div>
          </div>

          {/* Statutory Grievance Redressal Officer Block (DPDP & IT Rules Mandatory) */}
          <div className="lg:col-span-5 bg-[#0D3B2A]/60 border border-[#D4A24C]/30 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4A24C] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
                Statutory Grievance Redressal Officer
              </span>
              <Link to="/grievance" className="text-[10px] font-bold text-[#FAF7F2] hover:text-[#D4A24C] underline">
                File Grievance
              </Link>
            </div>
            <p className="text-[11px] text-[#FAF7F2]">
              <strong>{grievance.name}</strong> • <span className="text-slate-300">{grievance.designation}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#90b09a]">
              <div>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${grievance.email}`} className="text-slate-200 hover:text-[#D4A24C] underline">
                  {grievance.email}
                </a>
              </div>
              <div>
                <strong>Phone:</strong>{' '}
                <a href={`tel:${cleanPhone}`} className="text-slate-200 hover:text-[#D4A24C]">
                  {grievance.phone}
                </a>
              </div>
            </div>
            <p className="text-[10px] text-[#90b09a]/80 leading-snug pt-1 border-t border-white/10">
              Complaints acknowledged within <strong>24 hours</strong> and resolved within <strong>30 days</strong> pursuant to Rule 3(2) of IT (Intermediary Guidelines) Rules 2021 & Section 13 of DPDP Act 2023.
            </p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* ROW 3: ALL 12 STATUTORY LEGAL LINKS                      */}
        {/* ======================================================== */}
        <div className="py-4">
          <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#D4A24C] font-bold block mb-3 text-center sm:text-left">
            Statutory Compliance & Legal Governance
          </span>
          <nav aria-label="Legal and policy links">
            <ul className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-[10px] sm:text-[10.5px] uppercase tracking-[0.14em] font-semibold text-[#90b09a]">
              <li>
                <Link to="/privacy" className="hover:text-[#D4A24C] transition-colors">
                  1. Privacy Policy (DPDP)
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/terms" className="hover:text-[#D4A24C] transition-colors">
                  2. Terms & Conditions
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/rental-sla" className="hover:text-[#D4A24C] transition-colors">
                  3. Rental SLA Terms
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#D4A24C] transition-colors">
                  4. Refund & Cancellation
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/warranty-policy" className="hover:text-[#D4A24C] transition-colors">
                  5. Warranty Policy
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#D4A24C] transition-colors">
                  6. Shipping & Dispatch
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/replacement-policy" className="hover:text-[#D4A24C] transition-colors">
                  7. Hardware Replacement
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/cookie-policy" className="hover:text-[#D4A24C] transition-colors">
                  8. Cookie Policy
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/disclaimer" className="hover:text-[#D4A24C] transition-colors">
                  9. Legal Disclaimer
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/refurbished-disclosure" className="hover:text-[#D4A24C] transition-colors">
                  10. Refurbished Grading
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/ewaste-policy" className="hover:text-[#D4A24C] transition-colors">
                  11. E-Waste & EPR
                </Link>
              </li>
              <li>•</li>
              <li>
                <Link to="/grievance" className="hover:text-[#D4A24C] text-[#FAF7F2] transition-colors">
                  12. Grievance Redressal
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* ======================================================== */}
        {/* ROW 4: THIRD-PARTY OEM TRADEMARK DISCLAIMER              */}
        {/* ======================================================== */}
        <div className="p-4 rounded-xl bg-[#03140E] border border-white/5 text-[10px] leading-relaxed text-[#90b09a]/75 text-center sm:text-left">
          <strong className="text-[#FAF7F2]/90">Third-Party Trademark Disclaimer:</strong>{' '}
          {company?.third_party_disclaimer ||
            'All third-party trademarks, logos, and brand names (including Dell, HP, Lenovo, ThinkPad, Latitude, EliteBook, Apple, Samsung, NVIDIA, Intel, and AMD) are the registered properties of their respective owners. Use of these names, trademarks, and brands does not imply endorsement, affiliation, or direct sponsorship unless explicitly stated.'}
        </div>

        {/* ======================================================== */}
        {/* ROW 5: COPYRIGHT, INVOICING COMPLIANCE & PAYMENT MODES   */}
        {/* ======================================================== */}
        <div className="pt-6 border-t border-[#FAF7F2]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#90b09a]">
          <div className="space-y-1 text-center md:text-left">
            <p className="tracking-wider text-[11px] text-[#FAF7F2] uppercase font-semibold">
              © {new Date().getFullYear()} {legalName.toUpperCase()}. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[10px] text-[#90b09a] tracking-wider uppercase">
              GST Tax Invoice provided with every order · GSTIN: {gstin}
              {company?.iso_cert_number ? ` · ISO 9001:2015 CERTIFIED (${company.iso_cert_number})` : ''}
            </p>
          </div>

          {/* Secure B2B Remittance Modes */}
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <span className="px-2 py-1 rounded bg-[#0D3B2A] border border-[#D4A24C]/30 text-[#D4A24C] font-bold">
              NEFT / RTGS Wire
            </span>
            <span className="px-2 py-1 rounded bg-[#0D3B2A] border border-white/10 text-white">
              UPI Corporate
            </span>
            <span className="px-2 py-1 rounded bg-[#0D3B2A] border border-white/10 text-white">
              Razorpay
            </span>
            <span className="px-2 py-1 rounded bg-[#0D3B2A] border border-white/10 text-white">
              Net Banking
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
