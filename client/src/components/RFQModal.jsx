import React, { useState } from 'react';
import { X, Check, MessageSquare, FileText, Send, Building, User, Phone, Mail } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from './ThemeSelect';

export default function RFQModal({ isOpen, onClose, initialContext }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    inquiry_type: 'bulk_purchase',
    product_ref: initialContext || '',
    quantity: '5 - 10 Units',
    city: 'Delhi NCR',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/inquiries', formData);
      if (res.data.success) {
        toast.success('Quotation request logged! Our desk will connect within 2 business hours.');
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppForward = () => {
    const { company_name, contact_person, phone, product_ref, quantity, city, message, inquiry_type } = formData;
    if (!company_name || !contact_person || !phone) {
      toast.error('Please enter Company Name, Contact Person, and Phone first.');
      return;
    }

    const text = `*NEW CORPORATE RFQ INQUIRY*\n------------------------------\n*Company:* ${company_name}\n*Contact Person:* ${contact_person}\n*Phone:* ${phone}\n*Location:* ${city}\n*Requirement:* ${inquiry_type}\n*Hardware / Model:* ${product_ref || 'Bulk Enterprise IT'}\n*Volume:* ${quantity}\n*Notes:* ${message || 'Standard Configuration'}\n------------------------------\nPlease share official GST quotation with SLA.`;

    const url = `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#D4A24C]/30">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — PRIORITY PROCUREMENT DESK
          </span>
          <h3 className="text-xl font-bold font-serif text-[#0D3B2A] mt-1">
            Request Official Hardware Quotation
          </h3>
          <p className="text-xs text-[#5A6B63] mt-1">
            {initialContext ? `Inquiring for: ${initialContext}` : 'Fill in your enterprise details for an itemized GST quotation.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company / Organization *</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Innovatech Solutions Pvt Ltd"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
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
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="procurement@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Units Required *</label>
              <ThemeSelect
                value={formData.quantity}
                onChange={(val) => setFormData({ ...formData, quantity: val })}
                options={[
                  { value: '5 - 10 Units', label: '5 – 10 Units' },
                  { value: '11 - 25 Units', label: '11 – 25 Units' },
                  { value: '26 - 50 Units', label: '26 – 50 Units' },
                  { value: '50+ Units', label: '50+ Units (Enterprise)' }
                ]}
                variant="form"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Specific Hardware / Custom Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. Need Core i5 8th Gen, 16GB RAM, delivery required in Delhi within 3 days."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] transition"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#D4A24C]" />
              <span>{submitting ? 'Submitting...' : 'Submit Official RFQ Request'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppForward}
              className="w-full py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/30 font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#0D3B2A]" />
              <span>Forward Directly via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
