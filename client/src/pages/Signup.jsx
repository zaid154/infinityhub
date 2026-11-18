import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Server, User, Mail, Lock, Phone, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import BrandLogo from '../components/BrandLogo';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company_name: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await register(formData);
    setSubmitting(false);

    if (result.success) {
      setRegisteredSuccess(true);
    }
  };

  if (registeredSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4A24C]/25 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#0D3B2A]">Check Your Email</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We have sent a verification link to <strong className="text-slate-800">{formData.email}</strong>. Please click the link to activate your corporate account.
          </p>
          <div className="pt-4">
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold transition shadow border border-[#D4A24C]/40"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#D4A24C]/25 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <BrandLogo theme="light" size="md" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#0D3B2A] tracking-tight">
            Register Corporate Account
          </h1>
          <p className="text-xs text-[#5A6B63]">
            Create an account to track orders, manage rental fleets, and access GST bills.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Vikram Malhotra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Nexus Tech Labs"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password (Min 6 Characters) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40"
          >
            <span>{submitting ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-[#8A5E12] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
