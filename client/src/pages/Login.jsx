import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function Login() {
  const { login, resendVerification } = useAuth();
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Unverified account warning state
  const [unverifiedNotice, setUnverifiedNotice] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUnverifiedNotice(false);

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
    } else if (result.isUnverified) {
      setUnverifiedNotice(true);
      setUnverifiedEmail(result.email || email);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    await resendVerification(unverifiedEmail || email);
    setResending(false);
    setResendCooldown(60);
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-14 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden bg-[#FAF7F2]">
      <Helmet>
        <title>Sign In | {brandName}</title>
      </Helmet>

      {/* Atmospheric Luxury Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4A24C]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#0D3B2A]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Executive Split-Screen Master Card */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#D4A24C]/35 shadow-2xl bg-white relative z-10">
        
        {/* Left Showcase: Dignified, Clean Brand Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0D3B2A] via-[#0D3B2A] to-[#07241A] text-[#FAF7F2] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Internal ambient radial glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A24C]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4A24C]/40 text-[#D4A24C] text-[10.5px] font-semibold uppercase tracking-wider backdrop-blur-xs w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>B2B IT Portal</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#FAF7F2] tracking-tight leading-snug">
                Enterprise IT Hardware & Rental Fleet.
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed mt-3 font-sans">
                Commercial workstations, laptops, and server infrastructure with pan-India delivery and dedicated SLA support.
              </p>
            </div>

            {/* Clean 3-point list - No bulky boxed cards */}
            <div className="space-y-3 pt-2 text-xs text-[#FAF7F2]/90">
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
                <span>Flexible Corporate Rentals & Net-30 POs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#D4A24C]/20 border border-[#D4A24C]/50 flex items-center justify-center text-[#D4A24C] shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>24–48h SLA Standby Swap Guarantee</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Line */}
          <div className="relative z-10 pt-6 mt-8 border-t border-white/15 flex items-center justify-between text-xs text-[#FAF7F2]/75">
            <span>150+ Corporate Clients</span>
            <span className="font-mono text-[11px] text-[#D4A24C] font-semibold">18% GST Ready</span>
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
                Sign In
              </h1>
              <p className="text-xs text-[#5A6B63] mt-1">
                Enter your corporate credentials to access your account.
              </p>
            </div>

            {/* Unverified Account Alert Banner */}
            {unverifiedNotice && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-[#8A5E12] space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#8A5E12] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#0D3B2A] text-xs">Email Verification Required</h4>
                    <p className="text-[11px] text-[#5A6B63] leading-relaxed mt-0.5">
                      Your account (<strong className="text-[#0D3B2A]">{unverifiedEmail}</strong>) is awaiting email activation. Please check your inbox or spam folder.
                    </p>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between border-t border-amber-200/60">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resending}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0D3B2A] hover:text-[#8A5E12] underline cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                    <span>
                      {resending
                        ? 'Resending...'
                        : resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : 'Resend Activation Link'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnverifiedNotice(false)}
                    className="text-[10.5px] text-[#5A6B63] hover:text-slate-800 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1.5">
                  Corporate Email <span className="text-red-500">*</span>
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
                    className="text-[11px] text-[#8A5E12] hover:text-[#0D3B2A] hover:underline font-semibold transition-colors"
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

              {/* Remember Me */}
              <div className="flex items-center text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#5A6B63] hover:text-[#0D3B2A] transition">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#D4A24C]/40 text-[#0D3B2A] focus:ring-[#0D3B2A] cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] disabled:opacity-50 cursor-pointer border border-[#D4A24C]/40 group"
              >
                <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Register Link */}
            <div className="pt-2 border-t border-slate-100 text-center text-xs text-[#5A6B63]">
              Don't have an enterprise account?{' '}
              <Link to="/signup" className="text-[#8A5E12] font-bold hover:text-[#0D3B2A] hover:underline transition">
                Register here →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
