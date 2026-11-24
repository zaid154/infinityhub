import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import BrandLogo from '../components/BrandLogo';
import { useCompany } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { company } = useCompany();
  const { verifyResetOtp } = useAuth();
  const brandName = company?.brand_name || 'Demo Infotech';

  const resetEmail = searchParams.get('reset_email') || searchParams.get('email') || '';
  const magicToken = searchParams.get('reset_token') || searchParams.get('token') || '';
  const token = routeToken || magicToken;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Dual-Channel 1-Click Magic Link Password Reset
      if (resetEmail && magicToken) {
        const res = await verifyResetOtp({
          email: resetEmail,
          magicToken,
          newPassword: password
        });

        if (res.success) {
          setSuccess(true);
          setTimeout(() => navigate('/login'), 2000);
        }
        return;
      }

      // 2. Legacy Token in URL route
      if (token) {
        const res = await api.post(`/auth/reset-password/${token}`, { password });
        if (res.data?.success) {
          toast.success('Password updated successfully! Please sign in.');
          setSuccess(true);
          setTimeout(() => navigate('/login'), 2000);
        } else {
          toast.error(res.data?.message || 'Failed to reset password.');
        }
        return;
      }

      toast.error('No reset token provided. Please request a new password reset link.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <Helmet>
        <title>Reset Password | {brandName}</title>
      </Helmet>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4A24C]/35 shadow-2xl max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <BrandLogo theme="light" size="md" />
          </div>

          {resetEmail && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B2A]/8 text-[#0D3B2A] text-[10.5px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>1-Click Authenticated Session</span>
            </div>
          )}

          <h1 className="text-2xl font-bold font-serif text-[#0D3B2A] tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs text-[#5A6B63] leading-relaxed">
            {resetEmail
              ? `Enter your new secure password for ${resetEmail}.`
              : `Set a new secure password for your ${brandName} corporate account.`}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-serif text-[#0D3B2A]">Password Reset Successful!</h2>
              <p className="text-xs text-slate-600">Redirecting you to the sign-in portal...</p>
            </div>
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold transition shadow border border-[#D4A24C]/40"
            >
              Sign In Now →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">New Password (Min 6 Characters) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-base sm:text-xs"
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

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Confirm New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 min-h-11 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition text-base sm:text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-11 py-3 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-98 disabled:opacity-50 cursor-pointer border border-[#D4A24C]/40 group"
            >
              <span>{submitting ? 'Updating...' : 'Save New Password'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 border-t border-slate-100 text-center">
              <Link to="/login" className="text-[#8A5E12] font-bold hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
