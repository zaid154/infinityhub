import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function VerifyEmail() {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { magicVerify } = useAuth();
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const runVerification = async () => {
      const email = searchParams.get('verify_email') || searchParams.get('email');
      const magicToken = searchParams.get('verify_token') || searchParams.get('token');

      // 1. Dual-Engine 1-Click Magic Link Verification
      if (email && magicToken) {
        setIsMagicLink(true);
        const res = await magicVerify(email, magicToken);
        if (!isMounted) return;

        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'Corporate account verified successfully via 1-Click Magic Link!');
          // Auto redirect to dashboard after 2.5s
          setTimeout(() => {
            if (isMounted) navigate('/dashboard');
          }, 2500);
        } else {
          setStatus('error');
          setMessage(res.message || 'Magic Link is invalid or has expired. Please request a new code.');
        }
        return;
      }

      // 2. Legacy Token in URL route (:token)
      const token = routeToken || magicToken;
      if (token) {
        try {
          const res = await api.get(`/auth/verify-email/${token}`);
          if (!isMounted) return;

          if (res.data?.success) {
            setStatus('success');
            setMessage(res.data.message || 'Email verified successfully!');
          } else {
            setStatus('error');
            setMessage(res.data?.message || 'Verification failed.');
          }
        } catch (err) {
          if (!isMounted) return;
          setStatus('error');
          setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
        }
        return;
      }

      // 3. Neither present
      setStatus('error');
      setMessage('No verification token detected in the URL. Please check your email link or request a new OTP.');
    };

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [routeToken, searchParams, magicVerify, navigate]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <Helmet>
        <title>Verify Email | {brandName}</title>
      </Helmet>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4A24C]/35 shadow-2xl max-w-md w-full text-center space-y-5">
        <div className="flex justify-center mb-1">
          <BrandLogo theme="light" size="md" />
        </div>

        {status === 'verifying' && (
          <div className="space-y-4 py-4">
            <Loader2 className="w-12 h-12 text-[#D4A24C] animate-spin mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-serif text-[#0D3B2A]">
                {isMagicLink ? 'Authenticating Magic Link...' : 'Verifying Email Address...'}
              </h2>
              <p className="text-xs text-[#5A6B63]">
                Please wait while we validate your credentials and activate your session.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            {isMagicLink && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B2A]/8 text-[#0D3B2A] text-[10.5px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A24C]" />
                <span>1-Click Magic Link Verified</span>
              </div>
            )}

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-serif text-[#0D3B2A]">Account Activated!</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
            </div>

            <div className="pt-3">
              <Link
                to="/dashboard"
                className="w-full py-3 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 border border-[#D4A24C]/40 group"
              >
                <span>Enter Corporate Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-serif text-[#0D3B2A]">Verification Failed</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
            </div>

            <div className="pt-3 space-y-2">
              <Link
                to="/signup"
                className="w-full py-3 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 border border-[#D4A24C]/40"
              >
                Request a New Code →
              </Link>
              <Link
                to="/login"
                className="block text-xs text-[#8A5E12] font-semibold hover:underline pt-1"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
