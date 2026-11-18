import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Building,
  User,
  Send,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    inquiry_type: 'bulk_purchase',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/inquiries', formData);
      if (res.data.success) {
        toast.success('Inquiry received! Our procurement desk will contact you shortly.');
        setFormData({
          company_name: '',
          contact_person: '',
          phone: '',
          email: '',
          inquiry_type: 'bulk_purchase',
          message: ''
        });
      }
    } catch (err) {
      toast.error('Failed to submit message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          Direct Procurement Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Connect With Our Hardware Specialists
        </h1>
        <p className="text-sm text-slate-600">
          Have an urgent bulk requirement or need a custom quotation? We respond within 2 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-600">
            <h3 className="text-base font-bold text-slate-900">Procurement Facility</h3>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block text-xs">Warehouse & Diagnostic Lab:</strong>
                <p className="leading-relaxed mt-0.5">
                  Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR, India.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-slate-800 block text-xs">Direct Calling Desk:</strong>
                <a href="tel:+919876543210" className="text-blue-600 font-semibold hover:underline">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <strong className="text-slate-800 block text-xs">Procurement Email:</strong>
                <a href="mailto:procurement@novainfotech.in" className="text-blue-600 font-semibold hover:underline">
                  procurement@novainfotech.in
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="text-slate-800 block text-xs">Operating Hours:</strong>
                <p>Monday – Saturday: 9:30 AM – 7:30 PM (IST)</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <a
                href="https://wa.me/919876543210?text=Hello%20Nova%20Infotech,%20we%20have%20an%20urgent%20hardware%20requirement."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              title="Nova Infotech Warehouse Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send an Official Inquiry</h2>
            <p className="text-xs text-slate-500 mt-1">
              We provide formal itemized proforma quotes for GST-registered companies.
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
                  placeholder="e.g. Acme Tech Solutions"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 transition"
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
                    placeholder="e.g. Aman Sharma"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 transition"
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
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 transition"
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirement Type</label>
                <select
                  value={formData.inquiry_type}
                  onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 transition"
                >
                  <option value="bulk_purchase">Bulk Hardware Purchase</option>
                  <option value="rental">Corporate Laptop Rental</option>
                  <option value="components">Wholesale Components (RAM/GPU)</option>
                  <option value="amc">AMC & Chip-Level Repair</option>
                  <option value="buyback">Asset Liquidation (Buyback)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message / Requirements</label>
              <textarea
                rows="4"
                placeholder="Mention desired configurations, volume, timelines, or questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting...' : 'Send Inquiry to Corporate Desk'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
