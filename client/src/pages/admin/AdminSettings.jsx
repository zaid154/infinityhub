import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Building,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  FileText,
  CreditCard,
  Percent,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  Clock,
  ExternalLink,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';

const DEFAULT_CATEGORY_GST_RATES = [
  { category_key: 'laptop', category_name: 'Corporate Laptops', hsn_sac: '8471 30 10', gst_rate: 18, description: 'Standard commercial notebooks & ultrabooks' },
  { category_key: 'desktop', category_name: 'Commercial Desktops', hsn_sac: '8471 41 90', gst_rate: 18, description: 'Tower PCs, all-in-one & micro desktops' },
  { category_key: 'server', category_name: 'Enterprise Servers', hsn_sac: '8471 49 00', gst_rate: 18, description: 'Rackmount & blade servers' },
  { category_key: 'monitor', category_name: 'Business Monitors', hsn_sac: '8528 52 00', gst_rate: 18, description: 'Commercial IPS displays & monitors' },
  { category_key: 'ram', category_name: 'RAM & Memory', hsn_sac: '8473 30 20', gst_rate: 18, description: 'DDR4 & DDR5 ECC / Non-ECC modules' },
  { category_key: 'storage', category_name: 'SSD & Storage', hsn_sac: '8471 70 20', gst_rate: 18, description: 'NVMe M.2 & SATA solid state drives' },
  { category_key: 'gpu', category_name: 'Workstation GPUs', hsn_sac: '8473 30 99', gst_rate: 18, description: 'Dedicated AI & 3D compute graphics cards' },
  { category_key: 'peripheral', category_name: 'Peripherals & Accessories', hsn_sac: '8471 60 60', gst_rate: 18, description: 'Docks, chargers, keyboards & networking' },
  { category_key: 'rental', category_name: 'Corporate Fleet Rentals', hsn_sac: '997311', gst_rate: 18, description: 'Operating leasing of computers & hardware' },
  { category_key: 'buyback', category_name: 'Asset Buyback / E-Waste', hsn_sac: '8471 90 00', gst_rate: 5, description: 'ITAD decommissioned electronics disposition' }
];

export default function AdminSettings() {
  const { refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('branding'); // branding | contact | signatory | gst | banking | warehouse

  const [settings, setSettings] = useState({
    company_name: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    google_maps_embed_url: '',
    logo_url: '',
    gst_number: '',
    invoice_prefix: 'INV',
    business_hours: '',
    warehouse_locations: '',
    support_sla: '',

    // Manager Sign & Seal
    signatory_name: '',
    signatory_designation: '',
    signature_url: '',
    company_seal_url: '',

    // Category GST
    category_gst_rates: DEFAULT_CATEGORY_GST_RATES,
    default_gst_rate: 18,

    // Banking
    bank_details: {
      bank_name: '',
      account_name: '',
      account_number: '',
      ifsc_code: '',
      branch: '',
      upi_id: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success && res.data.settings) {
          const s = res.data.settings;
          setSettings({
            company_name: s.company_name || 'NOVA INFOTECH',
            tagline: s.tagline || 'Certified Enterprise Hardware, Corporate Fleet Rentals & ITAD Solutions',
            phone: s.phone || '+91 98765 43210',
            whatsapp: s.whatsapp || '+91 98765 43210',
            email: s.email || 'procurement@novainfotech.in',
            address: s.address || 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR',
            google_maps_embed_url: s.google_maps_embed_url || '',
            logo_url: s.logo_url || '',
            gst_number: s.gst_number || '07AAACN8412K1Z9',
            invoice_prefix: s.invoice_prefix || 'INV',
            business_hours: s.business_hours || 'Monday – Saturday: 9:30 AM – 7:30 PM IST',
            warehouse_locations: s.warehouse_locations || 'Electronic City Phase 1, Bangalore · Okhla Industrial Area, Delhi NCR · Mumbai, India',
            support_sla: s.support_sla || 'Standard 24–48h Hardware Standby Replacement SLA',
            signatory_name: s.signatory_name || 'Mohd Zaid',
            signatory_designation: s.signatory_designation || 'Authorized Commercial Signatory / General Manager',
            signature_url: s.signature_url || '',
            company_seal_url: s.company_seal_url || '',
            category_gst_rates: s.category_gst_rates && s.category_gst_rates.length > 0 ? s.category_gst_rates : DEFAULT_CATEGORY_GST_RATES,
            default_gst_rate: s.default_gst_rate || 18,
            bank_details: {
              bank_name: s.bank_details?.bank_name || 'HDFC Bank Ltd',
              account_name: s.bank_details?.account_name || 'Nova Infotech Solutions Pvt. Ltd.',
              account_number: s.bank_details?.account_number || '50200084920194',
              ifsc_code: s.bank_details?.ifsc_code || 'HDFC0000123',
              branch: s.bank_details?.branch || 'Okhla Industrial Area, New Delhi',
              upi_id: s.bank_details?.upi_id || 'novainfotech@hdfcbank'
            }
          });
        }
      } catch (err) {
        console.error('[Admin Settings Error]', err);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', settings);
      if (res.data.success) {
        await refreshSettings();
        toast.success('Settings saved! All changes are now live across the entire website.');
      }
    } catch (err) {
      console.error('[Admin Settings Update Error]', err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleGstRateChange = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...prev.category_gst_rates];
      updated[index] = {
        ...updated[index],
        [field]: field === 'gst_rate' ? Number(value) : value
      };
      return { ...prev, category_gst_rates: updated };
    });
  };

  const resetGstRatesToDefaults = () => {
    setSettings((prev) => ({
      ...prev,
      category_gst_rates: DEFAULT_CATEGORY_GST_RATES
    }));
    toast.success('Category GST rates reset to standard Indian accounting slabs.');
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-slate-400 flex flex-col items-center justify-center gap-2">
        <RefreshCw className="w-6 h-6 animate-spin text-[#D4A24C]" />
        <span>Loading enterprise governance settings...</span>
      </div>
    );
  }

  const tabs = [
    { id: 'branding', label: 'Company & Branding', icon: Building },
    { id: 'contact', label: 'Contact & WhatsApp', icon: Phone },
    { id: 'signatory', label: 'Manager Sign & Seal', icon: FileText },
    { id: 'gst', label: 'Category GST Rates', icon: Percent },
    { id: 'banking', label: 'Banking & Remittance', icon: CreditCard },
    { id: 'warehouse', label: 'Warehouse & Maps', icon: MapPin }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 text-xs">
      
      {/* ======================================================== */}
      {/* 1. HEADER & LIVE PROPAGATION BADGE                       */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — GLOBAL SYSTEM PREFERENCES
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Enterprise Site & Governance Settings
          </h1>
          <p className="text-[#5A6B63] mt-1 text-xs">
            Manage corporate legal identity, manager signatures, category-wise GST compliance, communication channels, and logistics hubs. All updates propagate live across the storefront, invoices, and public desks.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D3B2A] hover:bg-[#124e38] text-[#FAF7F2] font-bold text-xs rounded-xl shadow border border-[#D4A24C]/40 transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24C]" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#D4A24C]" />
              <span>Save & Publish Live</span>
            </>
          )}
        </button>
      </div>

      {/* Global Propagation Alert */}
      <div className="p-3.5 bg-[#FAF7F2] border border-[#D4A24C]/35 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-[#0D3B2A] block font-bold text-xs">Live Multi-Surface Sync Active</strong>
            <span className="text-slate-600 text-[11px]">
              Settings saved here automatically update the <strong>Navbar, Footer, Contact Page, About Page, Invoice Generator, and WhatsApp links</strong> in real time.
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SECTION NAVIGATION TABS                               */}
      {/* ======================================================== */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#0D3B2A] text-[#FAF7F2] shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4A24C]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. SETTINGS CONTENT PANELS                               */}
      {/* ======================================================== */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* -------------------------------------------------------- */}
        {/* TAB 1: COMPANY & BRANDING                                */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'branding' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#0D3B2A] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#D4A24C]" />
                Company Identity & Commercial Branding
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Appears on Navbar, Footer & GST Invoices</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Entity Legal Name *</label>
                <input
                  type="text"
                  required
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  placeholder="e.g. Nova Infotech Solutions Pvt. Ltd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Tagline / Subtitle</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  placeholder="e.g. Certified Enterprise Hardware, Corporate Fleet Rentals & ITAD Solutions"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official GSTIN (Goods & Services Tax ID) *</label>
                <input
                  type="text"
                  required
                  value={settings.gst_number}
                  onChange={(e) => setSettings({ ...settings, gst_number: e.target.value.toUpperCase() })}
                  placeholder="e.g. 07AAACN8412K1Z9"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono font-bold text-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Number Prefix</label>
                <input
                  type="text"
                  value={settings.invoice_prefix}
                  onChange={(e) => setSettings({ ...settings, invoice_prefix: e.target.value.toUpperCase() })}
                  placeholder="e.g. INV or NOVA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Logo Image URL (Optional)</label>
                <input
                  type="text"
                  value={settings.logo_url}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../logo.png (Leave blank to use default Star Emblem)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  If left empty, the official Deep Emerald & Gold star emblem is automatically displayed.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 2: CONTACT & WHATSAPP                                */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'contact' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#0D3B2A] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4A24C]" />
                Direct Communication & WhatsApp Channels
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Powers Footer, Contact Page & Quote CTAs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Central Phone (B2B Desk) *</label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Direct WhatsApp Number *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                  />
                  {settings.whatsapp && (
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl font-bold flex items-center gap-1 shrink-0 transition"
                      title="Test WhatsApp Link"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Test</span>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Procurement / Billing Email *</label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="e.g. procurement@novainfotech.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Commercial Business Hours</label>
                <input
                  type="text"
                  value={settings.business_hours}
                  onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                  placeholder="e.g. Monday – Saturday: 9:30 AM – 7:30 PM IST"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Hardware Standby SLA Guarantee Text</label>
                <input
                  type="text"
                  value={settings.support_sla}
                  onChange={(e) => setSettings({ ...settings, support_sla: e.target.value })}
                  placeholder="e.g. Guaranteed 24–48h Hardware Standby Replacement SLA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 3: MANAGER SIGN & SEAL ("Manager ke Sign")           */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'signatory' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#0D3B2A] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D4A24C]" />
                  Authorized Signatory & Manager Signature ("Manager ke Sign")
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Appears at the bottom of all B2B GST Invoices, Proformas, and Corporate Rental Agreements.
                </p>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                GST Tax Invoice Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Authorized Signatory Name *</label>
                <input
                  type="text"
                  required
                  value={settings.signatory_name}
                  onChange={(e) => setSettings({ ...settings, signatory_name: e.target.value })}
                  placeholder="e.g. Mohd Zaid"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Signatory Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={settings.signatory_designation}
                  onChange={(e) => setSettings({ ...settings, signatory_designation: e.target.value })}
                  placeholder="e.g. General Manager / Authorized Commercial Signatory"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Manager Signature Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={settings.signature_url}
                  onChange={(e) => setSettings({ ...settings, signature_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../signature.png"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Paste transparent PNG signature URL. If left empty, an elegant digital cursive e-signature of the manager name is rendered.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company Rubber Seal / Stamp Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={settings.company_seal_url}
                  onChange={(e) => setSettings({ ...settings, company_seal_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../stamp.png"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Optional company seal graphic. If empty, the official digital security seal badge is stamped.
                </span>
              </div>
            </div>

            {/* LIVE INVOICE SIGNATURE PREVIEW */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold mb-2">
                Live Tax Invoice Signatory Preview:
              </span>
              <div className="max-w-md ml-auto border border-slate-300 rounded-2xl p-4 bg-white shadow-xs text-right space-y-2">
                <span className="text-[10px] font-bold text-slate-700 block">
                  For {settings.company_name?.toUpperCase() || 'NOVA INFOTECH SOLUTIONS PVT. LTD.'}
                </span>

                <div className="py-2 flex items-center justify-end gap-3 min-h-[50px]">
                  {/* Seal */}
                  {settings.company_seal_url ? (
                    <img src={settings.company_seal_url} alt="Company Seal" className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="border border-dashed border-[#D4A24C] text-[#8A5E12] rounded-lg px-2 py-0.5 text-[8.5px] font-mono font-bold tracking-wider inline-flex items-center gap-1 rotate-[-2deg] bg-[#FAF7F2]">
                      <CheckCircle2 className="w-3 h-3 text-[#0D3B2A]" />
                      <span>DIGITALLY VERIFIED</span>
                    </div>
                  )}

                  {/* Signature */}
                  {settings.signature_url ? (
                    <img src={settings.signature_url} alt="Signature" className="h-10 max-w-[130px] object-contain" />
                  ) : (
                    <div className="font-serif italic font-bold text-base text-[#0D3B2A] tracking-wider pr-1">
                      {settings.signatory_name || 'Mohd Zaid'}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-1">
                  <strong className="text-[11px] font-bold text-slate-900 block">
                    {settings.signatory_name || 'Mohd Zaid'}
                  </strong>
                  <span className="text-[9.5px] text-[#8A5E12] block font-semibold">
                    {settings.signatory_designation || 'Authorized Commercial Signatory / General Manager'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 4: CATEGORY GST RATES ("GST Rate according to Cat")   */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'gst' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#0D3B2A] flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#D4A24C]" />
                  Category-Wise GST Tax Slabs & HSN / SAC Codes
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure Indian GST tax slabs and official Harmonized System Nomenclature (HSN / SAC) per product category.
                </p>
              </div>

              <button
                type="button"
                onClick={resetGstRatesToDefaults}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer self-start sm:self-auto"
              >
                Reset to Standard Indian GST Slabs
              </button>
            </div>

            {/* Default Global GST */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <strong className="text-slate-900 block text-xs">Standard Default Hardware GST Rate</strong>
                <span className="text-slate-500 text-[11px]">Applied when no category-specific override is found</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={settings.default_gst_rate}
                  onChange={(e) => setSettings({ ...settings, default_gst_rate: Number(e.target.value) })}
                  className="w-16 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold text-xs text-[#0D3B2A]"
                />
                <span className="font-bold text-slate-600">%</span>
              </div>
            </div>

            {/* Category Rates Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#0D3B2A] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3.5 font-bold">Category</th>
                    <th className="py-2.5 px-3.5 font-bold">HSN / SAC Code</th>
                    <th className="py-2.5 px-3.5 font-bold text-center">GST Rate (%)</th>
                    <th className="py-2.5 px-3.5 font-bold">Tax Slab Breakdown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settings.category_gst_rates.map((cat, idx) => (
                    <tr key={cat.category_key} className="hover:bg-slate-50/70 transition">
                      
                      {/* Category Name */}
                      <td className="py-2.5 px-3.5">
                        <strong className="text-slate-900 block">{cat.category_name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{cat.category_key}</span>
                      </td>

                      {/* HSN Code Input */}
                      <td className="py-2.5 px-3.5">
                        <input
                          type="text"
                          value={cat.hsn_sac}
                          onChange={(e) => handleGstRateChange(idx, 'hsn_sac', e.target.value)}
                          placeholder="e.g. 8471 30 10"
                          className="w-32 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-[#0D3B2A]"
                        />
                      </td>

                      {/* GST Rate Input */}
                      <td className="py-2.5 px-3.5 text-center">
                        <div className="inline-flex items-center gap-1">
                          <select
                            value={cat.gst_rate}
                            onChange={(e) => handleGstRateChange(idx, 'gst_rate', e.target.value)}
                            className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-xs text-[#0D3B2A] cursor-pointer"
                          >
                            <option value={0}>0% (Exempt)</option>
                            <option value={5}>5% (E-Waste / Scrap)</option>
                            <option value={12}>12% (Concessional)</option>
                            <option value={18}>18% (Standard Hardware)</option>
                            <option value={28}>28% (Specialized Display)</option>
                          </select>
                        </div>
                      </td>

                      {/* Tax Breakdown Preview */}
                      <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px]">
                        CGST {cat.gst_rate / 2}% + SGST {cat.gst_rate / 2}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 5: BANKING & REMITTANCE                              */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'banking' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#0D3B2A] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#D4A24C]" />
                  Corporate Bank Account & RTGS / NEFT Remittance Details
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Printed directly on Proforma & Tax Invoices for corporate client wire payments.
                </p>
              </div>
              <span className="text-[10px] text-[#8A5E12] bg-[#FAF7F2] border border-[#D4A24C]/40 px-2 py-0.5 rounded-full font-bold">
                Printed on B2B Bills
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  value={settings.bank_details?.bank_name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, bank_name: e.target.value }
                    })
                  }
                  placeholder="e.g. HDFC Bank Ltd"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Beneficiary Account Name *</label>
                <input
                  type="text"
                  required
                  value={settings.bank_details?.account_name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, account_name: e.target.value }
                    })
                  }
                  placeholder="e.g. Nova Infotech Solutions Pvt. Ltd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Current Account Number *</label>
                <input
                  type="text"
                  required
                  value={settings.bank_details?.account_number}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, account_number: e.target.value }
                    })
                  }
                  placeholder="e.g. 50200084920194"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono font-bold text-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank IFSC Code *</label>
                <input
                  type="text"
                  required
                  value={settings.bank_details?.ifsc_code}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, ifsc_code: e.target.value.toUpperCase() }
                    })
                  }
                  placeholder="e.g. HDFC0000123"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch Location</label>
                <input
                  type="text"
                  value={settings.bank_details?.branch}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, branch: e.target.value }
                    })
                  }
                  placeholder="e.g. Okhla Industrial Area Phase III, New Delhi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official UPI ID</label>
                <input
                  type="text"
                  value={settings.bank_details?.upi_id}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, upi_id: e.target.value }
                    })
                  }
                  placeholder="e.g. novainfotech@hdfcbank"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 6: WAREHOUSE & GOOGLE MAPS EMBED                     */}
        {/* -------------------------------------------------------- */}
        {activeTab === 'warehouse' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#0D3B2A] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4A24C]" />
                  Warehouse Facility & Google Maps Embed
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Appears in Contact Us, Pan-India Dispatch Policy, and Footer Operations Hubs.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Registered Facility Address *</label>
                <textarea
                  rows={2}
                  required
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="e.g. Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore, India"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Multi-City Operations Hubs (Footer)</label>
                <input
                  type="text"
                  value={settings.warehouse_locations}
                  onChange={(e) => setSettings({ ...settings, warehouse_locations: e.target.value })}
                  placeholder="e.g. Electronic City Phase 1, Bangalore · Okhla Industrial Area, Delhi NCR · Mumbai, India"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Google Maps Embed URL *</label>
                <input
                  type="text"
                  required
                  value={settings.google_maps_embed_url}
                  onChange={(e) => setSettings({ ...settings, google_maps_embed_url: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Paste the "src" URL from Google Maps Share &gt; Embed a map iframe.
                </span>
              </div>

              {/* LIVE MAP PREVIEW */}
              {settings.google_maps_embed_url && (
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-semibold mb-2">
                    Live Google Maps Embed Preview:
                  </span>
                  <div className="w-full h-52 rounded-2xl overflow-hidden border border-slate-300 shadow-xs">
                    <iframe
                      title="Warehouse Facility Map Preview"
                      src={settings.google_maps_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Save Button at Bottom */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0D3B2A] hover:bg-[#124e38] text-[#FAF7F2] font-bold text-xs rounded-xl shadow border border-[#D4A24C]/40 transition cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4A24C]" />
                <span>Publishing Updates...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#D4A24C]" />
                <span>Save All Enterprise Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
