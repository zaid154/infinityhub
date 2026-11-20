import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Repeat,
  ShoppingCart,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import ThemeSelect from '../components/ThemeSelect';

export default function Signup() {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company_name: '',
    designation: 'IT Head / Sysadmin',
    primary_interest: 'both',
    company_size: '11-50'
  });
  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const designationOptions = [
    { value: 'IT Head / Sysadmin', label: 'IT Head / Systems Administrator' },
    { value: 'Procurement / Vendor Manager', label: 'Procurement / Vendor Manager' },
    { value: 'Founder / Director / C-Level', label: 'Founder / Director / CEO / CTO' },
    { value: 'HR / Operations / Admin', label: 'HR / Operations / Admin' },
    { value: 'Finance / Accounts', label: 'Finance / Accounts Controller' },
    { value: 'Team Lead / Engineer', label: 'Engineering Lead / Developer' },
    { value: 'Other / Professional', label: 'Other Business Professional' }
  ];

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
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#0D3B2A]">Verification Email Sent</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We have sent an activation link to <strong className="text-slate-900">{formData.email}</strong>.
            Please click the link in your corporate inbox to activate your account.
          </p>
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/20 text-[11px] text-[#5A6B63] text-left space-y-1">
            <p className="font-bold text-[#0D3B2A] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
              Corporate Access Ready
            </p>
            <p>Once verified, you can immediately generate Net-30 Proforma POs, track rental fleets, and access verified GST invoices.</p>
          </div>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold transition shadow border border-[#D4A24C]/40"
            >
              Sign In to Corporate Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-6 sm:p-9 rounded-3xl border border-[#D4A24C]/25 shadow-xl max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo theme="light" size="md" />
          </div>
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block mb-0.5">
              — B2B CORPORATE REGISTRATION
            </span>
            <h1 className="text-2xl font-bold font-serif text-[#0D3B2A] tracking-tight">
              Create Enterprise Account
            </h1>
          </div>
          <p className="text-xs text-[#5A6B63] max-w-sm mx-auto">
            Get instant access to corporate rental fleet pricing, Net-30 PO approvals, and GST input credit billing.
          </p>
        </div>

        {/* Anti-Dropoff Reassurance Pill */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Zero paperwork at signup:</strong> GSTIN & delivery address are only required at order checkout.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Role / Designation *</label>
              <ThemeSelect
                value={formData.designation}
                onChange={(val) => setFormData({ ...formData, designation: val })}
                options={designationOptions}
                variant="default"
              />
            </div>
          </div>

          {/* Company Name & Workforce Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Company / Organization *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Tech Labs"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Company Workforce</label>
              <ThemeSelect
                value={formData.company_size}
                onChange={(val) => setFormData({ ...formData, company_size: val })}
                options={[
                  { value: '1-10', label: '1 - 10 Employees' },
                  { value: '11-50', label: '11 - 50 Employees' },
                  { value: '51-200', label: '51 - 200 Employees' },
                  { value: '200+', label: '200+ Employees' }
                ]}
                variant="default"
              />
            </div>
          </div>

          {/* Work Email & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                />
              </div>
              <span className="text-[10px] text-[#5A6B63] block mt-0.5">Use official corporate email for faster Net-30 PO</span>
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">WhatsApp / Phone *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                />
              </div>
              <span className="text-[10px] text-[#5A6B63] block mt-0.5">For immediate dispatch coordination</span>
            </div>
          </div>

          {/* Primary Requirement Selector (Interactive Pills) */}
          <div>
            <label className="block font-semibold text-[#0D3B2A] mb-1.5">Primary Hardware Requirement</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'rent', label: 'Corporate Rental', icon: Repeat },
                { id: 'buy', label: 'Direct Purchase', icon: ShoppingCart },
                { id: 'both', label: 'Both (Rent & Buy)', icon: Sparkles }
              ].map((pill) => {
                const Icon = pill.icon;
                const isSelected = formData.primary_interest === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, primary_interest: pill.id })}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0D3B2A] text-white border-[#0D3B2A] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#5A6B63] hover:text-[#0D3B2A] border-[#D4A24C]/25'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D4A24C]' : 'text-slate-400'}`} />
                    <span className="truncate">{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold text-[#0D3B2A] mb-1">Create Password (Min 6 Characters) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Creating Corporate Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 text-[#D4A24C]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#D4A24C]/15 text-xs text-[#5A6B63]">
          Already have a corporate account?{' '}
          <Link to="/login" className="text-[#8A5E12] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
