import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  Repeat,
  Eye,
  EyeOff,
  Sparkles,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function Login() {
  const { login } = useAuth();
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        const queryParams = new URLSearchParams(location.search);
        const redirect = queryParams.get('redirect') || '/dashboard';
        navigate(redirect);
      }
    }
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-14 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden bg-[#FAF7F2]">
      <Helmet>
        <title>Sign In | {brandName} Corporate Portal</title>
      </Helmet>

      {/* Atmospheric Luxury Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4A24C]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#0D3B2A]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Executive Split-Screen Master Card */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#D4A24C]/35 shadow-2xl bg-white relative z-10">
        
        {/* Left Showcase: Enterprise Value & Institutional Trust */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0D3B2A] via-[#0D3B2A] to-[#07241A] text-[#FAF7F2] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Internal ambient radial glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A24C]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4A24C]/40 text-[#D4A24C] text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-xs w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>Corporate IT Desk</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FAF7F2] tracking-tight leading-tight">
                Next-Gen IT Fleet & Procurement Desk.
              </h2>
              <p className="text-xs text-[#FAF7F2]/80 leading-relaxed mt-2.5 font-sans">
                Unified corporate access to Tier-1 certified hardware, instant Net-30 PO proformas, and dedicated 24–48h SLA standby swaps.
              </p>
            </div>

            {/* Feature Value Cards */}
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-[#D4A24C]/25 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#D4A24C]/30 flex items-center justify-center text-[#D4A24C] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF7F2] font-serif">30-Point Lab Tested Fleet</h4>
                  <p className="text-[11px] text-[#FAF7F2]/70 leading-snug mt-0.5">
                    Rigorous multi-stage diagnostics ensuring peak commercial reliability.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-[#D4A24C]/25 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#D4A24C]/30 flex items-center justify-center text-[#D4A24C] shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF7F2] font-serif">Instant Net-30 Corporate POs</h4>
                  <p className="text-[11px] text-[#FAF7F2]/70 leading-snug mt-0.5">
                    Issue tax-compliant proforma purchase orders directly to finance.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-[#D4A24C]/25 backdrop-blur-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#D4A24C]/30 flex items-center justify-center text-[#D4A24C] shrink-0 mt-0.5">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#FAF7F2] font-serif">Zero-Capex Operating Leases</h4>
                  <p className="text-[11px] text-[#FAF7F2]/70 leading-snug mt-0.5">
                    100% tax-deductible monthly OPEX with priority SLA unit replacement.
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
                <div className="text-[9.5px] text-[#FAF7F2]/70 uppercase tracking-wider">Enterprises</div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold font-serif text-[#D4A24C]">18% ITC</div>
                <div className="text-[9.5px] text-[#FAF7F2]/70 uppercase tracking-wider">GST Compliant</div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold font-serif text-[#D4A24C]">24–48h</div>
                <div className="text-[9.5px] text-[#FAF7F2]/70 uppercase tracking-wider">Standby SLA</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#FAF7F2]/60 pt-2 border-t border-white/10 font-mono">
              <Lock className="w-3 h-3 text-[#D4A24C]" />
              <span>256-Bit SSL Encrypted Corporate Session</span>
            </div>
          </div>
        </div>

        {/* Right Authentication Panel */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Header with clean Brand Logo */}
            <div>
              <div className="mb-4">
                <BrandLogo theme="light" size="md" showSubtitle={false} />
              </div>
              <h1 className="text-2xl sm:text-[26px] font-bold font-serif text-[#0D3B2A] tracking-tight">
                Sign In to Corporate Portal
              </h1>
              <p className="text-xs text-[#5A6B63] mt-1">
                Enter your registered corporate credentials to manage orders, active leases & tax invoices.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1.5">
                  Corporate Work Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-semibold text-[#0D3B2A]">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-[#8A5E12] hover:text-[#0D3B2A] hover:underline font-bold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-xs font-sans placeholder:text-slate-400"
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

              {/* Remember Me & Net-30 Badge */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#5A6B63] hover:text-[#0D3B2A] transition">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#D4A24C]/40 text-[#0D3B2A] focus:ring-[#0D3B2A] cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[10px] font-mono text-[#8A5E12] font-semibold bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D4A24C]/30">
                  Net-30 Ready
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] disabled:opacity-50 cursor-pointer border border-[#D4A24C]/40 group"
              >
                <span>{submitting ? 'Authenticating Corporate Session...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Quick Demo Access Pills */}
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#D4A24C]/25 text-[11px] space-y-2">
              <div className="flex items-center justify-between text-[#8A5E12] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A24C]" />
                  <span>Quick Portal Credentials</span>
                </span>
                <span className="text-[9.5px] text-[#5A6B63] font-mono">One-Click Fill</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('zaidm1323@gmail.com');
                    setPassword('Zaid@9999201255');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D4A24C]/30 text-[#0D3B2A] font-semibold text-[10.5px] hover:bg-[#F3E8D2] transition cursor-pointer shadow-2xs flex items-center gap-1"
                >
                  <Building className="w-3 h-3 text-[#D4A24C]" />
                  <span>Admin: zaidm1323@gmail.com</span>
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="pt-2 border-t border-slate-100 text-center text-xs text-[#5A6B63]">
              Don't have an enterprise account?{' '}
              <Link to="/signup" className="text-[#8A5E12] font-bold hover:text-[#0D3B2A] hover:underline transition">
                Register your company →
              </Link>
            </div>

            {/* Security Footnote */}
            <p className="text-[10px] text-center text-slate-400 font-mono">
              Statutory Compliance: DPDP Act 2023 · IT Act 2000 · Verified GSTIN System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
