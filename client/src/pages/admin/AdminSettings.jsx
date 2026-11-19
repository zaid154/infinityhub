import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  History,
  Lock,
  Scale
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useCompany } from '../../context/SettingsContext';
import BrandLogo from '../../components/BrandLogo';

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
  const { refreshSettings } = useCompany();
  const [activeTab, setActiveTab] = useState('branding'); // branding | legal | contact | grievance | gst | banking | audit
  const [showLivePreview, setShowLivePreview] = useState(true);

  const [settings, setSettings] = useState({
    brand_name: '',
    brand_name_short: '',
    company_name: '',
    tagline: '',
    tm_symbol: 'TM',
    is_tm_registered_confirmed: false,
    logo_url: '',
    favicon_url: '',
    website_url: '',

    // Legal Registrations
    legal_name: '',
    cin_number: '',
    gst_number: '',
    registered_address: '',
    operations_address: '',
    address: '',
    jurisdiction_city: 'New Delhi',
    iso_cert_number: '',
    epr_registration_number: '',

    // Contact & Hours
    phone: '',
    whatsapp: '',
    email: '',
    support_email: '',
    procurement_email: '',
    business_hours: '',
    warehouse_locations: '',
    support_sla: '',
    google_maps_embed_url: '',

    // Grievance Officer
    grievance_officer: {
      name: '',
      designation: '',
      email: '',
      phone: '',
      address: ''
    },

    third_party_disclaimer: '',

    // Signatory
    signatory_name: '',
    signatory_designation: '',
    signature_url: '',
    company_seal_url: '',

    // Tax & Invoicing
    invoice_prefix: 'INV',
    default_gst_rate: 18,
    category_gst_rates: DEFAULT_CATEGORY_GST_RATES,

    // Bank Account
    bank_details: {
      bank_name: '',
      account_name: '',
      account_number: '',
      ifsc_code: '',
      branch: '',
      upi_id: ''
    },

    legal_version: '1.0',
    settings_version: 1
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reverting, setReverting] = useState(false);

  // Load current settings & audit history from server
  const loadServerSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data?.success && res.data?.settings) {
        const s = res.data.settings;
        setSettings({
          brand_name: s.brand_name || s.company_name || 'Demo Infotech',
          brand_name_short: s.brand_name_short || 'Demo',
          company_name: s.company_name || s.brand_name || 'Demo Infotech',
          tagline: s.tagline || 'Enterprise Hardware Solutions, Flexible Corporate Rentals & ITAD Lifecycle Management',
          tm_symbol: s.tm_symbol || 'TM',
          is_tm_registered_confirmed: Boolean(s.is_tm_registered_confirmed),
          logo_url: s.logo_url || '',
          favicon_url: s.favicon_url || '',
          website_url: s.website_url || 'http://localhost:5173',

          legal_name: s.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]',
          cin_number: s.cin_number || 'U72900DL2024PTC000000 [PLACEHOLDER]',
          gst_number: s.gst_number || '07AAAAA0000A1Z5 [PLACEHOLDER]',
          registered_address: s.registered_address || s.address || 'Unit No. 101, Commercial Tower, Barakhamba Road, Connaught Place, New Delhi 110001 [PLACEHOLDER]',
          operations_address: s.operations_address || s.address || 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore [PLACEHOLDER]',
          address: s.address || s.operations_address || 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR · Bangalore [PLACEHOLDER]',
          jurisdiction_city: s.jurisdiction_city || 'New Delhi',
          iso_cert_number: s.iso_cert_number || '',
          epr_registration_number: s.epr_registration_number || 'CPCB/EPR/2024/000000 [PLACEHOLDER]',

          phone: s.phone || '+91 XXXXX XXXXX [PLACEHOLDER]',
          whatsapp: s.whatsapp || '+91 XXXXX XXXXX [PLACEHOLDER]',
          email: s.email || 'procurement@example.com [PLACEHOLDER]',
          support_email: s.support_email || 'support@example.com [PLACEHOLDER]',
          procurement_email: s.procurement_email || 'procurement@example.com [PLACEHOLDER]',
          business_hours: s.business_hours || 'Monday – Saturday: 9:30 AM – 7:30 PM IST',
          warehouse_locations: s.warehouse_locations || 'Electronic City Phase 1, Bangalore · Okhla Industrial Area, Delhi NCR · Mumbai, India',
          support_sla: s.support_sla || '24–48h Hardware Standby Replacement SLA (Subject to SLA Terms)',
          google_maps_embed_url: s.google_maps_embed_url || '',

          grievance_officer: {
            name: s.grievance_officer?.name || 'Statutory Grievance Officer [PLACEHOLDER]',
            designation: s.grievance_officer?.designation || 'Head of Legal & Enterprise Compliance',
            email: s.grievance_officer?.email || 'grievance@example.com [PLACEHOLDER]',
            phone: s.grievance_officer?.phone || '+91 XXXXX XXXXX [PLACEHOLDER]',
            address: s.grievance_officer?.address || s.registered_address || 'Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001 [PLACEHOLDER]'
          },

          third_party_disclaimer: s.third_party_disclaimer || '',

          signatory_name: s.signatory_name || 'Authorized Signatory [PLACEHOLDER]',
          signatory_designation: s.signatory_designation || 'Authorized Commercial Signatory / General Manager',
          signature_url: s.signature_url || '',
          company_seal_url: s.company_seal_url || '',

          invoice_prefix: s.invoice_prefix || 'INV',
          default_gst_rate: s.default_gst_rate || 18,
          category_gst_rates: s.category_gst_rates && s.category_gst_rates.length > 0 ? s.category_gst_rates : DEFAULT_CATEGORY_GST_RATES,

          bank_details: {
            bank_name: s.bank_details?.bank_name || 'HDFC Bank Ltd',
            account_name: s.bank_details?.account_name || 'Demo Infotech Private Limited [PLACEHOLDER]',
            account_number: s.bank_details?.account_number || '50200000000000',
            ifsc_code: s.bank_details?.ifsc_code || 'HDFC0000000',
            branch: s.bank_details?.branch || 'Connaught Place / Electronic City',
            upi_id: s.bank_details?.upi_id || 'demoinfotech@hdfcbank'
          },

          legal_version: s.legal_version || '1.0',
          settings_version: s.settings_version || 1
        });

        if (res.data.auditLogs) {
          setAuditLogs(res.data.auditLogs);
        }
      }
    } catch (err) {
      console.error('[Admin Settings Error]', err);
      toast.error('Failed to load settings from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServerSettings();
  }, []);

  // Demo / Placeholder status detection
  const isDemoMode = useMemo(() => {
    if (!settings) return false;
    const checks = [
      settings.brand_name === 'Demo Infotech',
      settings.legal_name?.includes('[PLACEHOLDER]'),
      settings.gst_number?.includes('[PLACEHOLDER]'),
      settings.cin_number?.includes('[PLACEHOLDER]'),
      settings.phone?.includes('XXXXX'),
      settings.email?.includes('example.com')
    ];
    return checks.some(Boolean);
  }, [settings]);

  // Form Save
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Verification check for (R) registered mark
    if (settings.tm_symbol === 'R' && !settings.is_tm_registered_confirmed) {
      toast.error('Under Section 107 of the Trade Marks Act 1999, you must legally confirm registration before displaying the ® symbol.');
      setActiveTab('branding');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...settings,
        company_name: settings.brand_name || settings.company_name
      };

      const res = await api.put('/settings', payload);
      if (res.data?.success) {
        await refreshSettings();
        toast.success('Corporate identity saved! All changes are now live across the website without redeployment.');
        loadServerSettings();
      } else {
        toast.error(res.data?.message || 'Failed to save settings.');
      }
    } catch (err) {
      console.error('[Admin Settings Update Error]', err);
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // One-click Revert Handler
  const handleRevert = async (logId) => {
    if (!window.confirm('Are you sure you want to revert company settings to this previous snapshot? This action will immediately update all public pages.')) {
      return;
    }

    setReverting(true);
    try {
      const res = await api.post('/settings/revert', { log_id: logId });
      if (res.data?.success) {
        toast.success('Successfully reverted to previous snapshot!');
        await refreshSettings();
        loadServerSettings();
      } else {
        toast.error(res.data?.message || 'Revert failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revert snapshot.');
    } finally {
      setReverting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#0D3B2A] mx-auto" />
          <p className="text-xs text-[#5A6B63] font-semibold">Loading enterprise company configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D4A24C]/20">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — SINGLE SOURCE OF TRUTH (ZERO CODE CHANGES)
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Corporate Settings & Legal Governance
          </h1>
          <p className="text-xs text-[#5A6B63] mt-0.5">
            Configure dynamic brand wordmarks, statutory GSTIN/CIN credentials, grievance officer, and policy versions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="px-4 py-2 rounded-xl border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#8A5E12]" />
            <span>{showLivePreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer border border-[#D4A24C]/40"
          >
            <Save className="w-4 h-4 text-[#D4A24C]" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Warning Banner: Active Demo / Placeholder Mode */}
      {isDemoMode && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-sm animate-in fade-in duration-300">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold text-sm block">
              Demo / Specimen Mode Active
            </strong>
            <p className="leading-relaxed">
              The platform is currently rendering placeholder credentials (<strong>"{settings.brand_name}"</strong>, <strong>"{settings.legal_name}"</strong>, placeholder GSTIN/CIN, and placeholder grievance details). Enter your legitimate corporate registrations below and click <strong>"Save & Publish Live"</strong> before public launch.
            </p>
          </div>
        </div>
      )}

      {/* Live Preview Drawer (If Toggled) */}
      {showLivePreview && (
        <div className="p-5 bg-white rounded-3xl border border-[#D4A24C]/35 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#8A5E12] font-bold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Real-Time Public Header & Footer Simulation
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Updates live as you type</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Header Wordmark Preview */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Header Wordmark (Desktop)
              </span>
              <div className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-full bg-[#0D3B2A] border border-[#D4A24C]/70 flex items-center justify-center text-[#D4A24C] shadow-md font-serif font-bold text-sm">
                  {settings.brand_name ? settings.brand_name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div>
                  <div className="font-serif font-bold text-xl text-[#072117] flex items-center gap-1 leading-none">
                    <span>{(settings.brand_name || 'Demo Infotech').toUpperCase()}</span>
                    {settings.tm_symbol !== 'none' && (
                      <sup className="text-[10px] text-[#D4A24C]">
                        {settings.tm_symbol === 'R' ? '®' : '™'}
                      </sup>
                    )}
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#5A6B63] mt-0.5">
                    {settings.tagline || 'Enterprise Hardware Solutions'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Legal Block Preview */}
            <div className="p-4 rounded-2xl bg-[#072117] text-white border border-[#D4A24C]/30 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A24C] block font-mono">
                Footer Registration Block
              </span>
              <p className="font-bold text-[#FAF7F2] text-xs">
                {settings.legal_name || 'Demo Infotech Private Limited'}
              </p>
              <p className="text-[10px] text-[#90b09a] truncate">
                CIN: {settings.cin_number} • GSTIN: {settings.gst_number}
              </p>
              <p className="text-[10px] text-[#90b09a] truncate">
                Registered Office: {settings.registered_address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#D4A24C]/25 pb-3">
        {[
          { id: 'branding', label: '1. Brand Identity', icon: Building },
          { id: 'legal', label: '2. Legal & Registrations', icon: Scale },
          { id: 'contact', label: '3. Contact & Hours', icon: Phone },
          { id: 'grievance', label: '4. Grievance Officer', icon: ShieldCheck },
          { id: 'gst', label: '5. Category GST Rates', icon: Percent },
          { id: 'banking', label: '6. Banking & Signatory', icon: CreditCard },
          { id: 'audit', label: '7. Version History', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0D3B2A] text-white shadow-md'
                  : 'bg-white text-[#5A6B63] hover:text-[#0D3B2A] border border-[#D4A24C]/20'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-[#D4A24C]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Area */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#D4A24C]/30 p-7 sm:p-9 shadow-sm space-y-6">
        
        {/* TAB 1: BRAND IDENTITY */}
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0D3B2A]">
                Brand Identity & Public Wordmark
              </h2>
              <p className="text-xs text-[#5A6B63]">
                Changes here dynamically alter header logos, browser tab titles, and invoice headings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Brand Name (Customer Facing) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.brand_name}
                  onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                  placeholder="e.g. Apex Infra or Demo Infotech"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Brand Short Name (Monogram / Mobile)
                </label>
                <input
                  type="text"
                  value={settings.brand_name_short}
                  onChange={(e) => setSettings({ ...settings, brand_name_short: e.target.value })}
                  placeholder="e.g. Apex or Demo"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Brand Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  placeholder="e.g. Enterprise Hardware Solutions, Corporate Fleet Rentals & ITAD"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              {/* Trademark Symbol Selection (Legal Safe under Section 107 Trade Marks Act 1999) */}
              <div className="md:col-span-2 p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4A24C]/30 space-y-3">
                <label className="block font-bold text-[#0D3B2A]">
                  Trademark Symbol Affiliation (Trade Marks Act, 1999)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'none', label: 'None (Clean Name)', desc: 'No symbol displayed' },
                    { value: 'TM', label: '™ (Unregistered / Common Law)', desc: 'Claim of trademark use (Default)' },
                    { value: 'R', label: '® (Registered Trademark)', desc: 'Requires active CGPDTM registration' }
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                        settings.tm_symbol === opt.value
                          ? 'bg-[#0D3B2A] text-white border-[#D4A24C]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{opt.label}</span>
                        <input
                          type="radio"
                          name="tm_symbol"
                          value={opt.value}
                          checked={settings.tm_symbol === opt.value}
                          onChange={(e) => setSettings({ ...settings, tm_symbol: e.target.value })}
                          className="accent-[#D4A24C]"
                        />
                      </div>
                      <span className={`text-[10px] mt-1 ${settings.tm_symbol === opt.value ? 'text-slate-300' : 'text-slate-500'}`}>
                        {opt.desc}
                      </span>
                    </label>
                  ))}
                </div>

                {settings.tm_symbol === 'R' && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xl space-y-2 text-[11px] text-red-900 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Statutory Caution: Section 107 of the Trade Marks Act, 1999</span>
                    </div>
                    <p>
                      It is a punishable offense with imprisonment up to 3 years and/or fine to represent that a trademark is registered when it is not.
                    </p>
                    <label className="flex items-start gap-2 cursor-pointer font-semibold pt-1 text-red-950">
                      <input
                        type="checkbox"
                        checked={settings.is_tm_registered_confirmed}
                        onChange={(e) => setSettings({ ...settings, is_tm_registered_confirmed: e.target.checked })}
                        className="mt-0.5 w-4 h-4 accent-red-600 rounded"
                      />
                      <span>
                        I confirm this trademark is officially registered with the Controller General of Patents, Designs and Trade Marks (CGPDTM) and possess a valid Trademark Registration Certificate.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Custom Logo URL (Optional)</label>
                <input
                  type="url"
                  value={settings.logo_url}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or leave blank for gold serif monogram"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Production Website Domain</label>
                <input
                  type="url"
                  value={settings.website_url}
                  onChange={(e) => setSettings({ ...settings, website_url: e.target.value })}
                  placeholder="https://demoinfotech.in"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEGAL & REGISTRATIONS */}
        {activeTab === 'legal' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0D3B2A]">
                Statutory Corporate Registrations
              </h2>
              <p className="text-xs text-[#5A6B63]">
                Mandatory under the Consumer Protection (E-Commerce) Rules 2020 & Companies Act 2013.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Full Corporate Legal Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.legal_name}
                  onChange={(e) => setSettings({ ...settings, legal_name: e.target.value })}
                  placeholder="e.g. Demo Infotech Private Limited or Apex Solutions LLP"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Corporate Identification Number (CIN / LLPIN) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.cin_number}
                  onChange={(e) => setSettings({ ...settings, cin_number: e.target.value })}
                  placeholder="e.g. U72900DL2024PTC000000"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  GSTIN (15-Character Tax ID) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.gst_number}
                  onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Statutory Registered Office Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={settings.registered_address}
                  onChange={(e) => setSettings({ ...settings, registered_address: e.target.value })}
                  placeholder="As registered with Ministry of Corporate Affairs (MCA)..."
                  className="w-full p-3 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Central Operations / Warehouse Facility Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={settings.operations_address}
                  onChange={(e) => setSettings({ ...settings, operations_address: e.target.value, address: e.target.value })}
                  placeholder="Electronic City, Bangalore · Okhla, Delhi NCR..."
                  className="w-full p-3 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  Arbitration & Judicial Jurisdiction City *
                </label>
                <input
                  type="text"
                  required
                  value={settings.jurisdiction_city}
                  onChange={(e) => setSettings({ ...settings, jurisdiction_city: e.target.value })}
                  placeholder="e.g. New Delhi, Bengaluru, Mumbai"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  ISO 9001:2015 Certificate No. (Optional)
                </label>
                <input
                  type="text"
                  value={settings.iso_cert_number}
                  onChange={(e) => setSettings({ ...settings, iso_cert_number: e.target.value })}
                  placeholder="Leave empty unless certified under ISO 9001:2015"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-[#0D3B2A] mb-1">
                  CPCB E-Waste EPR Registration Number (Optional)
                </label>
                <input
                  type="text"
                  value={settings.epr_registration_number}
                  onChange={(e) => setSettings({ ...settings, epr_registration_number: e.target.value })}
                  placeholder="e.g. CPCB/EPR/2024/000000"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT & HOURS */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0D3B2A]">
                Corporate Communications & Operating Hours
              </h2>
              <p className="text-xs text-[#5A6B63]">
                Displayed in Contact Desk, Footer, and automated transaction advisories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Primary Calling Line *</label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+91 98100 00000"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">WhatsApp Procurement Desk *</label>
                <input
                  type="text"
                  required
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="+91 98100 00000"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Procurement Email *</label>
                <input
                  type="email"
                  required
                  value={settings.procurement_email}
                  onChange={(e) => setSettings({ ...settings, procurement_email: e.target.value, email: e.target.value })}
                  placeholder="procurement@company.com"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Support / SLA Email *</label>
                <input
                  type="email"
                  required
                  value={settings.support_email}
                  onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                  placeholder="support@company.com"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-[#0D3B2A] mb-1">Commercial Business Hours *</label>
                <input
                  type="text"
                  required
                  value={settings.business_hours}
                  onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                  placeholder="Monday – Saturday: 9:30 AM – 7:30 PM IST"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-[#0D3B2A] mb-1">Standby SLA Guarantee Text *</label>
                <input
                  type="text"
                  required
                  value={settings.support_sla}
                  onChange={(e) => setSettings({ ...settings, support_sla: e.target.value })}
                  placeholder="24–48h Hardware Standby Replacement SLA (Subject to SLA Terms)"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GRIEVANCE REDRESSAL OFFICER */}
        {activeTab === 'grievance' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0D3B2A]">
                Statutory Grievance Redressal Officer
              </h2>
              <p className="text-xs text-[#5A6B63]">
                Mandatory under Rule 3(2) of IT Rules 2021 & Section 13 of DPDP Act 2023. Turnaround: 24h ack · 30-day resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Officer Name *</label>
                <input
                  type="text"
                  required
                  value={settings.grievance_officer?.name || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      grievance_officer: { ...settings.grievance_officer, name: e.target.value }
                    })
                  }
                  placeholder="e.g. Adv. Amit Singhal"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  value={settings.grievance_officer?.designation || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      grievance_officer: { ...settings.grievance_officer, designation: e.target.value }
                    })
                  }
                  placeholder="Head of Legal & Enterprise Compliance"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Statutory Email *</label>
                <input
                  type="email"
                  required
                  value={settings.grievance_officer?.email || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      grievance_officer: { ...settings.grievance_officer, email: e.target.value }
                    })
                  }
                  placeholder="grievance@company.com"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Calling Line *</label>
                <input
                  type="text"
                  required
                  value={settings.grievance_officer?.phone || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      grievance_officer: { ...settings.grievance_officer, phone: e.target.value }
                    })
                  }
                  placeholder="+91 98100 00000"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-[#0D3B2A] mb-1">Legal Redressal Cell Address *</label>
                <textarea
                  rows={2}
                  required
                  value={settings.grievance_officer?.address || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      grievance_officer: { ...settings.grievance_officer, address: e.target.value }
                    })
                  }
                  placeholder="Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001..."
                  className="w-full p-3 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORY GST RATES */}
        {activeTab === 'gst' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0D3B2A]">
                Category-Wise GST & HSN Architecture
              </h2>
              <p className="text-xs text-[#5A6B63]">
                Official HSN/SAC codes and tax percentages applied automatically to invoices and proforma quotes.
              </p>
            </div>

            <div className="overflow-x-auto border border-[#D4A24C]/25 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#072117] text-[#FAF7F2] font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">HSN / SAC Code</th>
                    <th className="p-3">GST Rate (%)</th>
                    <th className="p-3">Statutory Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {settings.category_gst_rates.map((rate, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-bold text-[#0D3B2A]">{rate.category_name}</td>
                      <td className="p-3 font-mono">
                        <input
                          type="text"
                          value={rate.hsn_sac}
                          onChange={(e) => {
                            const updated = [...settings.category_gst_rates];
                            updated[idx].hsn_sac = e.target.value;
                            setSettings({ ...settings, category_gst_rates: updated });
                          }}
                          className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs w-28"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={rate.gst_rate}
                          onChange={(e) => {
                            const updated = [...settings.category_gst_rates];
                            updated[idx].gst_rate = Number(e.target.value);
                            setSettings({ ...settings, category_gst_rates: updated });
                          }}
                          className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs w-16"
                        />
                        <span className="ml-1 text-slate-500">%</span>
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">{rate.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: BANKING & SIGNATORY */}
        {activeTab === 'banking' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0D3B2A]">
                Authorized Signatory & Bank Wire Remittance
              </h2>
              <p className="text-xs text-[#5A6B63]">
                Printed on formal Tax Invoices, quotation PDFs, and B2B wire remittance instructions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Authorized Commercial Signatory *</label>
                <input
                  type="text"
                  required
                  value={settings.signatory_name}
                  onChange={(e) => setSettings({ ...settings, signatory_name: e.target.value })}
                  placeholder="e.g. Vikramaditya Menta"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Signatory Designation *</label>
                <input
                  type="text"
                  required
                  value={settings.signatory_designation}
                  onChange={(e) => setSettings({ ...settings, signatory_designation: e.target.value })}
                  placeholder="Authorized Commercial Signatory / General Manager"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Bank Name</label>
                <input
                  type="text"
                  value={settings.bank_details.bank_name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, bank_name: e.target.value }
                    })
                  }
                  placeholder="e.g. HDFC Bank Ltd"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Beneficiary Account Name</label>
                <input
                  type="text"
                  value={settings.bank_details.account_name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, account_name: e.target.value }
                    })
                  }
                  placeholder="e.g. Demo Infotech Private Limited"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Current Account Number</label>
                <input
                  type="text"
                  value={settings.bank_details.account_number}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, account_number: e.target.value }
                    })
                  }
                  placeholder="50200000000000"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={settings.bank_details.ifsc_code}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bank_details: { ...settings.bank_details, ifsc_code: e.target.value }
                    })
                  }
                  placeholder="HDFC0000000"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOG & ONE-CLICK REVERT */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#0D3B2A]">
                  Settings Audit Log & Version History
                </h2>
                <p className="text-xs text-[#5A6B63]">
                  Immutable change ledger tracking administrator identity, timestamp, and one-click rollback snapshots.
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="font-bold text-[#0D3B2A]">Current Version: v{settings.settings_version || 1}</span>
              </div>
            </div>

            {auditLogs && auditLogs.length > 0 ? (
              <div className="overflow-x-auto border border-[#D4A24C]/25 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#072117] text-[#FAF7F2] font-mono uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Modified By</th>
                      <th className="p-3">Changed Fields</th>
                      <th className="p-3 text-right">Rollback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {auditLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-[#FAF7F2]">
                        <td className="p-3 font-mono text-[11px] text-slate-600">
                          {new Date(log.createdAt).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-[#0D3B2A]">
                          {log.changed_by_name || 'Admin'}
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[10.5px]">
                          {log.changed_fields && log.changed_fields.length > 0
                            ? log.changed_fields.join(', ')
                            : 'Full Sync'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            disabled={reverting}
                            onClick={() => handleRevert(log._id)}
                            className="px-3 py-1 rounded-lg bg-white border border-[#D4A24C]/40 hover:bg-[#FAF7F2] text-[#0D3B2A] font-bold text-[11px] flex items-center gap-1 ml-auto cursor-pointer transition active:scale-95 disabled:opacity-50"
                          >
                            <RotateCcw className="w-3 h-3 text-[#8A5E12]" />
                            <span>Revert Here</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                Initial baseline snapshot active. Future settings modifications will generate granular change diffs here.
              </div>
            )}
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-6 border-t border-[#D4A24C]/20 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Changes propagate dynamically to public components via cached endpoint (60s TTL).
          </span>

          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer border border-[#D4A24C]/40"
          >
            <Save className="w-4 h-4 text-[#D4A24C]" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
