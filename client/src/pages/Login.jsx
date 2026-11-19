import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Server, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import BrandLogo from '../components/BrandLogo';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4A24C]/25 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <BrandLogo theme="light" size="md" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#0D3B2A] tracking-tight">
            Sign In to Nova Infotech
          </h1>
          <p className="text-xs text-[#5A6B63]">
            Access your corporate procurement orders, rentals & quotes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#0D3B2A] mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[#0D3B2A]">Password</label>
              <Link to="/forgot-password" className="text-[#8A5E12] hover:underline text-[11px] font-bold">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
          >
            <span>{submitting ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#D4A24C]/15 text-xs text-[#5A6B63]">
          Don't have a corporate account?{' '}
          <Link to="/signup" className="text-[#8A5E12] font-bold hover:underline">
            Register Company
          </Link>
        </div>

        {/* Demo credentials hint */}
        <div className="p-3 bg-[#FAF7F2] border border-[#D4A24C]/30 rounded-xl text-[11px] text-[#5A6B63] space-y-1">
          <p className="font-bold text-[#0D3B2A]">Initial Admin Credentials:</p>
          <p>Email: <code className="bg-white px-1.5 py-0.5 rounded text-[#0D3B2A] font-mono border border-[#D4A24C]/30">admin@technova.com</code></p>
          <p>Password: <code className="bg-white px-1.5 py-0.5 rounded text-[#0D3B2A] font-mono border border-[#D4A24C]/30">Admin@123</code></p>
        </div>
      </div>
    </div>
  );
}
