import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Building,
  User,
  Send
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from '../components/ThemeSelect';
import { useCompany } from '../context/SettingsContext';

export default function Contact() {
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const brandPhone = company?.phone || '+91 XXXXX XXXXX';
  const brandEmail = company?.procurement_email || company?.email || 'procurement@example.com';
  const brandWhatsapp = company?.whatsapp || '+91 XXXXX XXXXX';
  const whatsappDigits = brandWhatsapp.replace(/\D/g, '');
  const brandAddress = company?.operations_address || company?.registered_address || company?.address || 'Corporate Facility [PLACEHOLDER]';

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
      if (res.data?.success) {
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
    } catch {
      toast.error('Failed to submit message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      <Helmet>
        <title>Contact Procurement Desk | {brandName}</title>
        <meta
          name="description"
          content={`Connect with ${brandName} corporate IT hardware procurement desk for bulk enterprise laptop rentals, workstation leases, and asset liquidation inquiries.`}
        />
      </Helmet>

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
                <p className="leading-relaxed mt-0.5">{brandAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#0D3B2A] shrink-0" />
              <div>
                <strong className="text-[#0D3B2A] block text-xs">Direct Calling Desk:</strong>
                <a href={`tel:${brandPhone}`} className="text-[#0D3B2A] font-semibold hover:underline">
                  {brandPhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#D4A24C] shrink-0" />
              <div>
                <strong className="text-[#0D3B2A] block text-xs">Procurement Email:</strong>
                <a href={`mailto:${brandEmail}`} className="text-[#0D3B2A] font-semibold hover:underline">
                  {brandEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#8A5E12] shrink-0" />
              <div>
                <strong className="text-[#0D3B2A] block text-xs">Operating Hours:</strong>
                <p>{company?.business_hours || 'Monday – Saturday: 9:30 AM – 7:30 PM (IST)'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4A24C]/15">
              <a
                href={whatsappDigits ? `https://wa.me/${whatsappDigits}?text=Hello%20${encodeURIComponent(brandName)},%20we%20have%20an%20urgent%20hardware%20requirement.` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="h-64 rounded-3xl overflow-hidden border border-[#D4A24C]/25 shadow-sm">
            <iframe
              title={`${brandName} Warehouse Location`}
              src={company?.google_maps_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000"}
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
                    placeholder="e.g. +91 98100 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Work Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D4A24C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. procurement@acmetech.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Inquiry Purpose *</label>
              <ThemeSelect
                options={[
                  { value: 'bulk_purchase', label: 'Commercial Bulk Hardware Purchase' },
                  { value: 'rental_fleet', label: 'Corporate Rental / Fleet Leasing' },
                  { value: 'asset_buyback', label: 'Asset Buyback / E-Waste Liquidation' },
                  { value: 'components', label: 'Enterprise Components (RAM/SSD/GPU)' },
                  { value: 'amc_service', label: 'AMC / Maintenance Support' }
                ]}
                value={formData.inquiry_type}
                onChange={(val) => setFormData({ ...formData, inquiry_type: val })}
                variant="form"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Requirement Details & Quantity *</label>
              <textarea
                required
                rows={4}
                placeholder="Mention desired models, configurations (RAM/SSD), total quantities, lease duration, or target deployment date..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98 disabled:opacity-50 cursor-pointer border border-[#D4A24C]/40"
            >
              <Send className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>{submitting ? 'Submitting Inquiry...' : 'Submit Official Procurement Inquiry'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
