import React, { useState, useEffect, useRef } from 'react';
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
  Check,
  Briefcase,
  Users,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

// Custom Luxury Dropdown Component matching brand theme
function LuxurySelect({ value, onChange, options, icon: Icon, placeholder = 'Select option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-11 pl-10 pr-9 py-2.5 bg-[#FAF7F2] border text-[#0D3B2A] rounded-xl text-base sm:text-xs font-sans text-left transition flex items-center justify-between cursor-pointer focus:outline-none ${
          isOpen ? 'border-[#0D3B2A] ring-1 ring-[#0D3B2A] bg-white' : 'border-[#D4A24C]/30 hover:border-[#D4A24C]/60'
        }`}
      >
        {Icon && (
          <Icon className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        <span className="truncate font-medium">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#8A5E12] absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 pointer-events-none ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-[#D4A24C]/35 rounded-xl shadow-2xl py-1 z-50 max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 min-h-10 py-2.5 sm:py-2 text-sm sm:text-xs flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#0D3B2A]/8 text-[#0D3B2A] font-bold'
                    : 'text-[#4A5568] hover:bg-[#FAF7F2] hover:text-[#0D3B2A]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A24C] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Signup() {
  const { register, sendRegisterOtp, verifyRegisterOtp } = useAuth();
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

  // 6-Digit OTP & Verification state
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef([]);

  const designationOptions = [
    { value: 'IT Head / Sysadmin', label: 'IT Head / Systems Administrator' },
    { value: 'Procurement / Vendor Manager', label: 'Procurement / Vendor Manager' },
    { value: 'Founder / Director / C-Level', label: 'Founder / Director / CEO / CTO' },
    { value: 'HR / Operations / Admin', label: 'HR / Operations / Admin' },
    { value: 'Finance / Accounts', label: 'Finance / Accounts Controller' },
    { value: 'Team Lead / Engineer', label: 'Engineering Lead / Developer' },
    { value: 'Other / Professional', label: 'Other Business Professional' }
  ];

  const companySizeOptions = [
    { value: '1-10', label: '1 – 10 Employees' },
    { value: '11-50', label: '11 – 50 Employees' },
    { value: '51-200', label: '51 – 200 Employees' },
    { value: '200+', label: '200+ Employees' }
  ];

  // Cooldown countdown effect for Resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailExistsError('');
    setOtpError('');
    setSubmitting(true);

    const result = await register({ ...formData, honeypot });
    setSubmitting(false);

    if (result.success) {
      setRegisteredSuccess(true);
      setRegisteredEmail(result.email || formData.email);
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } else if (result.message && result.message.toLowerCase().includes('already exists')) {
      setEmailExistsError(result.message);
    }
  };

  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = cleanVal.slice(-1);
    setOtp(newOtp);
    if (otpError) setOtpError('');

    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    if (otpError) setOtpError('');
    const focusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    setOtpVerifying(true);
    setOtpError('');
    const res = await verifyRegisterOtp(registeredEmail || formData.email, otpCode);
    setOtpVerifying(false);

    if (res.success) {
      const queryParams = new URLSearchParams(location.search);
      const redirect = queryParams.get('redirect') || '/dashboard';
      navigate(redirect);
    } else {
      setOtpError(res.message || 'Invalid or expired verification code.');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setOtpError('');
    const res = await sendRegisterOtp({ ...formData, email: registeredEmail || formData.email });
    setResending(false);
    if (res.success) {
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-[85dvh] py-6 sm:py-14 px-4 sm:px-6 flex items-start sm:items-center justify-center relative overflow-hidden bg-[#FAF7F2]">
      <Helmet>
        <title>{registeredSuccess ? `Verify Email | ${brandName}` : `Register | ${brandName}`}</title>
      </Helmet>

      {/* Atmospheric Luxury Ambient Glows */}
      <div className="hidden md:block absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4A24C]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#0D3B2A]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Executive Split-Screen Master Container */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#D4A24C]/35 shadow-2xl bg-white relative z-10">

        {/* Left Panel: Dignified Brand Showcase & Fleet Highlights */}
        <div className="order-2 lg:order-1 lg:col-span-5 bg-gradient-to-br from-[#0D3B2A] via-[#0D3B2A] to-[#07241A] text-[#FAF7F2] p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden">
          {/* Internal ambient radial glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A24C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4A24C]/40 text-[#D4A24C] text-[10.5px] font-semibold uppercase tracking-wider backdrop-blur-xs w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>Enterprise Account</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-[26px] font-bold font-serif text-[#FAF7F2] tracking-tight leading-snug">
                Scale Your Corporate IT Infrastructure.
              </h2>
              <p className="text-xs text-[#FAF7F2]/80 leading-relaxed mt-2 font-sans">
                Commercial workstations, laptops, and server fleet leasing with dedicated SLA support across India.
              </p>
            </div>

            {/* Core Value Pillars */}
            <div className="space-y-2 text-xs text-[#FAF7F2]/90 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/50 flex items-center justify-center text-[#D4A24C] shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>Certified Tier-1 Commercial Hardware</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/50 flex items-center justify-center text-[#D4A24C] shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>Flexible Monthly & Annual Leases (100% OPEX)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/50 flex items-center justify-center text-[#D4A24C] shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>Direct 18% GST Input Tax Credit with GSTR-2B</span>
              </div>
            </div>

            {/* Fleet Hardware Capabilities (Fills space with real tangible specs) */}
            <div className="pt-2 hidden sm:block">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2.5">
                <div className="text-[10px] font-bold text-[#D4A24C] uppercase tracking-wider font-mono">
                  Supported Enterprise Hardware
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-semibold text-[#FAF7F2] text-[11.5px]">Business Laptops</div>
                    <div className="text-[10px] text-[#FAF7F2]/65 mt-0.5">ThinkPad · Latitude · EliteBook</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-semibold text-[#FAF7F2] text-[11.5px]">Workstations</div>
                    <div className="text-[10px] text-[#FAF7F2]/65 mt-0.5">Precision · ZBook · Apple Silicon</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-semibold text-[#FAF7F2] text-[11.5px]">Servers & Storage</div>
                    <div className="text-[10px] text-[#FAF7F2]/65 mt-0.5">PowerEdge · ProLiant · NAS</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-semibold text-[#FAF7F2] text-[11.5px]">Displays & Hubs</div>
                    <div className="text-[10px] text-[#FAF7F2]/65 mt-0.5">IPS Panels · Thunderbolt Docks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Key Commercial Terms */}
            <div className="hidden sm:grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs sm:text-sm font-bold font-serif text-[#D4A24C]">₹0</div>
                <div className="text-[9.5px] text-[#FAF7F2]/65 uppercase tracking-tight">Deposit PO</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs sm:text-sm font-bold font-serif text-[#D4A24C]">Net-30</div>
                <div className="text-[9.5px] text-[#FAF7F2]/65 uppercase tracking-tight">Billing Terms</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs sm:text-sm font-bold font-serif text-[#D4A24C]">24–48h</div>
                <div className="text-[9.5px] text-[#FAF7F2]/65 uppercase tracking-tight">Standby Swap</div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Line */}
          <div className="relative z-10 pt-4 mt-6 border-t border-white/15 flex items-center justify-between text-xs text-[#FAF7F2]/75">
            <span>150+ Corporate Clients</span>
            <span className="font-mono text-[11px] text-[#D4A24C] font-semibold">Verified GSTIN</span>
          </div>
        </div>

        {/* Right Panel: Conditional Registration or Verification Desk */}
        <div className="order-1 lg:order-2 lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          {registeredSuccess ? (
            /* Corporate 6-Digit OTP Verification Desk */
            <div className="w-full space-y-5">
              {/* Header */}
              <div>
                <div className="mb-3">
                  <BrandLogo theme="light" size="md" showSubtitle={false} />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-semibold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dual-Engine OTP & Magic Link</span>
                </div>
                <h1 className="text-2xl sm:text-[26px] font-bold font-serif text-[#0D3B2A] tracking-tight">
                  Verify Corporate Email
                </h1>
                <p className="text-xs text-[#5A6B63] mt-1 leading-relaxed">
                  Enter the 6-digit code dispatched to your work email to activate your corporate account.
                </p>
              </div>

              {/* Recipient Corporate Address Badge */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/35 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#D4A24C]/30 flex items-center justify-center text-[#8A5E12] shadow-2xs shrink-0">
                    <Mail className="w-4 h-4 text-[#D4A24C]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#5A6B63] uppercase tracking-wider font-semibold">Code Dispatched To</div>
                    <div className="text-xs sm:text-sm font-bold text-[#0D3B2A] font-mono truncate">{registeredEmail || formData.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRegisteredSuccess(false);
                    setOtpError('');
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-[#8A5E12] hover:text-[#0D3B2A] font-semibold underline shrink-0 cursor-pointer"
                  title="Edit details"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              {/* 6-Digit OTP Form */}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#0D3B2A] flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#D4A24C]" />
                      <span>Enter 6-Digit Code</span>
                    </label>
                    <span className="text-[10.5px] text-[#5A6B63] font-mono">Valid 10 mins</span>
                  </div>

                  {/* 6 OTP Input Boxes */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2.5" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        autoFocus={idx === 0}
                        className={`w-10 sm:w-12 h-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl border transition bg-[#FAF7F2] text-[#0D3B2A] focus:outline-none ${
                          digit
                            ? 'border-[#0D3B2A] bg-white ring-1 ring-[#0D3B2A]'
                            : 'border-[#D4A24C]/35 hover:border-[#D4A24C]'
                        } ${otpError ? 'border-red-400 bg-red-50/30' : ''}`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <span className="font-semibold">{otpError}</span>
                    </div>
                  )}
                </div>

                {/* Submit Verification Button */}
                <button
                  type="submit"
                  disabled={otp.join('').length !== 6 || otpVerifying}
                  className="w-full py-3.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24C]" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Complete Registration</span>
                      <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Magic Link Feature Card */}
              <div className="p-3.5 rounded-2xl bg-[#0D3B2A]/5 border border-[#D4A24C]/30 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#0D3B2A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A24C]" />
                  <span>1-Click Magic Link Dispatched</span>
                </div>
                <p className="text-[11px] text-[#5A6B63] leading-relaxed">
                  Don't want to type the code? Simply tap the <strong>Verify Account in 1-Click</strong> button inside the email we just sent to activate instantly.
                </p>
              </div>

              {/* Resend Cooldown Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[#5A6B63]">Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resending}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#8A5E12] hover:text-[#0D3B2A] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>
                    {resending
                      ? 'Sending...'
                      : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend 6-Digit Code'}
                  </span>
                </button>
              </div>

              {/* Footer Return to Login */}
              <div className="text-center pt-2 border-t border-slate-100 text-xs text-[#5A6B63]">
                Already activated?{' '}
                <Link to="/login" className="text-[#8A5E12] font-bold hover:text-[#0D3B2A] hover:underline transition">
                  Sign In →
                </Link>
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
                        className="w-full pl-10 pr-3.5 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-base sm:text-xs font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0D3B2A] mb-1">
                      Role / Designation <span className="text-red-500">*</span>
                    </label>
                    <LuxurySelect
                      value={formData.designation}
                      onChange={(val) => setFormData({ ...formData, designation: val })}
                      options={designationOptions}
                      icon={Briefcase}
                      placeholder="Select Designation"
                    />
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
                        className="w-full pl-10 pr-3.5 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-base sm:text-xs font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0D3B2A] mb-1">
                      Company Size
                    </label>
                    <LuxurySelect
                      value={formData.company_size}
                      onChange={(val) => setFormData({ ...formData, company_size: val })}
                      options={companySizeOptions}
                      icon={Users}
                      placeholder="Select Company Size"
                    />
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
                        className="w-full pl-10 pr-3.5 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-base sm:text-xs font-sans placeholder:text-slate-400"
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
                        className="w-full pl-10 pr-3.5 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-base sm:text-xs font-sans placeholder:text-slate-400"
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
                          className={`min-h-11 py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold transition border flex items-center justify-center cursor-pointer ${
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
                      className="w-full pl-10 pr-10 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-base sm:text-xs font-sans placeholder:text-slate-400"
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
                  className="w-full min-h-11 py-3.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer disabled:opacity-50 mt-3 group"
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
