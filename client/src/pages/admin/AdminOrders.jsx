import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  X,
  Printer,
  ExternalLink,
  Building2,
  Phone,
  Mail,
  Copy,
  Save,
  RefreshCw,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  FileText,
  MapPin,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import InvoiceModal from '../../components/InvoiceModal';
import { getSafeImageUrl } from '../../utils/imageHelper';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fulfillment Slide-Over Drawer State
  const [drawerOrder, setDrawerOrder] = useState(null);
  const [drawerDispatchStatus, setDrawerDispatchStatus] = useState('placed');
  const [drawerPaymentStatus, setDrawerPaymentStatus] = useState('pending');
  const [drawerCourier, setDrawerCourier] = useState('');
  const [drawerTracking, setDrawerTracking] = useState('');
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerSaving, setDrawerSaving] = useState(false);

  // Invoice Modal State
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error('[Admin fetch orders error]', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Quick Inline Status Update (Instant DB write + Optimistic UI update)
  const handleQuickStatusUpdate = async (orderId, updates) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...updates } : o))
      );
      if (drawerOrder && drawerOrder._id === orderId) {
        setDrawerOrder((prev) => ({ ...prev, ...updates }));
      }

      const res = await api.put(`/orders/${orderId}/status`, updates);
      if (res.data.success) {
        toast.success(res.data.message || 'Status updated');
        if (res.data.order) {
          setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? res.data.order : o))
          );
        }
      }
    } catch (err) {
      console.error('[Quick status update failed]', err);
      toast.error('Failed to update status');
      fetchOrders();
    }
  };

  // Open Executive Slide-Over Drawer
  const openDrawer = (order) => {
    setDrawerOrder(order);
    setDrawerDispatchStatus(order.order_status || 'placed');
    setDrawerPaymentStatus(order.payment_status || 'pending');
    setDrawerCourier(order.courier_name || '');
    setDrawerTracking(order.tracking_number || '');
    setDrawerNotes(order.admin_notes || '');
  };

  // Save changes from inside Drawer
  const handleSaveDrawer = async () => {
    if (!drawerOrder) return;
    setDrawerSaving(true);
    try {
      const payload = {
        order_status: drawerDispatchStatus,
        payment_status: drawerPaymentStatus,
        courier_name: drawerCourier,
        tracking_number: drawerTracking,
        admin_notes: drawerNotes
      };
      const res = await api.put(`/orders/${drawerOrder._id}/status`, payload);
      if (res.data.success) {
        toast.success('Fulfillment dossier saved');
        const updated = res.data.order;
        setOrders((prev) =>
          prev.map((o) => (o._id === drawerOrder._id ? updated : o))
        );
        setDrawerOrder(updated);
      }
    } catch (err) {
      console.error('[Save drawer error]', err);
      toast.error('Failed to save fulfillment details');
    } finally {
      setDrawerSaving(false);
    }
  };

  // Pre-fill WhatsApp Dispatch Notification
  const handleSendWhatsAppUpdate = (order) => {
    const phone = order.shipping_address?.phone || order.user?.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const company = order.shipping_address?.company_name || order.user?.company_name || 'Client';
    const courier = drawerCourier || order.courier_name || 'Central Operations Dispatch';
    const tracking = drawerTracking || order.tracking_number || 'In-House Courier Handover';

    const msg =
      `*NOVA INFOTECH | DISPATCH ADVICE*\n\n` +
      `Dear ${company},\n` +
      `Your enterprise hardware order *${order.invoice_number}* status is updated:\n\n` +
      `• *Carrier Partner:* ${courier}\n` +
      `• *Consignment / AWB:* ${tracking}\n` +
      `• *Dispatch Status:* ${(drawerDispatchStatus || order.order_status).toUpperCase()}\n` +
      `• *Hardware Items:* ${order.items?.length || 1} item(s)\n` +
      `• *Total Value:* ₹${(order.grand_total || 0).toLocaleString('en-IN')}\n\n` +
      `For tracking support, contact our Central Operations Desk at +91 98765 43210.\n` +
      `Official Proforma / Tax Invoice is available on your corporate dashboard.`;

    const dest = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${dest}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Copy helper
  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Status Filter
      if (statusFilter === 'pending_payment') {
        if (o.payment_status === 'paid') return false;
      } else if (statusFilter !== 'all') {
        if (o.order_status !== statusFilter) return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inv = (o.invoice_number || '').toLowerCase();
        const comp = (o.shipping_address?.company_name || o.user?.company_name || '').toLowerCase();
        const contact = (o.shipping_address?.contact_person || o.user?.name || '').toLowerCase();
        const phone = (o.shipping_address?.phone || o.user?.phone || '').toLowerCase();
        const city = (o.shipping_address?.city || '').toLowerCase();
        const courier = (o.courier_name || '').toLowerCase();
        const awb = (o.tracking_number || '').toLowerCase();

        return (
          inv.includes(q) ||
          comp.includes(q) ||
          contact.includes(q) ||
          phone.includes(q) ||
          city.includes(q) ||
          courier.includes(q) ||
          awb.includes(q)
        );
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Operational KPI Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.grand_total || 0), 0);
    const pendingDispatch = orders.filter(
      (o) => o.order_status === 'placed' || o.order_status === 'confirmed'
    ).length;
    const paidOrders = orders.filter((o) => o.payment_status === 'paid').length;
    const paymentRate = totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0;

    return { totalOrders, totalRevenue, pendingDispatch, paidOrders, paymentRate };
  }, [orders]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

  const courierPresets = [
    'BlueDart Enterprise',
    'Delhivery Express',
    'DTDC Priority Air',
    'SafeXpress Surface',
    'Internal Dedicated Fleet'
  ];

  return (
    <div className="space-y-6 text-xs pb-16">
      {/* ======================================================== */}
      {/* 1. HEADER TITLE & REFRESH ACTION                         */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — DISPATCH & LOGISTICS COMMAND
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Orders & Tax Invoices
          </h1>
          <p className="text-[#5A6B63] mt-1 text-xs">
            Manage corporate purchase orders, payment verification, carrier tracking, and proforma tax invoices.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#0D3B2A] border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D4A24C] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. OPERATIONAL KPI SUMMARY STRIP                         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Total Purchase Orders
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-[#0D3B2A]">{stats.totalOrders}</span>
              <span className="text-[10px] text-emerald-600 font-medium">Logged</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8A5E12] flex items-center justify-center shrink-0 border border-[#D4A24C]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Cumulative Revenue
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-[#0D3B2A]">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Gross</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Pending Fulfillment
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-amber-800">{stats.pendingDispatch}</span>
              <span className="text-[10px] text-amber-700 font-medium">Awaiting Dispatch</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Payment Realization
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-[#0D3B2A]">{stats.paymentRate}%</span>
              <span className="text-[10px] text-slate-400">({stats.paidOrders} Paid)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FILTER TABS & SEARCH BAR CONTROLS                     */}
      {/* ======================================================== */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'placed', label: 'Placed', count: orders.filter((o) => o.order_status === 'placed').length },
            { id: 'confirmed', label: 'Confirmed', count: orders.filter((o) => o.order_status === 'confirmed').length },
            { id: 'shipped', label: 'Shipped', count: orders.filter((o) => o.order_status === 'shipped').length },
            { id: 'delivered', label: 'Delivered', count: orders.filter((o) => o.order_status === 'delivered').length },
            { id: 'pending_payment', label: 'Pending Payment', count: orders.filter((o) => o.payment_status !== 'paid').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#0D3B2A] text-white shadow-2xs'
                  : 'bg-slate-100/70 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  statusFilter === tab.id ? 'bg-[#D4A24C] text-slate-900 font-bold' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[280px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search invoice #, client, company, phone, AWB..."
            className="w-full pl-8 pr-8 py-1.5 bg-[#FAF7F2] border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D3B2A] focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ORDERS DATA TABLE WITH INLINE CONTROLS               */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-[#D4A24C]/25 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-6 h-6 text-[#D4A24C] animate-spin mx-auto mb-2" />
            <p className="text-slate-500 font-medium">Synchronizing corporate orders database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <PackageCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-700 font-bold text-sm">No matching corporate purchase orders found</p>
            <p className="text-slate-400 text-xs">
              {searchQuery || statusFilter !== 'all'
                ? 'Try broadening your search term or selecting "All Orders".'
                : 'No client orders have been placed yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#D4A24C]/20 text-[#8A5E12] font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Invoice & Date</th>
                  <th className="py-3 px-4 font-bold">Enterprise Client</th>
                  <th className="py-3 px-4 font-bold">Hardware Manifest</th>
                  <th className="py-3 px-4 font-bold">Total Amount</th>
                  <th className="py-3 px-4 font-bold">Payment Status</th>
                  <th className="py-3 px-4 font-bold">Dispatch Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.map((o) => {
                  const companyName = o.shipping_address?.company_name || o.user?.company_name || 'Individual';
                  const contactPerson = o.shipping_address?.contact_person || o.user?.name || 'Signatory';
                  const phone = o.shipping_address?.phone || o.user?.phone || '';
                  const totalUnits = (o.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);
                  const firstItemTitle = o.items?.[0]?.title || 'Hardware Package';

                  return (
                    <tr key={o._id} className="hover:bg-[#FAF7F2]/40 transition group">
                      {/* Column 1: Invoice & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono">
                          <strong className="text-[#0D3B2A] block text-xs tracking-tight">
                            {o.invoice_number}
                          </strong>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            {o.razorpay_order_id ? 'Razorpay' : 'Proforma PO'}
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Enterprise Client */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="space-y-0.5">
                          <strong className="text-slate-900 block font-semibold truncate text-xs" title={companyName}>
                            {companyName}
                          </strong>
                          <span className="text-slate-500 text-[11px] block truncate" title={contactPerson}>
                            {contactPerson}
                          </span>
                          {phone && (
                            <a
                              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-900 font-mono hover:underline"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span>{phone}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Column 3: Hardware Manifest */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#8A5E12] font-mono font-bold text-[10px]">
                            {totalUnits} Unit{totalUnits > 1 ? 's' : ''} ({o.items?.length || 0} SKU)
                          </span>
                          <span className="text-slate-600 text-[11px] block truncate" title={firstItemTitle}>
                            {firstItemTitle}
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Total Amount */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono">
                          <strong className="text-[#0D3B2A] block text-xs">
                            ₹{(o.grand_total || 0).toLocaleString('en-IN')}
                          </strong>
                          <span className="text-[10px] text-slate-400 block">
                            (Incl. ₹{(o.total_gst || 0).toLocaleString('en-IN')} GST)
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Payment Status (INLINE DIRECT DROPDOWN) */}
                      <td className="py-3.5 px-4">
                        <select
                          value={o.payment_status}
                          onChange={(e) =>
                            handleQuickStatusUpdate(o._id, { payment_status: e.target.value })
                          }
                          className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition ${
                            o.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : o.payment_status === 'refunded'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : o.payment_status === 'failed'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid (Verified)</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Column 6: Dispatch Status (INLINE DIRECT DROPDOWN + CARRIER BADGE) */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <select
                            value={o.order_status}
                            onChange={(e) =>
                              handleQuickStatusUpdate(o._id, { order_status: e.target.value })
                            }
                            className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition ${
                              o.order_status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : o.order_status === 'shipped'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                : o.order_status === 'confirmed'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : o.order_status === 'cancelled'
                                ? 'bg-slate-100 text-slate-600 border-slate-300'
                                : 'bg-[#FAF7F2] text-[#0D3B2A] border-[#D4A24C]/35'
                            }`}
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {o.tracking_number && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                              <Truck className="w-2.5 h-2.5 text-[#D4A24C] shrink-0" />
                              <span className="truncate max-w-[110px]" title={`${o.courier_name}: ${o.tracking_number}`}>
                                {o.courier_name || 'Carrier'}: {o.tracking_number}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Column 7: Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingInvoice(o)}
                            className="px-2.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/35 font-bold text-[11px] flex items-center gap-1 transition shadow-2xs cursor-pointer active:scale-95"
                            title="Print / View Tax Invoice"
                          >
                            <Printer className="w-3 h-3 text-[#8A5E12]" />
                            <span>Invoice</span>
                          </button>

                          <button
                            onClick={() => openDrawer(o)}
                            className="px-3 py-1.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-[11px] flex items-center gap-1 transition shadow-2xs cursor-pointer active:scale-95 border border-[#D4A24C]/30"
                            title="Open Consignment Fulfillment Dossier"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGINATION TOOLBAR                                       */}
        {/* ======================================================== */}
        {filteredOrders.length > 0 && (
          <div className="p-3.5 bg-[#FAF7F2]/60 border-t border-[#D4A24C]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-600">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[11px] text-slate-400 font-mono ml-2">
                Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, filteredOrders.length)} of {filteredOrders.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1 font-mono text-xs font-bold">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const hasGap = prevP && p - prevP > 1;
                    return (
                      <React.Fragment key={p}>
                        {hasGap && <span className="px-1 text-slate-400">…</span>}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                            safeCurrentPage === p
                              ? 'bg-[#0D3B2A] text-white shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. EXECUTIVE FULFILLMENT SLIDE-OVER DRAWER (NO POPUP!)    */}
      {/* ======================================================== */}
      {drawerOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setDrawerOrder(null)} />

          {/* Drawer Body Container */}
          <div className="w-full max-w-xl sm:max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#D4A24C]/30 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#FAF7F2] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-white flex items-center justify-center font-bold">
                  <PackageCheck className="w-5 h-5 text-[#D4A24C]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A5E12] font-bold block">
                    CONSIGNMENT FULFILLMENT DOSSIER
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-base sm:text-lg font-bold font-mono text-[#0D3B2A]">
                      {drawerOrder.invoice_number}
                    </h2>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {new Date(drawerOrder.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingInvoice(drawerOrder)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-[#0D3B2A] border border-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#8A5E12]" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => setDrawerOrder(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200 cursor-pointer transition shadow-2xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Card 1: Enterprise Client & Billing Entity */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Building2 className="w-4 h-4 text-[#0D3B2A]" />
                    <span>Client Entity & Delivery Destination</span>
                  </div>
                  {drawerOrder.shipping_address?.gst_number && (
                    <button
                      onClick={() =>
                        copyToClipboard(drawerOrder.shipping_address.gst_number, 'GSTIN')
                      }
                      className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#8A5E12] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#D4A24C]/30 hover:bg-[#F3E8D2] cursor-pointer"
                    >
                      <span>GST: {drawerOrder.shipping_address.gst_number}</span>
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Corporate Customer
                    </span>
                    <strong className="text-slate-900 block text-xs mt-0.5">
                      {drawerOrder.shipping_address?.company_name || drawerOrder.user?.company_name || 'Individual Entity'}
                    </strong>
                    <span className="text-slate-600 text-[11px] block">
                      Attn: {drawerOrder.shipping_address?.contact_person || drawerOrder.user?.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Direct Contact Channels
                    </span>
                    <div className="flex items-center gap-1 mt-0.5 text-slate-700">
                      <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="font-mono text-xs">{drawerOrder.shipping_address?.phone || drawerOrder.user?.phone || 'N/A'}</span>
                    </div>
                    {drawerOrder.user?.email && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{drawerOrder.user.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A24C] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Shipping Address:
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {drawerOrder.shipping_address?.street || 'Central Delivery Bay'},{' '}
                      {drawerOrder.shipping_address?.city || ''}
                      {drawerOrder.shipping_address?.state ? `, ${drawerOrder.shipping_address.state}` : ''}{' '}
                      {drawerOrder.shipping_address?.pincode ? `– ${drawerOrder.shipping_address.pincode}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Ordered Hardware Inventory */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <ShoppingBag className="w-4 h-4 text-[#0D3B2A]" />
                    <span>Hardware Manifest ({drawerOrder.items?.length || 0} Line Items)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Enterprise Tested & Certified
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {(drawerOrder.items || []).map((item, idx) => {
                    const imgSrc = getSafeImageUrl(item.product);
                    return (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={imgSrc}
                            alt={item.title}
                            className="w-12 h-12 object-contain rounded-xl bg-[#FAF7F2] border border-slate-200 p-1 shrink-0"
                            onError={(e) => {
                              e.target.src = '/products/real-thinkpad-t14-transparent.png';
                            }}
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 block truncate text-xs" title={item.title}>
                              {item.title}
                            </span>
                            <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-mono mt-0.5">
                              <span>Qty: <strong className="text-slate-800">{item.quantity}</strong></span>
                              <span>•</span>
                              <span>₹{(item.price || 0).toLocaleString('en-IN')}/unit</span>
                              <span>•</span>
                              <span className="text-[#8A5E12]">{item.gst_rate || 18}% GST</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-mono">
                          <span className="font-bold text-slate-900 text-xs block">
                            ₹{(item.total || item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9.5px] text-slate-400 block">
                            Incl. Tax
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal & Financial Breakdown */}
                <div className="pt-3 border-t border-slate-100 bg-[#FAF7F2]/50 -mx-4 -mb-4 p-4 rounded-b-2xl space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Hardware Subtotal:</span>
                    <span>₹{(drawerOrder.subtotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Total GST (CGST+SGST / IGST):</span>
                    <span>+ ₹{(drawerOrder.total_gst || 0).toLocaleString('en-IN')}</span>
                  </div>
                  {drawerOrder.delivery_charges > 0 && (
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Logistics & Freight:</span>
                      <span>+ ₹{drawerOrder.delivery_charges.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                    <span className="font-serif">Grand Total Payable:</span>
                    <span className="text-[#0D3B2A]">₹{(drawerOrder.grand_total || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Logistics Partner & Consignment AWB */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Truck className="w-4 h-4 text-[#D4A24C]" />
                    <span>Logistics Carrier & Consignment Tracking</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Pan-India Transit SLA</span>
                </div>

                {/* Quick Courier Preset Chips */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                    Select Carrier Partner:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {courierPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDrawerCourier(preset)}
                        className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold font-mono transition cursor-pointer ${
                          drawerCourier === preset
                            ? 'bg-[#0D3B2A] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs for Courier & Tracking AWB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                      Carrier Name / Fleet
                    </label>
                    <input
                      type="text"
                      value={drawerCourier}
                      onChange={(e) => setDrawerCourier(e.target.value)}
                      placeholder="e.g. BlueDart Enterprise"
                      className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D3B2A] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                      Tracking AWB / Waybill #
                    </label>
                    <input
                      type="text"
                      value={drawerTracking}
                      onChange={(e) => setDrawerTracking(e.target.value)}
                      placeholder="e.g. BLU-8492019482"
                      className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D3B2A] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Admin Internal Dispatch Notes */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                    Admin Fulfillment & Dispatch Notes
                  </label>
                  <textarea
                    rows={2}
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    placeholder="e.g. Packed in anti-static boxes, sealed with tamper tape, dispatched from Bangalore warehouse..."
                    className="w-full px-3 py-1.5 bg-[#FAF7F2] border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D3B2A] focus:bg-white transition resize-none"
                  />
                </div>

                {/* Status Dropdowns in Drawer */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                      Dispatch Status
                    </label>
                    <select
                      value={drawerDispatchStatus}
                      onChange={(e) => setDrawerDispatchStatus(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D3B2A] cursor-pointer"
                    >
                      <option value="placed">Placed (Pending Warehouse)</option>
                      <option value="confirmed">Confirmed (Allocated)</option>
                      <option value="shipped">Shipped (In Transit)</option>
                      <option value="delivered">Delivered (Handed Over)</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">
                      Payment Status
                    </label>
                    <select
                      value={drawerPaymentStatus}
                      onChange={(e) => setDrawerPaymentStatus(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0D3B2A] cursor-pointer"
                    >
                      <option value="pending">Pending Payment</option>
                      <option value="paid">Paid (Verified in Bank)</option>
                      <option value="failed">Failed Payment</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 4: Quick Action Desk */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#D4A24C]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-[#0D3B2A] text-xs">Notify Client via WhatsApp</h4>
                  <p className="text-[11px] text-slate-500">
                    Send 1-click dispatch notification with carrier name & tracking AWB.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppUpdate(drawerOrder)}
                  className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition shrink-0 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Dispatch WA</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setDrawerOrder(null)}
                className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
              >
                Close Dossier
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingInvoice(drawerOrder)}
                  className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/30 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#8A5E12]" />
                  <span>View Tax Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDrawer}
                  disabled={drawerSaving}
                  className="px-6 py-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50 active:scale-95 border border-[#D4A24C]/40"
                >
                  <Save className={`w-3.5 h-3.5 text-[#D4A24C] ${drawerSaving ? 'animate-spin' : ''}`} />
                  <span>{drawerSaving ? 'Saving...' : 'Save Fulfillment Dossier'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PROFORMA / TAX INVOICE MODAL                          */}
      {/* ======================================================== */}
      {viewingInvoice && (
        <InvoiceModal order={viewingInvoice} onClose={() => setViewingInvoice(null)} />
      )}
    </div>
  );
}
