import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, MessageSquare, FileText, Send, Building, User, Phone, Mail } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from './ThemeSelect';
import { useCompany } from '../context/SettingsContext';
import { useReducedMotionSafe, APPLE_SPRING } from '../animations';

export default function RFQModal({ isOpen, onClose, initialContext }) {
  const { company } = useCompany();
  const shouldReduce = useReducedMotionSafe();

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

  if (!isOpen) return null;

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

    const rawNumber = company?.whatsapp || '';
    const digitsOnly = rawNumber.replace(/\D/g, '') || '919876543210';
    const url = `https://wa.me/${digitsOnly}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
          transition={APPLE_SPRING}
          className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-[#D4A24C]/35 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5A6B63] hover:text-[#0D3B2A] transition p-1 cursor-pointer rounded-full hover:bg-[#FAF7F2]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-3.5 pr-6">
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — PRIORITY PROCUREMENT DESK
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-[#0D3B2A] mt-0.5">
            Request Official Hardware Quotation
          </h3>
          <p className="text-[11px] text-[#5A6B63] mt-0.5">
            {initialContext ? `Inquiring for: ${initialContext}` : 'Fill in enterprise details for an itemized GST quotation.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#0D3B2A] text-[11px] mb-1">Company / Organization *</label>
            <div className="relative">
              <Building className="w-3.5 h-3.5 text-[#8A5E12] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Innovatech Solutions Pvt Ltd"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition placeholder:text-[#5A6B63]/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-[#0D3B2A] text-[11px] mb-1">Contact Person *</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#8A5E12] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition placeholder:text-[#5A6B63]/60"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0D3B2A] text-[11px] mb-1">WhatsApp Number *</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#8A5E12] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition placeholder:text-[#5A6B63]/60"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-[#0D3B2A] text-[11px] mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#8A5E12] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="procurement@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition placeholder:text-[#5A6B63]/60"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0D3B2A] text-[11px] mb-1">Units Required *</label>
              <ThemeSelect
                value={formData.quantity}
                onChange={(val) => setFormData({ ...formData, quantity: val })}
                options={[
                  { value: '5 - 10 Units', label: '5 – 10 Units' },
                  { value: '11 - 25 Units', label: '11 – 25 Units' },
                  { value: '26 - 50 Units', label: '26 – 50 Units' },
                  { value: '50+ Units', label: '50+ Units (Enterprise)' }
                ]}
                variant="compact"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#0D3B2A] text-[11px] mb-1">Specific Hardware / Custom Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. Need Core i5 8th Gen, 16GB RAM, delivery required in Delhi within 3 days."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-[#D4A24C]/35 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition resize-none placeholder:text-[#5A6B63]/60"
            />
          </div>

          <div className="pt-1 space-y-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>{submitting ? 'Submitting...' : 'Submit Official RFQ Request'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppForward}
              className="w-full py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/35 font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#0D3B2A]" />
              <span>Forward Directly via WhatsApp</span>
            </button>
          </div>
        </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
