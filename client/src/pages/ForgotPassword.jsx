import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  Edit3,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function ForgotPassword() {
  const { sendResetOtp, verifyResetOtp } = useAuth();
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email Form, 2: OTP + New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const otpInputRefs = useRef([]);

  // Cooldown countdown effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError('');

    const res = await sendResetOtp(email.trim().toLowerCase());
    setSubmitting(false);

    if (res.success) {
      setStep(2);
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } else {
      setError(res.message || 'Failed to dispatch reset code.');
    }
  };

  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = cleanVal.slice(-1);
    setOtp(newOtp);
    if (error) setError('');

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
    if (error) setError('');
    const focusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError('');

    const res = await sendResetOtp(email.trim().toLowerCase());
    setResending(false);

    if (res.success) {
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } else {
      setError(res.message || 'Failed to resend code.');
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await verifyResetOtp({
      email: email.trim().toLowerCase(),
      otp: otpCode,
      newPassword
    });
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } else {
      setError(res.message || 'Failed to update password. Please check the code.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <Helmet>
        <title>Reset Password | {brandName}</title>
      </Helmet>

      <div className="bg-white p-7 sm:p-10 rounded-3xl border border-[#D4A24C]/35 shadow-2xl max-w-md w-full space-y-5 relative">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BrandLogo theme="light" size="md" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dual-Channel OTP Engine</span>
          </div>

          <h1 className="text-2xl font-bold font-serif text-[#0D3B2A] tracking-tight">
            {step === 1 ? 'Reset Password' : 'Enter 6-Digit Code'}
          </h1>
          <p className="text-xs text-[#5A6B63] leading-relaxed">
            {step === 1
              ? 'Enter your corporate work email to receive a 6-digit verification code & 1-Click reset link.'
              : `A 6-digit reset code has been dispatched to ${email}.`}
          </p>
        </div>

        {success ? (
          /* Success Notification */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-[#0D3B2A]">Password Updated!</h2>
              <p className="text-xs text-slate-600 mt-1">
                Your corporate account password has been updated. Redirecting to login...
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold transition shadow border border-[#D4A24C]/40"
            >
              Sign In Now →
            </Link>
          </div>
        ) : step === 1 ? (
          /* Step 1: Work Email Form */
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Corporate Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-3.5 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-base sm:text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full min-h-11 py-3 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24C]" />
                  <span>Dispatching Code...</span>
                </>
              ) : (
                <>
                  <span>Send 6-Digit Reset Code</span>
                  <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-[#8A5E12] hover:underline font-bold text-xs">
                Back to Sign In
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP + New Password */
          <form onSubmit={handleVerifyAndReset} className="space-y-4 text-xs">
            {/* Recipient Address Badge */}
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-[#D4A24C] shrink-0" />
                <span className="font-mono text-xs font-semibold text-[#0D3B2A] truncate">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                className="inline-flex items-center gap-1 text-[11px] text-[#8A5E12] hover:text-[#0D3B2A] font-semibold underline shrink-0 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            {/* 6 OTP Input Boxes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-[#0D3B2A] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#D4A24C]" />
                  <span>6-Digit Verification Code</span>
                </label>
                <span className="text-[10px] text-[#5A6B63] font-mono">Valid 10 mins</span>
              </div>
              <div className="flex items-center justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
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
                    className={`w-10 sm:w-11 h-11 sm:h-12 text-center font-mono text-lg sm:text-xl font-bold rounded-xl border transition bg-[#FAF7F2] text-[#0D3B2A] focus:outline-none ${
                      digit
                        ? 'border-[#0D3B2A] bg-white ring-1 ring-[#0D3B2A]'
                        : 'border-[#D4A24C]/35 hover:border-[#D4A24C]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">New Password (Min 6 Characters) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] transition text-base sm:text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0D3B2A] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Confirm New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] transition text-base sm:text-xs"
                />
              </div>
            </div>

            {/* 1-Click Magic Link Info Card */}
            <div className="p-3 rounded-xl bg-[#0D3B2A]/5 border border-[#D4A24C]/30 text-xs space-y-0.5">
              <div className="font-bold flex items-center gap-1.5 text-[#0D3B2A]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A24C]" />
                <span>1-Click Reset Link Dispatched</span>
              </div>
              <p className="text-[11px] text-[#5A6B63] leading-relaxed">
                You can also click the <strong>Reset Password in 1-Click</strong> button inside the email to set your new password directly.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || otp.join('').length !== 6 || !newPassword || !confirmPassword}
              className="w-full min-h-11 py-3 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24C]" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Reset & Save Password</span>
                  <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
                </>
              )}
            </button>

            {/* Resend Cooldown Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#5A6B63]">Didn't get code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || resending}
                className="inline-flex items-center gap-1 font-semibold text-[#8A5E12] hover:text-[#0D3B2A] disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>
                  {resending
                    ? 'Sending...'
                    : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : 'Resend Code'}
                </span>
              </button>
            </div>

            <div className="text-center pt-2 border-t border-slate-100">
              <Link to="/login" className="text-[#8A5E12] hover:underline font-bold text-xs">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
