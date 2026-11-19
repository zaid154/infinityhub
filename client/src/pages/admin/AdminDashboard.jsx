import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Repeat,
  FileText,
  Users,
  Recycle,
  ArrowRight,
  TrendingUp,
  Clock,
  MessageSquare,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Phone,
  ArrowUpRight,
  Sparkles,
  Layers,
  MapPin,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchAnalytics = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentInquiries(res.data.recentInquiries || []);
        setRecentOrders(res.data.recentOrders || []);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('[Admin Analytics Error]', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Helper for company initial monogram
  const getInitials = (name) => {
    if (!name) return 'EP';
    return name
      .replace(/\[TEST-AUDIT\]/gi, '')
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'EP';
  };

  // Helper to format clean company title
  const cleanCompanyName = (name) => {
    if (!name) return 'Corporate Enterprise';
    return name.replace(/\[TEST-AUDIT\]/gi, '').trim() || name;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-2 border-[#0D3B2A] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading enterprise operational telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Enterprise Fleet Telemetry</span>
            <span className="text-emerald-300">•</span>
            <span className="text-emerald-700 font-mono text-[10px]">
              Live Sync: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Executive Fleet Operations
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Centralized operations desk for enterprise hardware inventory, active lease fleets, corporate RFQ inquiries, and commercial purchase orders.
          </p>
        </div>

        {/* Action Button Suite */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            title="Refresh telemetry"
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#0D3B2A]' : ''}`} />
          </button>

          <Link
            to="/products"
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
          >
            <span>Live Catalog</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white text-xs font-bold transition shadow-sm hover:shadow flex items-center gap-2 border border-[#D4A24C]/40 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#D4A24C]" />
            <span>Add Hardware Item</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (4 Tailored Enterprise Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Operational Hardware Inventory */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:border-slate-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                Operational Inventory
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Package className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans tabular-nums">
                {stats?.totalProducts || 0}
              </span>
              <span className="text-xs font-semibold text-slate-500">Catalog SKUs</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 font-medium text-slate-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sale: <strong className="text-slate-900 font-mono">{stats?.totalSaleStock ?? (stats?.totalProducts || 0)}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Rental: <strong className="text-slate-900 font-mono">{stats?.totalRentalStock ?? 0}</strong>
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-mono">
              Ready
            </span>
          </div>
        </div>

        {/* Card 2: Pending Corporate RFQs / Leads */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:border-slate-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                Commercial RFQs
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans tabular-nums">
                {stats?.newInquiries || 0}
              </span>
              <span className="text-xs font-semibold text-slate-500">Pending Quotes</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">High-value enterprise leads</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-mono">
              Action Req.
            </span>
          </div>
        </div>

        {/* Card 3: Active Corporate Fleets */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:border-slate-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0D3B2A] to-emerald-700" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                Active Fleet Leases
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0D3B2A]">
                <Repeat className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans tabular-nums">
                {stats?.activeRentals || 0}
              </span>
              <span className="text-xs font-semibold text-slate-500">Corporate Fleets</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">Active client deployments</span>
            <span className="text-[10px] font-bold text-[#0D3B2A] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#D4A24C]/40 font-mono">
              100% On-Time
            </span>
          </div>
        </div>

        {/* Card 4: Gross Processed Billings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:border-slate-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A24C] to-amber-600" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                Gross Processed Billings
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans tabular-nums">
                ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">Invoiced POs & monthly leases</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-mono">
              18% GST
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Operational Telemetry Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8A5E12]" />
            <span className="text-slate-600 font-medium">Registered Enterprise Clients:</span>
            <strong className="text-slate-900 font-mono text-sm">{stats?.totalCustomers || 0}</strong>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#0D3B2A]" />
            <span className="text-slate-600 font-medium">Total Lifetime Orders:</span>
            <strong className="text-slate-900 font-mono text-sm">{stats?.totalOrders || 0}</strong>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-600 font-medium">Asset Buyback (ITAD) Submissions:</span>
            <strong className="text-slate-900 font-mono text-sm">{stats?.pendingBuybacks || 0}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <Link
            to="/admin/customers"
            className="text-slate-600 hover:text-[#0D3B2A] transition flex items-center gap-1"
          >
            <span>Customer Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            to="/admin/buyback"
            className="text-slate-600 hover:text-[#0D3B2A] transition flex items-center gap-1"
          >
            <span>ITAD Buybacks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Split Workspaces: Corporate RFQ Inquiries & Recent Invoiced Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Corporate RFQs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8A5E12]" />
                Recent Corporate RFQs & Quotes
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Review pending hardware requirements from corporate clients
              </p>
            </div>
            <Link
              to="/admin/inquiries"
              className="text-xs font-bold text-[#8A5E12] hover:text-[#0D3B2A] transition flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-slate-50/50 border border-dashed border-slate-200 text-xs text-slate-400">
              No recent inquiries logged in queue.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentInquiries.map((inq) => {
                const isNew = inq.status === 'new';
                const initials = getInitials(inq.company_name);
                const cleanName = cleanCompanyName(inq.company_name);
                const rawPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';

                return (
                  <div
                    key={inq._id}
                    className="p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 truncate">{cleanName}</h4>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono border ${
                              isNew
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <p
                          className="text-[11px] text-slate-500 truncate mt-0.5"
                          title={`${inq.contact_person || ''} • ${inq.phone || ''} • ${inq.quantity || ''} ${inq.requirement ? '— ' + inq.requirement : ''}`}
                        >
                          {inq.contact_person} • {inq.phone} •{' '}
                          <span className="font-mono font-semibold text-slate-700" title={inq.quantity}>{inq.quantity}</span>
                          {inq.requirement && (
                            <span className="text-slate-400 font-sans ml-1 truncate" title={inq.requirement}>
                              ({inq.requirement})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rawPhone && (
                        <a
                          href={`https://wa.me/${rawPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/70 font-semibold text-[11px] transition flex items-center gap-1.5"
                          title="Instant WhatsApp Dispatch"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      )}
                      <Link
                        to="/admin/inquiries"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="View RFQ Inquiries"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Invoiced Orders */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0D3B2A]" />
                Recent Purchase Orders & Invoices
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Track direct corporate sales and payment fulfillments
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#8A5E12] hover:text-[#0D3B2A] transition flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-slate-50/50 border border-dashed border-slate-200 text-xs text-slate-400">
              No recent purchase orders logged yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((o) => {
                const clientName = o.shipping_address?.company_name || o.user?.company_name || o.user?.name || 'Corporate Signatory';
                const cleanClient = cleanCompanyName(clientName);
                const isPaid = o.payment_status === 'paid';

                return (
                  <div
                    key={o._id}
                    className="p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                        PO
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">{o.invoice_number}</span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono border ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {o.payment_status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {cleanClient} • <strong className="font-mono text-slate-800">₹{o.grand_total.toLocaleString('en-IN')}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono capitalize">
                        {o.order_status || 'placed'}
                      </span>
                      <Link
                        to="/admin/orders"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="Manage Order"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Enterprise Executive Navigation Tiles (4 Quick Command Hubs) */}
      <div className="pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans mb-3">
          Executive Operations Quick Launch
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/products"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0D3B2A] transition shadow-sm hover:shadow group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0D3B2A] flex items-center justify-center mb-2.5">
              <Package className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D3B2A] transition flex items-center justify-between">
              <span>Catalog Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Manage specs, stock segregation, and prices.
            </p>
          </Link>

          <Link
            to="/admin/inquiries"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0D3B2A] transition shadow-sm hover:shadow group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5">
              <FileText className="w-4 h-4 text-amber-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D3B2A] transition flex items-center justify-between">
              <span>RFQ Quotations</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Review corporate leads and send pricing.
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0D3B2A] transition shadow-sm hover:shadow group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2.5">
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D3B2A] transition flex items-center justify-between">
              <span>Orders & Invoicing</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Generate GST invoices and track dispatches.
            </p>
          </Link>

          <Link
            to="/admin/rentals"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0D3B2A] transition shadow-sm hover:shadow group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#0D3B2A] flex items-center justify-center mb-2.5">
              <Repeat className="w-4 h-4 text-[#0D3B2A]" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0D3B2A] transition flex items-center justify-between">
              <span>Rental Fleets</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Track leases, renewals, and returned units.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
