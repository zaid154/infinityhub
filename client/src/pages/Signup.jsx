import React, { useState, useEffect } from 'react';
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
  Eye,
  EyeOff,
  ChevronDown,
  MailCheck,
  RefreshCw,
  Edit3,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function Signup() {
  const { register, resendVerification } = useAuth();
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
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap: invisible to humans
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState('');

  // Email verification state
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const designationOptions = [
    { value: 'IT Head / Sysadmin', label: 'IT Head / Systems Administrator' },
    { value: 'Procurement / Vendor Manager', label: 'Procurement / Vendor Manager' },
    { value: 'Founder / Director / C-Level', label: 'Founder / Director / CEO / CTO' },
    { value: 'HR / Operations / Admin', label: 'HR / Operations / Admin' },
    { value: 'Finance / Accounts', label: 'Finance / Accounts Controller' },
    { value: 'Team Lead / Engineer', label: 'Engineering Lead / Developer' },
    { value: 'Other / Professional', label: 'Other Business Professional' }
  ];

  // Cooldown countdown effect for Resend Email
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailExistsError('');
    setSubmitting(true);

    const result = await register({ ...formData, honeypot });
    setSubmitting(false);

    if (result.success) {
      if (result.requiresVerification) {
        setRegisteredSuccess(true);
        setRegisteredEmail(result.email || formData.email);
        setResendCooldown(60);
      } else {
        const queryParams = new URLSearchParams(location.search);
        const redirect = queryParams.get('redirect') || '/dashboard';
        navigate(redirect);
      }
    } else if (result.message && result.message.toLowerCase().includes('already exists')) {
      setEmailExistsError(result.message);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    await resendVerification(registeredEmail || formData.email);
    setResending(false);
    setResendCooldown(60);
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-14 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden bg-[#FAF7F2]">
      <Helmet>
        <title>{registeredSuccess ? `Verify Email | ${brandName}` : `Register | ${brandName}`}</title>
      </Helmet>

      {/* Atmospheric Luxury Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4A24C]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#0D3B2A]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Executive Split-Screen Master Container */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#D4A24C]/35 shadow-2xl bg-white relative z-10">

        {/* Left Panel: Dignified Brand Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0D3B2A] via-[#0D3B2A] to-[#07241A] text-[#FAF7F2] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Internal ambient radial glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A24C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4A24C]/40 text-[#D4A24C] text-[10.5px] font-semibold uppercase tracking-wider backdrop-blur-xs w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>Enterprise Account</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FAF7F2] tracking-tight leading-snug">
                Scale Your Corporate IT Infrastructure.
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed mt-3 font-sans">
                Unified procurement and leasing for business workstations, laptops, and enterprise hardware across India.
              </p>
            </div>

            {/* Clean 3-point list - No bulky boxed cards */}
            <div className="space-y-3 pt-2 text-xs text-[#FAF7F2]/90">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/50 flex items-center justify-center text-[#D4A24C] shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>Certified Commercial Hardware Fleet</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/50 flex items-center justify-center text-[#D4A24C] shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>Monthly & Annual Corporate Leases</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/50 flex items-center justify-center text-[#D4A24C] shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>Direct 18% GST Input Tax Credit</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Line */}
          <div className="relative z-10 pt-6 mt-8 border-t border-white/15 flex items-center justify-between text-xs text-[#FAF7F2]/75">
            <span>500+ Indian Enterprises</span>
            <span className="font-mono text-[11px] text-[#D4A24C] font-semibold">Verified GSTIN</span>
          </div>
        </div>

        {/* Right Panel: Conditional Registration or Verification Desk */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          {registeredSuccess ? (
            /* Corporate Verification Pending Desk */
            <div className="w-full space-y-6">
              {/* Header */}
              <div>
                <div className="mb-4">
                  <BrandLogo theme="light" size="md" showSubtitle={false} />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#8A5E12] text-[11px] font-semibold uppercase tracking-wider mb-2.5">
                  <MailCheck className="w-3.5 h-3.5 text-[#8A5E12]" />
                  <span>Email Verification Required</span>
                </div>
                <h1 className="text-2xl sm:text-[26px] font-bold font-serif text-[#0D3B2A] tracking-tight">
                  Verify Your Email
                </h1>
                <p className="text-xs text-[#5A6B63] mt-1.5 leading-relaxed">
                  We have dispatched a verification link to your corporate email address:
                </p>
              </div>

              {/* Recipient Corporate Address Badge */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/35 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#D4A24C]/30 flex items-center justify-center text-[#8A5E12] shadow-2xs shrink-0">
                    <Mail className="w-4 h-4 text-[#D4A24C]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#5A6B63] uppercase tracking-wider font-semibold">Activation Email Sent To</div>
                    <div className="text-xs sm:text-sm font-bold text-[#0D3B2A] font-mono truncate">{registeredEmail || formData.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRegisteredSuccess(false)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#8A5E12] hover:text-[#0D3B2A] font-semibold underline shrink-0 cursor-pointer"
                  title="Correct email address"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Delivery Advisory Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-[#8A5E12] space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#0D3B2A]">
                  <span>📬 Delivery Note</span>
                </div>
                <p className="text-[11px] text-[#5A6B63] leading-relaxed">
                  Please check your <strong>Primary Inbox</strong>. If not received within 60 seconds, check your <strong>Spam</strong> or <strong>Updates</strong> tab.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Link
                  to="/login"
                  className="w-full py-3.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 group"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resending}
                  className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-100 text-[#0D3B2A] border border-[#D4A24C]/35 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#8A5E12] ${resending ? 'animate-spin' : ''}`} />
                  <span>
                    {resending
                      ? 'Sending...'
                      : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Verification Link'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Clean Registration Form */
            <div className="w-full space-y-5">
              {/* Header */}
              <div>
                <div className="mb-3">
                  <BrandLogo theme="light" size="md" showSubtitle={false} />
                </div>
                <h1 className="text-2xl sm:text-[26px] font-bold font-serif text-[#0D3B2A] tracking-tight">
                  Register Your Company
                </h1>
                <p className="text-xs text-[#5A6B63] mt-1">
                  Create an account to access corporate pricing, rentals, and tax invoicing.
                </p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">

                {/* Anti-bot Honeypot trap: hidden from humans */}
                <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                  <label htmlFor="corp-bot-filter">Leave this empty</label>
                  <input
                    type="text"
                    id="corp-bot-filter"
                    name="corporate_bot_trap"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

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
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="company_name"
                        id="signup-company-name"
                        autoComplete="organization"
                        required
                        placeholder="e.g. Acme Technologies Pvt Ltd"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0D3B2A] mb-1">
                      Company Size
                    </label>
                    <div className="relative">
                      <select
                        name="company_size"
                        id="signup-company-size"
                        value={formData.company_size}
                        onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                        className="w-full pl-3.5 pr-8 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans appearance-none cursor-pointer"
                      >
                        <option value="1-10">1 – 10 Employees</option>
                        <option value="11-50">11 – 50 Employees</option>
                        <option value="51-200">51 – 200 Employees</option>
                        <option value="200+">200+ Employees</option>
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
                    {emailExistsError && (
                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-300 text-[10.5px] text-[#8A5E12] flex items-center justify-between gap-1 mt-1">
                        <span>{emailExistsError}</span>
                        <Link to="/login" className="font-bold underline text-[#0D3B2A] whitespace-nowrap hover:text-[#8A5E12]">
                          Sign In →
                        </Link>
                      </div>
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
                  </div>
                </div>

                {/* Row 4: Primary Hardware Requirement Selector */}
                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1.5">
                    Primary Requirement
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'rent', label: 'Rental' },
                      { id: 'buy', label: 'Purchase' },
                      { id: 'both', label: 'Both' }
                    ].map((pill) => {
                      const isSelected = formData.primary_interest === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, primary_interest: pill.id })}
                          className={`py-2 px-2 rounded-xl text-xs font-semibold transition border flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-[#0D3B2A] text-white border-[#0D3B2A] shadow-xs'
                              : 'bg-[#FAF7F2] text-[#5A6B63] hover:text-[#0D3B2A] border-[#D4A24C]/25'
                          }`}
                        >
                          <span>{pill.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 5: Create Password */}
                <div>
                  <label className="block font-semibold text-[#0D3B2A] mb-1">
                    Password (Min 6 Characters) <span className="text-red-500">*</span>
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
                      placeholder="••••••••"
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
                  <span>{submitting ? 'Registering...' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Link back to Sign In */}
              <div className="text-center pt-2 border-t border-slate-100 text-xs text-[#5A6B63]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#8A5E12] font-bold hover:text-[#0D3B2A] hover:underline transition">
                  Sign In →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
