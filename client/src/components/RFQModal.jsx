import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageSquare,
  FileText,
  Building,
  User,
  Phone,
  Mail,
  Layers,
  ChevronDown,
  Check,
  ShieldCheck,
  ArrowRight,
  Clock
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useCompany } from '../context/SettingsContext';
import { useReducedMotionSafe, APPLE_SPRING } from '../animations';

// Luxury Select for RFQ Modal
function RFQSelect({ value, onChange, options, icon: Icon, placeholder = 'Select units' }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-10 pr-9 py-2.5 bg-[#FAF7F2] border text-[#0D3B2A] rounded-xl text-xs font-sans text-left transition flex items-center justify-between cursor-pointer focus:outline-none ${
          isOpen ? 'border-[#0D3B2A] ring-1 ring-[#0D3B2A] bg-white' : 'border-[#D4A24C]/30 hover:border-[#D4A24C]/60'
        }`}
      >
        {Icon && (
          <Icon className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        <span className="truncate font-medium">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#8A5E12] absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 pointer-events-none ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-[#D4A24C]/35 rounded-xl shadow-2xl py-1 z-50 max-h-52 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#0D3B2A]/8 text-[#0D3B2A] font-bold'
                    : 'text-[#4A5568] hover:bg-[#FAF7F2] hover:text-[#0D3B2A]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A24C] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

  const quantityOptions = [
    { value: '1 - 5 Units', label: '1 – 5 Units (Trial / Pilot)' },
    { value: '5 - 10 Units', label: '5 – 10 Units (Small Team)' },
    { value: '11 - 25 Units', label: '11 – 25 Units (Growth Fleet)' },
    { value: '26 - 50 Units', label: '26 – 50 Units (Mid-Market)' },
    { value: '50+ Units', label: '50+ Units (Enterprise)' }
  ];

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
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
          transition={APPLE_SPRING}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-[#D4A24C]/40 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-[#0D3B2A] transition p-1.5 cursor-pointer rounded-full hover:bg-[#FAF7F2]"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="mb-5 pr-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D4A24C]/35 text-[#8A5E12] text-[10.5px] font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>Priority Procurement Desk</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#0D3B2A] tracking-tight">
              Request Hardware Quotation
            </h3>
            <p className="text-xs text-[#5A6B63] mt-1">
              {initialContext ? (
                <span>
                  Inquiring for:{' '}
                  <strong className="text-[#0D3B2A] font-semibold">{initialContext}</strong>
                </span>
              ) : (
                'Provide your company requirements for an itemized commercial quotation with GST breakdown.'
              )}
            </p>
          </div>

          {/* Quotation Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Row 1: Company Name */}
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">
                Company / Organization <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Innovatech Solutions Pvt Ltd"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Row 2: Contact Person & WhatsApp Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9+\s-]/g, '');
                      setFormData({ ...formData, phone: clean });
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Corporate Work Email & Units Required (Balanced 50/50 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Work Email <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#D4A24C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Units Required <span className="text-red-500">*</span>
                </label>
                <RFQSelect
                  value={formData.quantity}
                  onChange={(val) => setFormData({ ...formData, quantity: val })}
                  options={quantityOptions}
                  icon={Layers}
                  placeholder="Select volume"
                />
              </div>
            </div>

            {/* Row 4: Hardware Notes & Specs */}
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">
                Specific Hardware / Requirements Note
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Need Core i5/i7, 16GB RAM, 512GB SSD. Delivery required in Delhi NCR within 3 days."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 rounded-xl text-xs text-[#0D3B2A] focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer disabled:opacity-50 group"
              >
                <FileText className="w-4 h-4 text-[#D4A24C]" />
                <span>{submitting ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
                <ArrowRight className="w-4 h-4 text-[#D4A24C] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleWhatsAppForward}
                className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-100 text-[#0D3B2A] border border-[#D4A24C]/35 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Instant Connect via WhatsApp</span>
              </button>
            </div>

            {/* SLA Reassurance Line */}
            <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#5A6B63] pt-1">
              <Clock className="w-3.5 h-3.5 text-[#8A5E12]" />
              <span>Official GST itemized quotation dispatched within 2 business hours.</span>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
