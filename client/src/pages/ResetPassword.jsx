import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import BrandLogo from '../components/BrandLogo';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        toast.success('Password updated successfully! Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
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
            Create New Password
          </h1>
          <p className="text-xs text-[#5A6B63]">
            Set a new secure password for your Nova Infotech corporate account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40"
          >
            <span>{submitting ? 'Updating...' : 'Set New Password'}</span>
            <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
          </button>
        </form>
      </div>
    </div>
  );
}
