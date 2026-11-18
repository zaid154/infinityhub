import React, { useState } from 'react';
import {
  Recycle,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Building,
  User,
  Phone,
  Mail,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Buyback() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    asset_type: 'Used Laptops (i3/i5/i7 Mix)',
    approx_quantity: 25,
    city: 'Delhi NCR',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/buyback', formData);
      if (res.data.success) {
        toast.success('Asset liquidation request registered! Our valuation team will contact you shortly.');
        setFormData({
          company_name: '',
          contact_person: '',
          phone: '',
          email: '',
          asset_type: 'Used Laptops (i3/i5/i7 Mix)',
          approx_quantity: 25,
          city: 'Delhi NCR',
          description: ''
        });
      }
    } catch (err) {
      toast.error('Failed to submit asset liquidation request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
          Corporate IT Asset Disposition (ITAD)
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Turn Depreciated Office Hardware Into Liquid Capital
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Upgrading your office IT fleet? Nova Infotech buys back used, outdated, or surplus laptops, desktops, servers, and monitors from companies across India with immediate wire payout and certified data destruction.
        </p>
      </div>

      {/* Main Grid: Form + Value Props */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Information */}
        <div className="lg:col-span-5 space-y-6 text-xs text-slate-600">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              NIST 800-88 Data Sanitization
            </h3>
            <p className="leading-relaxed">
              We ensure zero data leakage risk. All storage drives (NVMe, SATA SSDs, HDDs) undergo multi-pass cryptographic data wiping with serial-tracked Certificates of Data Destruction issued to your compliance team.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4A24C]" />
              Fair Market Valuation
            </h3>
            <p className="leading-relaxed">
              Unlike scrap dealers who weigh electronics like iron, we evaluate machines based on functional component value (CPU generation, RAM sticks, working display panels, GPUs), ensuring you receive 30–50% higher cash returns.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#0D3B2A]" />
              Pan-India Doorstep Pickup
            </h3>
            <p className="leading-relaxed">
              Our logistics team visits your office location in Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, and Tier-1 hubs to pack, manifest, and transport hardware directly.
            </p>
          </div>
        </div>

        {/* Right Request Form */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Request Bulk Asset Liquidation Offer</h2>
            <p className="text-xs text-slate-500 mt-1">
              Share details of the hardware lot you wish to liquidate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Entity Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Tech Private Limited"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siddharth Mehta"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asset Category</label>
                <select
                  value={formData.asset_type}
                  onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 transition"
                >
                  <option value="Used Laptops (i3/i5/i7 Mix)">Used Laptops (ThinkPad, Dell, HP)</option>
                  <option value="Complete Desktop Towers & Monitors">Desktop Towers & Monitors Lot</option>
                  <option value="Servers & Workstations">Servers & Workstations</option>
                  <option value="RAM / GPU / CPU Scrap Lot">Components Lot (RAM, GPUs, CPUs)</option>
                  <option value="Mixed E-Waste Lot">Dead / Mixed Scrap Hardware</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Units</label>
                <input
                  type="number"
                  min="5"
                  value={formData.approx_quantity}
                  onChange={(e) => setFormData({ ...formData, approx_quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Office City / Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi NCR / Bangalore"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="procurement@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lot Specifications / Remarks</label>
              <textarea
                rows="3"
                placeholder="e.g. 20x ThinkPad T480 (8th Gen i5), 5x Dell 24 inch screens. All power on."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
            >
              <Recycle className="w-4 h-4 text-[#D4A24C]" />
              <span>{submitting ? 'Submitting...' : 'Submit Lot for Valuation'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
