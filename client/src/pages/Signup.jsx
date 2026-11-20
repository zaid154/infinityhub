import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  ArrowRight,
  ShieldCheck,
  Repeat,
  ShoppingCart,
  Sparkles,
  Eye,
  EyeOff,
  ChevronDown,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function Signup() {
  const { register } = useAuth();
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company_name: '',
    designation: 'IT Head / Sysadmin',
    primary_interest: 'both',
    company_size: '11-50'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState('');

  const designationOptions = [
    { value: 'IT Head / Sysadmin', label: 'IT Head / Systems Administrator' },
    { value: 'Procurement / Vendor Manager', label: 'Procurement / Vendor Manager' },
    { value: 'Founder / Director / C-Level', label: 'Founder / Director / CEO / CTO' },
    { value: 'HR / Operations / Admin', label: 'HR / Operations / Admin' },
    { value: 'Finance / Accounts', label: 'Finance / Accounts Controller' },
    { value: 'Team Lead / Engineer', label: 'Engineering Lead / Developer' },
    { value: 'Other / Professional', label: 'Other Business Professional' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailExistsError('');
    setSubmitting(true);

    const result = await register(formData);
    setSubmitting(false);

    if (result.success) {
      const queryParams = new URLSearchParams(location.search);
      const redirect = queryParams.get('redirect') || '/dashboard';
      navigate(redirect);
    } else if (result.message && result.message.toLowerCase().includes('already exists')) {
      setEmailExistsError(result.message);
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-14 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden bg-[#FAF7F2]">
      <Helmet>
        <title>Create Enterprise Account | {brandName} Corporate Portal</title>
      </Helmet>

      {/* Atmospheric Luxury Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4A24C]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#0D3B2A]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Executive Split-Screen Master Container */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#D4A24C]/35 shadow-2xl bg-white relative z-10">

        {/* Left Panel: Enterprise Perks & Institutional Value */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0D3B2A] via-[#0D3B2A] to-[#07241A] text-[#FAF7F2] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Internal ambient radial glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A24C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4A24C]/40 text-[#D4A24C] text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-xs w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>B2B Client Onboarding</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FAF7F2] tracking-tight leading-tight">
                Accelerate Your Enterprise IT Fleet.
              </h2>
              <p className="text-xs text-[#FAF7F2]/80 leading-relaxed mt-2.5 font-sans">
                Join 500+ Indian companies streamlining hardware procurement, Net-30 purchase orders, and zero-capex fleet leasing.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-[#D4A24C]/25 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#D4A24C]/30 flex items-center justify-center text-[#D4A24C] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF7F2] font-serif">Zero Paperwork at Registration</h4>
                  <p className="text-[11px] text-[#FAF7F2]/70 leading-snug mt-0.5">
                    GSTIN and shipping addresses are only requested during final PO checkout.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-[#D4A24C]/25 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#D4A24C]/30 flex items-center justify-center text-[#D4A24C] shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF7F2] font-serif">Net-30 Corporate Proforma POs</h4>
                  <p className="text-[11px] text-[#FAF7F2]/70 leading-snug mt-0.5">
                    Generate accounts-ready commercial proforma quotes without upfront personal cards.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-[#D4A24C]/25 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#D4A24C]/30 flex items-center justify-center text-[#D4A24C] shrink-0 mt-0.5">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF7F2] font-serif">24–48h Standby Replacement SLA</h4>
                  <p className="text-[11px] text-[#FAF7F2]/70 leading-snug mt-0.5">
                    Operating lease hardware backed by on-site diagnostics and rapid hardware swap SLA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Stat Bar */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15">
            <div className="grid grid-cols-3 gap-2 text-center pb-3">
              <div>
                <div className="text-base sm:text-lg font-bold font-serif text-[#D4A24C]">500+</div>
                <div className="text-[9.5px] text-[#FAF7F2]/70 uppercase tracking-wider">Clients</div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold font-serif text-[#D4A24C]">18% ITC</div>
                <div className="text-[9.5px] text-[#FAF7F2]/70 uppercase tracking-wider">GST Ready</div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold font-serif text-[#D4A24C]">₹0</div>
                <div className="text-[9.5px] text-[#FAF7F2]/70 uppercase tracking-wider">Deposit PO</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#FAF7F2]/60 pt-2 border-t border-white/10 font-mono">
              <Lock className="w-3 h-3 text-[#D4A24C]" />
              <span>Verified Corporate Onboarding Desk</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Clean Registration Form */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="w-full space-y-5">

            {/* Header */}
            <div>
              <div className="mb-3">
                <BrandLogo theme="light" size="md" showSubtitle={false} />
              </div>
              <h1 className="text-2xl sm:text-[26px] font-bold font-serif text-[#0D3B2A] tracking-tight">
                Create Enterprise Account
              </h1>
              <p className="text-xs text-[#5A6B63] mt-1">
                Access corporate pricing, Net-30 PO approvals, and 100% OPEX deductible rental fleet contracts.
              </p>
            </div>

            {/* Anti-Dropoff Reassurance Pill */}
            <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/25 text-[11px] text-[#5A6B63]">
              <div className="w-6 h-6 rounded-lg bg-white border border-[#D4A24C]/30 flex items-center justify-center text-[#8A5E12] shadow-2xs shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
              </div>
              <p className="leading-snug text-[10.5px]">
                <strong className="text-[#0D3B2A] font-semibold">Zero Paperwork at Registration:</strong>{' '}
                GSTIN and delivery address are only required during order checkout.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">

              {/* Row 1: Full Name & Role / Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      id="signup-name"
                      autoComplete="name"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1">
                    Role / Designation <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="designation"
                      id="signup-designation"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans appearance-none cursor-pointer"
                    >
                      {designationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#8A5E12] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Company Name & Workforce Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1">
                    Company / Organization <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="company_name"
                      id="signup-company-name"
                      autoComplete="organization"
                      required
                      placeholder="e.g. Nexus Tech Labs Pvt Ltd"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1">
                    Company Workforce
                  </label>
                  <div className="relative">
                    <select
                      name="company_size"
                      id="signup-company-size"
                      value={formData.company_size}
                      onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans appearance-none cursor-pointer"
                    >
                      <option value="1-10">1 – 10 Employees (Startup)</option>
                      <option value="11-50">11 – 50 Employees (Growth)</option>
                      <option value="51-200">51 – 200 Employees (Mid-Market)</option>
                      <option value="200+">200+ Employees (Enterprise)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#8A5E12] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Corporate Work Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1">
                    Corporate Work Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      id="signup-email"
                      autoComplete="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (emailExistsError) setEmailExistsError('');
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans placeholder:text-slate-400"
                    />
                  </div>
                  {emailExistsError ? (
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-300 text-[10.5px] text-[#8A5E12] flex items-center justify-between gap-1 mt-1">
                      <span>{emailExistsError}</span>
                      <Link to="/login" className="font-bold underline text-[#0D3B2A] whitespace-nowrap hover:text-[#8A5E12]">
                        Sign In →
                      </Link>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#5A6B63] block mt-0.5 font-mono">Use official domain for instant Net-30 PO</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1">
                    WhatsApp / Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      name="contact_phone_number"
                      id="signup-phone"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      placeholder="e.g. 98100 12345"
                      value={formData.phone}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9+\s-]/g, '');
                        setFormData({ ...formData, phone: clean });
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans placeholder:text-slate-400"
                    />
                  </div>
                  <span className="text-[10px] text-[#5A6B63] block mt-0.5 font-mono">For rapid dispatch SLA alerts</span>
                </div>
              </div>

              {/* Row 4: Primary Hardware Requirement Selector */}
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1.5">
                  Primary Hardware Requirement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'rent', label: 'Corporate Rental', icon: Repeat },
                    { id: 'buy', label: 'Direct Purchase', icon: ShoppingCart },
                    { id: 'both', label: 'Both (Rent & Buy)', icon: Sparkles }
                  ].map((pill) => {
                    const Icon = pill.icon;
                    const isSelected = formData.primary_interest === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, primary_interest: pill.id })}
                        className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D3B2A] text-white border-[#0D3B2A] shadow-sm ring-1 ring-[#D4A24C]/40'
                            : 'bg-[#FAF7F2] text-[#5A6B63] hover:text-[#0D3B2A] border-[#D4A24C]/25'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D4A24C]' : 'text-slate-400'}`} />
                        <span className="truncate">{pill.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Create Password */}
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Create Password (Min 6 Characters) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="signup-password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Min 6 characters (e.g. Corp@2026)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0D3B2A] transition p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer disabled:opacity-50 mt-3 group"
              >
                <span>{submitting ? 'Creating Corporate Account...' : 'Complete Enterprise Registration'}</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Link back to Sign In */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-[#5A6B63]">
              Already have an enterprise account?{' '}
              <Link to="/login" className="text-[#8A5E12] font-bold hover:text-[#0D3B2A] hover:underline transition">
                Sign In Here →
              </Link>
            </div>

            {/* Regulatory Footnote */}
            <p className="text-[10px] text-center text-slate-400 font-mono">
              Statutory Compliance: DPDP Act 2023 · IT Act 2000 · Verified GSTIN System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
