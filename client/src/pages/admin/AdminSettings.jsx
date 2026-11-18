import React, { useState, useEffect } from 'react';
import { Settings, Save, Building, Phone, Mail, MapPin, ShieldCheck, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    company_name: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    google_maps_embed_url: '',
    gst_number: '',
    invoice_prefix: 'INV'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.settings) {
          setSettings({
            company_name: res.data.settings.company_name || '',
            tagline: res.data.settings.tagline || '',
            phone: res.data.settings.phone || '',
            whatsapp: res.data.settings.whatsapp || '',
            email: res.data.settings.email || '',
            address: res.data.settings.address || '',
            google_maps_embed_url: res.data.settings.google_maps_embed_url || '',
            gst_number: res.data.settings.gst_number || '',
            invoice_prefix: res.data.settings.invoice_prefix || 'INV'
          });
        }
      } catch (err) {
        console.error('[Admin Settings Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', settings);
      if (res.data.success) {
        toast.success('Site settings and contact info updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 text-xs">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Enterprise Site Settings</h1>
        <p className="text-slate-500 mt-1">
          Customize your business name, contact numbers, warehouse location, and GSTIN. All changes reflect live across the entire website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#D4A24C]" />
            Company Identity & Branding
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Brand Name *</label>
              <input
                type="text"
                required
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={settings.gst_number}
                onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={settings.invoice_prefix}
                onChange={(e) => setSettings({ ...settings, invoice_prefix: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Communication Channels */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#0D3B2A]" />
            Direct Communication & WhatsApp
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Calling Phone Number *</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                WhatsApp Business Number (with Country Code) *
              </label>
              <input
                type="text"
                required
                placeholder="+919876543210"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Sales / Support Email *</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
            />
          </div>
        </div>

        {/* Physical Address & Maps */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4A24C]" />
            Warehouse Address & Google Maps Embed
          </h2>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Complete Facility / Shop Address *</label>
            <textarea
              rows="2"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Google Maps Embed URL</label>
            <input
              type="text"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={settings.google_maps_embed_url}
              onChange={(e) => setSettings({ ...settings, google_maps_embed_url: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A] font-mono text-[11px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#124e38] text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#0D3B2A]/25 flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-[#D4A24C]" />
          <span>{saving ? 'Saving...' : 'Update Settings'}</span>
        </button>
      </form>
    </div>
  );
}
