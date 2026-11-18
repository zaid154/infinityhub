import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import BrandLogo from '../components/BrandLogo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to send reset link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4A24C]/25 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <BrandLogo theme="light" size="md" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#0D3B2A] tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-[#5A6B63]">
            Enter your work email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an account is associated with <strong className="text-slate-800">{email}</strong>, a password reset link has been dispatched to your corporate email address.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold transition shadow border border-[#D4A24C]/40"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40"
            >
              <span>{submitting ? 'Sending...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-[#8A5E12] hover:underline font-bold">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
