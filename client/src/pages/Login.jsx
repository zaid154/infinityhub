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
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <BrandLogo theme="light" size="md" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
            Sign In to Nova Infotech
          </h1>
          <p className="text-xs text-slate-500">
            Access your corporate procurement orders, rentals & quotes.
          </p>
        </div>

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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-blue-600 hover:underline text-[11px]">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don't have a corporate account?{' '}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">
            Register Company
          </Link>
        </div>

        {/* Demo credentials hint */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
          <p className="font-bold text-slate-700">Initial Admin Credentials:</p>
          <p>Email: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">admin@technova.com</code></p>
          <p>Password: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">Admin@123</code></p>
        </div>
      </div>
    </div>
  );
}
