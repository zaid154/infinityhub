import React, { useState, useEffect } from 'react';
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
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    inquiry_type: 'bulk_purchase',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error('[Contact] Settings fetch notice:', err);
      }
    };
    fetchSettings();
  }, []);

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
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#8A5E12] font-bold block">
          — DIRECT PROCUREMENT DESK
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3B2A] tracking-tight">
          Connect With Our Hardware Specialists
        </h1>
        <p className="text-sm text-[#5A6B63]">
          Have an urgent bulk requirement or need a custom quotation? We respond within 2 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-7 rounded-3xl border border-[#D4A24C]/25 shadow-sm space-y-6 text-xs text-[#5A6B63]">
            <h3 className="text-base font-bold font-serif text-[#0D3B2A]">Procurement Facility</h3>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D4A24C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0D3B2A] block text-xs">Warehouse & Diagnostic Lab:</strong>
                <p className="leading-relaxed mt-0.5">
                  {settings?.address || 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR, India.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#0D3B2A] shrink-0" />
              <div>
                <strong className="text-[#0D3B2A] block text-xs">Direct Calling Desk:</strong>
                <a href={`tel:${settings?.phone || '+919876543210'}`} className="text-[#0D3B2A] font-semibold hover:underline">
                  {settings?.phone || '+91 98765 43210'}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#D4A24C] shrink-0" />
              <div>
                <strong className="text-[#0D3B2A] block text-xs">Procurement Email:</strong>
                <a href={`mailto:${settings?.email || 'procurement@novainfotech.in'}`} className="text-[#0D3B2A] font-semibold hover:underline">
                  {settings?.email || 'procurement@novainfotech.in'}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#8A5E12] shrink-0" />
              <div>
                <strong className="text-[#0D3B2A] block text-xs">Operating Hours:</strong>
                <p>Monday – Saturday: 9:30 AM – 7:30 PM (IST)</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4A24C]/15">
              <a
                href={`https://wa.me/${(settings?.whatsapp || '919876543210').replace(/[^0-9]/g, '')}?text=Hello%20Nova%20Infotech,%20we%20have%20an%20urgent%20hardware%20requirement.`}
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
          <div className="h-64 rounded-3xl overflow-hidden border border-[#D4A24C]/25 shadow-sm">
            <iframe
              title="Nova Infotech Warehouse Location"
              src={settings?.google_maps_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-3xl border border-[#D4A24C]/25 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#0D3B2A]">Send an Official Inquiry</h2>
            <p className="text-xs text-[#5A6B63] mt-1">
              We provide formal itemized proforma quotes for GST-registered companies.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Company / Entity Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Contact Person *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman Sharma"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="procurement@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Requirement Type</label>
                <select
                  value={formData.inquiry_type}
                  onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
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
              <label className="block font-semibold text-[#0D3B2A] mb-1">Message / Requirements</label>
              <textarea
                rows="4"
                placeholder="Mention desired configurations, volume, timelines, or questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 border border-[#D4A24C]/40 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#D4A24C]" />
              <span>{submitting ? 'Transmitting...' : 'Send Inquiry to Corporate Desk'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
