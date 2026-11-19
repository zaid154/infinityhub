import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Lock,
  Unlock,
  RefreshCw,
  FileText,
  X,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Truck
} from 'lucide-react';
import api from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | verified | unverified | blocked
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [customerToBlock, setCustomerToBlock] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch Customers
  const fetchCustomers = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.get('/admin/customers');
      if (res.data.success) {
        setCustomers(res.data.customers || []);
      }
    } catch (err) {
      console.error('[Admin Customers Error]', err);
      showToast('Failed to load customer directory', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Show Toast Helper
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Copy to clipboard helper
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clean company initial (strips bracket tags like "[TEST-AUDIT]")
  const getCleanInitial = (name, company) => {
    const raw = company || name || 'C';
    const cleaned = raw.replace(/^\[[^\]]+\]\s*/, '').trim();
    return (cleaned.charAt(0) || 'C').toUpperCase();
  };

  // Open Block Modal
  const openBlockModal = (customer) => {
    setCustomerToBlock(customer);
    setBlockReason(customer.block_reason || '');
    setBlockModalOpen(true);
  };

  // Close Block Modal
  const closeBlockModal = () => {
    setCustomerToBlock(null);
    setBlockReason('');
    setBlockModalOpen(false);
  };

  // Execute Block / Unblock Toggle
  const handleConfirmBlockToggle = async () => {
    if (!customerToBlock) return;
    setIsSubmittingBlock(true);

    const willBlock = !customerToBlock.is_blocked;

    try {
      const res = await api.put(`/admin/customers/${customerToBlock._id}/block`, {
        is_blocked: willBlock,
        block_reason: willBlock ? (blockReason.trim() || 'Administrative policy hold') : ''
      });

      if (res.data.success) {
        // Update local state immediately
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === customerToBlock._id
              ? {
                  ...c,
                  is_blocked: willBlock,
                  block_reason: willBlock ? (blockReason.trim() || 'Administrative policy hold') : ''
                }
              : c
          )
        );
        showToast(
          willBlock
            ? `Corporate account ${customerToBlock.company_name || customerToBlock.name} suspended.`
            : `Corporate account ${customerToBlock.company_name || customerToBlock.name} reactivated.`,
          'success'
        );
        closeBlockModal();
      }
    } catch (err) {
      console.error('[Block Toggle Error]', err);
      showToast(err.response?.data?.message || 'Error updating account status', 'error');
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = customers.length;
    const verified = customers.filter((c) => c.email_verified).length;
    const blocked = customers.filter((c) => c.is_blocked).length;
    const activeWithCommercial = customers.filter((c) => (c.orders_count || 0) > 0 || (c.rentals_count || 0) > 0).length;
    return { total, verified, blocked, activeWithCommercial };
  }, [customers]);

  // Filtering Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // 1. Status Filter Tab
      if (statusFilter === 'active' && (c.is_blocked || !c.email_verified)) return false;
      if (statusFilter === 'verified' && !c.email_verified) return false;
      if (statusFilter === 'unverified' && c.email_verified) return false;
      if (statusFilter === 'blocked' && !c.is_blocked) return false;

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (c.name || '').toLowerCase();
        const company = (c.company_name || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        return name.includes(q) || company.includes(q) || email.includes(q) || phone.includes(q);
      }
      return true;
    });
  }, [customers, statusFilter, searchQuery]);

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, itemsPerPage]);

  // Pagination Slice
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 text-xs pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 transition-all duration-300 ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-[#0D3B2A] text-[#FAF7F2] border-[#D4A24C]/40'
          }`}
        >
          {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-[#D4A24C]" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. HEADER TITLE & REFRESH ACTION                         */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — ENTERPRISE CLIENT REPOSITORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Customer & Corporate Directory
          </h1>
          <p className="text-[#5A6B63] mt-1 text-xs">
            Manage registered corporate accounts, verification compliance, order history, and access privileges.
          </p>
        </div>

        <button
          onClick={() => fetchCustomers(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-[#0D3B2A] rounded-xl text-xs font-semibold text-slate-700 hover:text-[#0D3B2A] transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D4A24C] ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Directory'}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. OPERATIONAL KPI SUMMARY CARDS                         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Customers */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Total Accounts
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-serif">{stats.total}</span>
              <span className="text-[11px] text-slate-400 font-medium">Entities</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/30 flex items-center justify-center text-[#8A5E12] shrink-0">
            <Users className="w-5 h-5 text-[#8A5E12]" />
          </div>
        </div>

        {/* Verified Accounts */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Verified Accounts
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-emerald-700 font-serif">{stats.verified}</span>
              <span className="text-[11px] text-emerald-600 font-medium">
                ({stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}%)
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Commercial Engagement */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Commercial Clients
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0D3B2A] font-serif">{stats.activeWithCommercial}</span>
              <span className="text-[11px] text-[#8A5E12] font-medium">Orders / Fleets</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Restricted / Blocked */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
              Account Security
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-bold font-serif ${stats.blocked > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {stats.blocked}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Suspended</span>
            </div>
          </div>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
            stats.blocked > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            {stats.blocked > 0 ? <ShieldAlert className="w-5 h-5 text-rose-600" /> : <ShieldCheck className="w-5 h-5 text-emerald-600" />}
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
            { id: 'all', label: 'All Clients', count: customers.length },
            { id: 'active', label: 'Active', count: customers.filter((c) => !c.is_blocked && c.email_verified).length },
            { id: 'verified', label: 'Verified', count: stats.verified },
            { id: 'unverified', label: 'Unverified', count: customers.length - stats.verified },
            { id: 'blocked', label: 'Suspended / Blocked', count: stats.blocked }
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
            placeholder="Search company, contact, email, phone..."
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
      {/* 4. STRUCTURED CUSTOMER & CORPORATE TABLE                 */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#D4A24C]" />
            <span>Loading enterprise customer repository...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <p className="font-bold text-sm text-[#0D3B2A]">No customer records match your filter criteria.</p>
            <p className="text-xs text-slate-400">Try clearing your search terms or selecting another status tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[#0D3B2A] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold min-w-[220px]">Client / Organization</th>
                  <th className="py-3 px-4 font-bold min-w-[260px]">Contact Coordinates</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[140px]">Account Status</th>
                  <th className="py-3 px-4 font-bold text-center min-w-[150px]">Activity & Leases</th>
                  <th className="py-3 px-4 font-bold min-w-[120px]">Joined Date</th>
                  <th className="py-3 px-4 font-bold text-right min-w-[140px]">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCustomers.map((c) => {
                  const companyName = c.company_name || 'Direct Enterprise Client';
                  const initial = getCleanInitial(c.name, c.company_name);
                  const isBlocked = !!c.is_blocked;

                  return (
                    <tr
                      key={c._id}
                      className={`hover:bg-slate-50/70 transition group ${
                        isBlocked ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Column 1: Client & Organization */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border ${
                              isBlocked
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-[#FAF7F2] text-[#8A5E12] border-[#D4A24C]/30'
                            }`}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <strong
                                className={`block font-bold text-xs truncate max-w-[220px] ${
                                  isBlocked ? 'text-rose-900 line-through' : 'text-slate-900'
                                }`}
                                title={companyName}
                              >
                                {companyName}
                              </strong>
                              {isBlocked && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                                  Blocked
                                </span>
                              )}
                            </div>
                            <div className="text-[10.5px] text-slate-500 flex items-center gap-1 truncate max-w-[220px]">
                              <span>Attn: {c.name || 'Authorized Signatory'}</span>
                            </div>
                            <span className="text-[10px] font-mono text-[#8A5E12] block">
                              Corporate Enterprise
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Contact Coordinates */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {/* Email */}
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span
                              className="font-mono text-[11px] text-slate-800 truncate max-w-[190px]"
                              title={c.email}
                            >
                              {c.email}
                            </span>
                            <button
                              onClick={() => handleCopy(c.email, `email-${c._id}`)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer"
                              title="Copy Email"
                            >
                              {copiedId === `email-${c._id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          {/* Phone */}
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="font-mono text-[11px] text-slate-600 whitespace-nowrap">
                              {c.phone || '+91 Direct Procurement Desk'}
                            </span>
                            {c.phone && (
                              <button
                                onClick={() => handleCopy(c.phone, `phone-${c._id}`)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                title="Copy Phone Number"
                              >
                                {copiedId === `phone-${c._id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Account Status */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {/* Email verification */}
                          {c.email_verified ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          )}

                          {/* Access / Block Status */}
                          {isBlocked ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Suspended</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                              <Unlock className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Active Access</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 4: Commercial Activity */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center gap-1"
                            title="Direct Sale Orders"
                          >
                            <ShoppingBag className="w-3 h-3 text-slate-500" />
                            <span>{c.orders_count || 0} POs</span>
                          </span>
                          <span
                            className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#D4A24C]/30 text-[#8A5E12] font-mono text-[11px] font-bold flex items-center gap-1"
                            title="Rental Fleets"
                          >
                            <Truck className="w-3 h-3 text-[#D4A24C]" />
                            <span>{c.rentals_count || 0} Fleets</span>
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Joined Date */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-700 text-xs whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>

                      {/* Column 6: Access Control / Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            title="View Full Corporate Profile"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Block / Unblock Toggle Button */}
                          {isBlocked ? (
                            <button
                              onClick={() => openBlockModal(c)}
                              className="px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="Reactivate Customer Access"
                            >
                              <Unlock className="w-3 h-3 text-emerald-600" />
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openBlockModal(c)}
                              className="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="Suspend Customer Account"
                            >
                              <Lock className="w-3 h-3 text-rose-600" />
                              <span>Block</span>
                            </button>
                          )}
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
        {!loading && filteredCustomers.length > 0 && (
          <div className="bg-slate-50/90 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left: Showing entries info + Page Size selector */}
            <div className="flex items-center gap-3 text-slate-600 text-xs">
              <span>
                Showing <strong className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-slate-900">{Math.min(currentPage * itemsPerPage, totalItems)}</strong> of{' '}
                <strong className="text-slate-900">{totalItems}</strong> clients
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
                // Show max 5 buttons around current page
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
      {/* 6. BLOCK / UNBLOCK SUSPENSION MODAL                      */}
      {/* ======================================================== */}
      {blockModalOpen && customerToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    customerToBlock.is_blocked
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {customerToBlock.is_blocked ? (
                    <Unlock className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {customerToBlock.is_blocked ? 'Reactivate Account' : 'Suspend Customer Account'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {customerToBlock.is_blocked ? 'Restore corporate access' : 'Restrict portal & order capabilities'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeBlockModal}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Account Summary */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Corporate Entity:</span>
                <strong className="text-slate-900">{customerToBlock.company_name || 'Individual'}</strong>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Contact Person:</span>
                <span className="text-slate-700">{customerToBlock.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Registered Email:</span>
                <span className="font-mono text-slate-700">{customerToBlock.email}</span>
              </div>
            </div>

            {/* Action Notice & Reason Input */}
            {!customerToBlock.is_blocked ? (
              <div className="space-y-3">
                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-rose-800 text-[11px] leading-relaxed">
                  <strong>Warning:</strong> Suspending this account will immediately revoke login sessions, prevent submitting procurement purchase orders, and disable RFQ lease submissions.
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Suspension Reason (Visible in Audit Log):
                  </label>
                  <textarea
                    rows={2}
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="e.g. Overdue lease remittance, fraud detection flag, invalid GSTIN..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                  {/* Preset Quick Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['Overdue Remittance', 'Invalid GST Details', 'Security Verification Hold'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBlockReason(preset)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-medium transition cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
                <strong>Reactivation:</strong> This will restore full portal login capabilities, order tracking, and hardware lease procurement privileges for this enterprise account.
                {customerToBlock.block_reason && (
                  <div className="mt-2 text-[10.5px] text-emerald-800 pt-1.5 border-t border-emerald-200">
                    Previous block reason: <em>"{customerToBlock.block_reason}"</em>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={closeBlockModal}
                disabled={isSubmittingBlock}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlockToggle}
                disabled={isSubmittingBlock}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  customerToBlock.is_blocked
                    ? 'bg-[#0D3B2A] hover:bg-[#124e38] text-[#FAF7F2]'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {isSubmittingBlock ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : customerToBlock.is_blocked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Reactivate Account</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm Suspension</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. CUSTOMER PROFILE DETAILS MODAL                        */}
      {/* ======================================================== */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-4">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center font-bold text-sm shrink-0">
                  {getCleanInitial(selectedCustomer.name, selectedCustomer.company_name)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {selectedCustomer.company_name || selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-500">Corporate Customer Profile</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Contact Signatory</span>
                <strong className="text-slate-900">{selectedCustomer.name}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Email Address</span>
                <span className="font-mono text-slate-800 break-all">{selectedCustomer.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Phone Number</span>
                <span className="font-mono text-slate-800">{selectedCustomer.phone || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Verification Status</span>
                <span className="font-bold text-emerald-700">
                  {selectedCustomer.email_verified ? 'Email Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>

            {/* Commercial Summary */}
            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#D4A24C]/30 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] font-mono text-[#8A5E12] uppercase block font-semibold">Total Orders</span>
                <strong className="text-lg font-bold text-[#0D3B2A]">{selectedCustomer.orders_count || 0}</strong>
              </div>
              <div className="w-px h-8 bg-[#D4A24C]/20" />
              <div>
                <span className="text-[10px] font-mono text-[#8A5E12] uppercase block font-semibold">Rental Fleets</span>
                <strong className="text-lg font-bold text-[#0D3B2A]">{selectedCustomer.rentals_count || 0}</strong>
              </div>
              <div className="w-px h-8 bg-[#D4A24C]/20" />
              <div>
                <span className="text-[10px] font-mono text-[#8A5E12] uppercase block font-semibold">Access Level</span>
                <strong className={`text-xs font-bold block mt-1 ${selectedCustomer.is_blocked ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {selectedCustomer.is_blocked ? 'Suspended' : 'Full Access'}
                </strong>
              </div>
            </div>

            {selectedCustomer.block_reason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                <strong>Block Reason:</strong> {selectedCustomer.block_reason}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-[#0D3B2A] hover:bg-[#124e38] text-[#FAF7F2] rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
