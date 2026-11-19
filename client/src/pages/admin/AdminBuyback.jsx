import React, { useState, useEffect, useMemo } from 'react';
import {
  Recycle,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  X,
  Building2,
  MapPin,
  TrendingUp,
  Coins,
  Send,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from '../../components/ThemeSelect';
import { useCompany } from '../../context/SettingsContext';

export default function AdminBuyback() {
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | new | inspected | quoted | accepted | picked_up | closed

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Valuation Modal States
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Requests
  const fetchRequests = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.get('/buyback?limit=100');
      if (res.data.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('[Admin Buyback Error]', err);
      toast.error('Failed to load asset buyback requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, itemsPerPage]);

  // Clean company initial (strips bracket tags)
  const getCleanInitial = (name, company) => {
    const raw = company || name || 'C';
    const cleaned = raw.replace(/^\[[^\]]+\]\s*/, '').trim();
    return (cleaned.charAt(0) || 'C').toUpperCase();
  };

  // Status Styling Configuration
  const getStatusBadge = (s) => {
    switch (s) {
      case 'new':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'New Lot'
        };
      case 'inspected':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'Inspected'
        };
      case 'quoted':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          label: 'Quoted'
        };
      case 'accepted':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'Accepted'
        };
      case 'picked_up':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          label: 'Picked Up & Paid'
        };
      case 'closed':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'Closed'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          label: s
        };
    }
  };

  // Handle Update Valuation
  const handleUpdate = async () => {
    if (!selectedItem) return;
    setIsSaving(true);
    try {
      const res = await api.put(`/buyback/${selectedItem._id}`, {
        status,
        offered_price: Number(offeredPrice) || 0,
        admin_notes: notes
      });
      if (res.data.success) {
        toast.success(`Valuation updated for ${selectedItem.company_name}`);
        setSelectedItem(null);
        fetchRequests();
      }
    } catch (err) {
      console.error('[Update Buyback Error]', err);
      toast.error('Failed to update buyback request');
    } finally {
      setIsSaving(false);
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalLots = requests.length;
    const totalUnits = requests.reduce((acc, r) => acc + (Number(r.approx_quantity) || 0), 0);
    const pipelineValuation = requests.reduce((acc, r) => acc + (Number(r.offered_price) || 0), 0);
    const pendingInspections = requests.filter((r) => r.status === 'new' || r.status === 'inspected').length;
    return { totalLots, totalUnits, pipelineValuation, pendingInspections };
  }, [requests]);

  // Filtering Logic
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // 1. Status Filter Tab
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false;
      }
      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const company = (r.company_name || '').toLowerCase();
        const contact = (r.contact_person || '').toLowerCase();
        const phone = (r.phone || '').toLowerCase();
        const city = (r.city || '').toLowerCase();
        const asset = (r.asset_type || '').toLowerCase();
        const desc = (r.description || '').toLowerCase();
        return (
          company.includes(q) ||
          contact.includes(q) ||
          phone.includes(q) ||
          city.includes(q) ||
          asset.includes(q) ||
          desc.includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  // Pagination Slice
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 text-xs pb-16">
      
      {/* ======================================================== */}
      {/* 1. HEADER TITLE & REFRESH ACTION                         */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — ITAD ASSET DISPOSITION
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Corporate Asset Liquidation (Buyback)
          </h1>
          <p className="text-[#5A6B63] mt-1 text-xs">
            Review corporate ITAD liquidation lots, inspect hardware specifications, quote bulk enterprise valuations, and coordinate secure logistical dispatch.
          </p>
        </div>

        <button
          onClick={() => fetchRequests(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-[#0D3B2A] rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0D3B2A] transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D4A24C] ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Lots'}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. OPERATIONAL KPI SUMMARY CARDS                         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Liquidation Lots */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Liquidation Lots
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-serif">{stats.totalLots}</span>
              <span className="text-[11px] text-slate-400 font-medium">Lots Logged</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/30 flex items-center justify-center text-[#8A5E12] shrink-0">
            <Layers className="w-5 h-5 text-[#8A5E12]" />
          </div>
        </div>

        {/* Hardware Volume */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Hardware Volume
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0D3B2A] font-serif">{stats.totalUnits}</span>
              <span className="text-[11px] text-slate-500 font-medium">Machines</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Recycle className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Pipeline Valuation */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Pipeline Valuation
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-emerald-700 font-serif">
                ₹{stats.pipelineValuation.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Offered</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Coins className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Inspection Queue */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Action Queue
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-indigo-700 font-serif">
                {stats.pendingInspections}
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">Pending Action</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CONTROL BAR: STATUS TABS & SEARCH INPUT               */}
      {/* ======================================================== */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Lots', count: requests.length },
            { id: 'new', label: 'New / Pending', count: requests.filter((r) => r.status === 'new').length },
            { id: 'inspected', label: 'Inspected', count: requests.filter((r) => r.status === 'inspected').length },
            { id: 'quoted', label: 'Quoted', count: requests.filter((r) => r.status === 'quoted').length },
            { id: 'accepted', label: 'Accepted', count: requests.filter((r) => r.status === 'accepted').length },
            { id: 'picked_up', label: 'Picked Up & Paid', count: requests.filter((r) => r.status === 'picked_up').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-[#0D3B2A] text-[#FAF7F2] shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  statusFilter === tab.id ? 'bg-[#D4A24C] text-[#0D3B2A]' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact, hardware, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. STRUCTURED BUYBACK & ITAD TABLE                       */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#D4A24C]" />
            <span>Loading asset liquidation requests...</span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <p className="font-bold text-sm text-[#0D3B2A]">No buyback records match your filter criteria.</p>
            <p className="text-xs text-slate-400">Try clearing your search terms or selecting another status tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[#0D3B2A] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold min-w-[240px]">Company & Location</th>
                  <th className="py-3 px-4 font-bold min-w-[240px]">Hardware Lot Specifications</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[120px]">Lot Volume</th>
                  <th className="py-3 px-4 font-bold text-right min-w-[160px]">Offered Valuation</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[130px]">ITAD Status</th>
                  <th className="py-3 px-4 font-bold text-right min-w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRequests.map((item) => {
                  const initial = getCleanInitial(item.contact_person, item.company_name);
                  const statusInfo = getStatusBadge(item.status);
                  const cleanPhone = (item.phone || '').replace(/[^0-9]/g, '');
                  const unitEstimate =
                    item.offered_price > 0 && item.approx_quantity > 0
                      ? Math.round(item.offered_price / item.approx_quantity)
                      : null;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition group">
                      
                      {/* Column 1: Company & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <strong
                              className="text-slate-900 block font-bold text-xs truncate max-w-[220px]"
                              title={item.company_name}
                            >
                              {item.company_name}
                            </strong>
                            <div className="text-[10.5px] text-slate-500 flex items-center gap-1 truncate max-w-[220px]">
                              <span>Attn: {item.contact_person}</span>
                              <span>•</span>
                              <span className="font-mono">{item.phone}</span>
                            </div>
                            {item.city && (
                              <div className="flex items-center gap-1 text-[10px] text-[#8A5E12] font-semibold mt-0.5">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                <span>{item.city}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Hardware Lot Specifications */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 min-w-0">
                          <strong
                            className="font-semibold text-slate-800 block text-xs truncate max-w-[240px]"
                            title={item.asset_type}
                          >
                            {item.asset_type}
                          </strong>
                          {item.description ? (
                            <p
                              className="text-[10.5px] text-slate-500 truncate max-w-[240px] italic"
                              title={item.description}
                            >
                              "{item.description}"
                            </p>
                          ) : (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Corporate Refurb Grade • Commercial ITAD
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 3: Approx Quantity */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-mono font-bold text-xs">
                          {item.approx_quantity} Units
                        </span>
                      </td>

                      {/* Column 4: Offered Valuation */}
                      <td className="py-3.5 px-4 text-right">
                        {item.offered_price > 0 ? (
                          <div>
                            <strong className="text-emerald-700 font-mono font-bold text-sm block">
                              ₹{item.offered_price.toLocaleString('en-IN')}
                            </strong>
                            {unitEstimate && (
                              <span className="text-[10px] text-slate-500 font-mono block">
                                (≈₹{unitEstimate.toLocaleString('en-IN')} / unit)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Pending Valuation
                          </span>
                        )}
                      </td>

                      {/* Column 5: Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusInfo.bg}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>

                      {/* Column 6: Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Direct */}
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                `Hello ${item.contact_person}, ${brandName} Enterprise ITAD desk is reaching out regarding your asset liquidation lot (${item.asset_type}, ${item.approx_quantity} Units).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition cursor-pointer shadow-2xs"
                              title="Chat on WhatsApp with Signatory"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Valuation Button */}
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setStatus(item.status);
                              setOfferedPrice(item.offered_price || '');
                              setNotes(item.admin_notes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl border border-[#D4A24C]/40 bg-[#FAF7F2] text-[#0D3B2A] hover:bg-[#0D3B2A] hover:text-[#FAF7F2] font-bold text-xs transition cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <Coins className="w-3 h-3 text-[#D4A24C]" />
                            <span>Valuation</span>
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
        {/* 5. PAGINATION CONTROLS                                   */}
        {/* ======================================================== */}
        {!loading && filteredRequests.length > 0 && (
          <div className="bg-slate-50/90 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left: Showing entries info + Page Size selector */}
            <div className="flex items-center gap-3 text-slate-600 text-xs">
              <span>
                Showing <strong className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-slate-900">{Math.min(currentPage * itemsPerPage, totalItems)}</strong> of{' '}
                <strong className="text-slate-900">{totalItems}</strong> liquidation lots
              </span>

              <div className="flex items-center gap-1 pl-2 border-l border-slate-300">
                <span className="text-[11px] text-slate-400">Rows:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0D3B2A] cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Right: Prev / Next / Page Pills */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (totalPages > 5 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) {
                  return null;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                      currentPage === p
                        ? 'bg-[#0D3B2A] text-[#FAF7F2] shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 6. FLEET VALUATION & DISPOSITION MODAL                   */}
      {/* ======================================================== */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center font-bold text-sm shrink-0">
                  {getCleanInitial(selectedItem.contact_person, selectedItem.company_name)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                    Valuation & Disposition Audit
                  </h3>
                  <p className="text-xs text-slate-500">{selectedItem.company_name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lot Summary Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Hardware Lot:</span>
                <strong className="text-slate-900">{selectedItem.asset_type}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Approx. Lot Size:</span>
                <span className="font-mono font-bold text-slate-800">{selectedItem.approx_quantity} Units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Contact Person:</span>
                <span className="text-slate-800">
                  {selectedItem.contact_person} ({selectedItem.phone})
                </span>
              </div>
              {selectedItem.city && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Facility Location:</span>
                  <span className="text-slate-800">{selectedItem.city}</span>
                </div>
              )}
              {selectedItem.description && (
                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                  <span className="font-semibold block text-slate-700 mb-0.5">Client Remarks:</span>
                  <p className="italic">"{selectedItem.description}"</p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              
              {/* Status Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ITAD Lifecycle Status
                </label>
                <ThemeSelect
                  value={status}
                  onChange={(val) => setStatus(val)}
                  options={[
                    { value: 'new', label: 'New / Under Assessment' },
                    { value: 'inspected', label: 'Physical Lot Inspected' },
                    { value: 'quoted', label: 'Formal Valuation Quoted' },
                    { value: 'accepted', label: 'Accepted (Pickup Scheduled)' },
                    { value: 'picked_up', label: 'Picked Up & Paid (Completed)' },
                    { value: 'closed', label: 'Closed / Lot Rejected' }
                  ]}
                  variant="admin"
                />
              </div>

              {/* Offered Bulk Valuation Input */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Offered Bulk Valuation (₹)
                  </label>
                  {offeredPrice > 0 && selectedItem.approx_quantity > 0 && (
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                      ≈ ₹{Math.round(offeredPrice / selectedItem.approx_quantity).toLocaleString('en-IN')} / unit
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 250000"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-semibold focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                  />
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Inspection Notes & Logistics Log
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Inspected on-site, Grade A- condition. DOD wipe scheduled for Tuesday pickup."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
                />
              </div>
            </div>

            {/* Quick Share on WhatsApp CTA if price offered */}
            {offeredPrice > 0 && selectedItem.phone && (
              <div className="p-3 bg-[#FAF7F2] border border-[#D4A24C]/30 rounded-xl flex items-center justify-between gap-2">
                <div className="text-[11px] text-[#8A5E12]">
                  <strong>1-Click Dispatch:</strong> Share official valuation via WhatsApp
                </div>
                <a
                  href={`https://wa.me/${selectedItem.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedItem.contact_person}, ${brandName} Enterprise ITAD desk has completed valuation for your liquidation lot (${selectedItem.asset_type}, ${selectedItem.approx_quantity} Units). Our certified enterprise offer is ₹${Number(offeredPrice).toLocaleString('en-IN')}. Please reply to confirm logistics pickup.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] transition inline-flex items-center gap-1 shadow-2xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Offer</span>
                </a>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#0D3B2A] hover:bg-[#124e38] text-[#FAF7F2] font-bold text-xs shadow border border-[#D4A24C]/40 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4A24C]" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A24C]" />
                    <span>Save Valuation Updates</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
