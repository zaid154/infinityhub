import React, { useState, useEffect, useMemo } from 'react';
import {
  Repeat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  Building2,
  Laptop,
  Layers,
  Phone,
  ShieldCheck,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  PackageCheck
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from '../../components/ThemeSelect';
import { getSafeImageUrl } from '../../utils/imageHelper';

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rentals');
      if (res.data.success) {
        setRentals(res.data.rentals || []);
      }
    } catch (err) {
      console.error('[Admin Rentals Error]', err);
      toast.error('Failed to load rental fleet records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleUpdate = async () => {
    if (!selectedRental) return;
    try {
      const res = await api.put(`/rentals/${selectedRental._id}/status`, {
        status,
        payment_status: paymentStatus,
        admin_notes: notes
      });
      if (res.data.success) {
        toast.success('Rental fleet agreement updated successfully!');
        setSelectedRental(null);
        fetchRentals();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update rental status');
    }
  };

  // Helper: Calculate authentic renewal end date based on tenure
  const getRentalDates = (r) => {
    const startDate = new Date(r.start_date || r.createdAt || Date.now());
    let endDate = r.end_date ? new Date(r.end_date) : null;

    if (!endDate) {
      endDate = new Date(startDate);
      const months = r.tenure === '1_month' ? 1 : r.tenure === '3_months' ? 3 : r.tenure === '12_months' ? 12 : 6;
      endDate.setMonth(endDate.getMonth() + months);
    }

    const fmt = (d) =>
      d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

    return {
      startFormatted: fmt(startDate),
      endFormatted: fmt(endDate),
      isNearRenewal: (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 30
    };
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const activeRentals = rentals.filter((r) => r.status === 'active');
    const totalUnits = activeRentals.reduce((sum, r) => sum + (r.quantity || 1), 0);
    const totalMRR = activeRentals.reduce((sum, r) => sum + (r.monthly_rate || 0), 0);
    return {
      activeCount: activeRentals.length,
      totalUnits,
      totalMRR,
      totalRentals: rentals.length
    };
  }, [rentals]);

  // Filtered & Searched Rentals
  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false;
      }
      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const company = (r.user?.company_name || '').toLowerCase();
        const clientName = (r.user?.name || '').toLowerCase();
        const hardware = (r.product?.title || '').toLowerCase();
        const phone = (r.user?.phone || '').toLowerCase();
        return company.includes(q) || clientName.includes(q) || hardware.includes(q) || phone.includes(q);
      }
      return true;
    });
  }, [rentals, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 text-xs pb-16">
      
      {/* ======================================================== */}
      {/* 1. HEADER TITLE & REAL-TIME REFRESH ACTION               */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — ENTERPRISE LEASE CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Corporate Rental Fleets
          </h1>
          <p className="text-[#5A6B63] mt-1 text-xs">
            Manage deployed corporate workstation fleets, monthly billing cycles, SLA swaps, and renewal schedules.
          </p>
        </div>

        <button
          onClick={fetchRentals}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#0D3B2A] border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#D4A24C] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Fleets</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. OPERATIONAL KPI SUMMARY STRIP (AT-A-GLANCE METRICS)   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Active Leases
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-[#0D3B2A]">{stats.activeCount}</span>
              <span className="text-[10px] text-emerald-700 font-bold">/ {stats.totalRentals} Total</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8A5E12] flex items-center justify-center shrink-0 border border-[#D4A24C]/30">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Units Deployed
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-serif text-[#0D3B2A]">{stats.totalUnits}</span>
              <span className="text-[10px] text-slate-500">Machines</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Monthly Rental MRR
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-[#0D3B2A]">₹{stats.totalMRR.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500">/mo</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
              Standby Swap SLA
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-[#0D3B2A] font-serif">24–48h Active</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">100% Guaranteed</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SEARCH & STATUS FILTER TOOLBAR                        */}
      {/* ======================================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Fleets', count: rentals.length },
            { id: 'active', label: 'Active', count: rentals.filter((r) => r.status === 'active').length },
            { id: 'returned', label: 'Returned', count: rentals.filter((r) => r.status === 'returned').length },
            { id: 'overdue', label: 'Overdue', count: rentals.filter((r) => r.status === 'overdue').length }
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
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client, company, hardware..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-[#0D3B2A] focus:ring-1 focus:ring-[#0D3B2A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. STRUCTURED CORPORATE RENTAL FLEET TABLE               */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#D4A24C]" />
            <span>Loading corporate rental agreements...</span>
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <p className="font-bold text-sm text-[#0D3B2A]">No rental records match your filter criteria.</p>
            <p className="text-xs text-slate-400">Try clearing your search terms or selecting another status tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[#0D3B2A] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Client / Company</th>
                  <th className="py-3 px-4 font-bold">Hardware Fleet</th>
                  <th className="py-3 px-4 font-bold text-center">Volume</th>
                  <th className="py-3 px-4 font-bold">Lease Timeline & Renewal</th>
                  <th className="py-3 px-4 font-bold text-right">Monthly OPEX</th>
                  <th className="py-3 px-4 font-bold text-center">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRentals.map((r) => {
                  const dates = getRentalDates(r);
                  const companyName = r.user?.company_name || r.user?.name || 'Direct Enterprise Client';
                  const clientInitial = companyName.replace(/^\[[^\]]+\]\s*/, '').trim().charAt(0).toUpperCase() || 'C';
                  const contactPerson = r.user?.name || 'Authorized Signatory';
                  const phone = r.user?.phone || r.user?.email || 'Corporate Lease Desk';

                  const hardwareTitle = r.product?.title || 'Certified Enterprise Laptop Fleet';
                  const hardwareImage = getSafeImageUrl(r.product);
                  const unitRate = Math.round((r.monthly_rate || 0) / (r.quantity || 1));

                  return (
                    <tr key={r._id} className="hover:bg-slate-50/70 transition group">
                      
                      {/* Column 1: Client & Company */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {clientInitial}
                          </div>
                          <div className="min-w-0">
                            <strong className="text-slate-900 block font-bold text-xs truncate max-w-[200px]" title={companyName}>
                              {companyName}
                            </strong>
                            <div className="text-[10.5px] text-slate-500 flex items-center gap-1 truncate max-w-[200px]">
                              <span>Attn: {contactPerson}</span>
                              <span>•</span>
                              <span className="font-mono">{phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Hardware Machine */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={hardwareImage} alt="" className="w-full h-full object-contain filter drop-shadow-2xs" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 block text-xs truncate max-w-[240px]" title={hardwareTitle}>
                              {hardwareTitle}
                            </span>
                            <span className="text-[10px] font-mono text-[#8A5E12] block">
                              Tier-1 Enterprise Fleet • Grade A+
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Volume Deployed */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 font-mono font-bold text-slate-900 text-xs border border-slate-200">
                          {r.quantity} Units
                        </span>
                      </td>

                      {/* Column 4: Lease Timeline & Renewal (Explicit Dates!) */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 text-[9.5px] font-bold uppercase tracking-wider">
                              {r.tenure.replace(/_/g, ' ')}
                            </span>
                            {dates.isNearRenewal && r.status === 'active' && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                Renews Soon
                              </span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{dates.startFormatted} → <strong>{dates.endFormatted}</strong></span>
                          </div>
                        </div>
                      </td>

                      {/* Column 5: Monthly OPEX Billing */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-bold text-sm text-[#0D3B2A]">
                          ₹{r.monthly_rate?.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/mo</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          (₹{unitRate.toLocaleString('en-IN')}/unit)
                        </span>
                      </td>

                      {/* Column 6: Status & SLA */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider border ${
                              r.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : r.status === 'returned'
                                ? 'bg-slate-100 text-slate-700 border-slate-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {r.status}
                          </span>
                          <span className="text-[8.5px] font-semibold text-slate-400 uppercase tracking-widest block">
                            24h SLA Active
                          </span>
                        </div>
                      </td>

                      {/* Column 7: Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRental(r);
                            setStatus(r.status);
                            setPaymentStatus(r.payment_status || 'paid');
                            setNotes(r.admin_notes || '');
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/35 font-bold text-[11px] transition shadow-2xs cursor-pointer active:scale-95"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. MODAL: ENTERPRISE FLEET LEASE MANAGEMENT DRAWER       */}
      {/* ======================================================== */}
      {selectedRental && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-[#D4A24C]/30 relative my-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[9.5px] font-mono uppercase tracking-wider font-bold text-[#8A5E12]">
                  FLEET CONTRACT MANAGEMENT
                </span>
                <h3 className="text-base font-bold font-serif text-[#0D3B2A]">
                  {selectedRental.user?.company_name || selectedRental.user?.name || 'Direct Enterprise Client'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRental(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hardware & Contract Summary Box */}
            <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#D4A24C]/25 space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={getSafeImageUrl(selectedRental.product)}
                  alt=""
                  className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{selectedRental.product?.title || 'Certified Enterprise Laptop Fleet'}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Volume: <strong className="text-[#0D3B2A]">{selectedRental.quantity} Units</strong> • Tenure: <strong className="capitalize">{selectedRental.tenure.replace(/_/g, ' ')}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D4A24C]/15 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-mono">
                  Monthly Rate: <strong className="text-[#0D3B2A]">₹{selectedRental.monthly_rate?.toLocaleString('en-IN')}/mo</strong>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  24–48h SLA Active
                </span>
              </div>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fleet Operational Status</label>
              <ThemeSelect
                value={status}
                onChange={(val) => setStatus(val)}
                options={[
                  { value: 'active', label: 'Active (Deployed On-Site)' },
                  { value: 'returned', label: 'Returned / Contract Closed' },
                  { value: 'overdue', label: 'Overdue / Renewal Pending' },
                  { value: 'cancelled', label: 'Cancelled / Terminated' }
                ]}
                variant="admin"
              />
            </div>

            {/* Payment Status Dropdown */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lease Remittance Status</label>
              <ThemeSelect
                value={paymentStatus}
                onChange={(val) => setPaymentStatus(val)}
                options={[
                  { value: 'paid', label: 'Paid / Invoiced (GSTR-2B Verified)' },
                  { value: 'pending', label: 'Pending Wire / Net-30 PO' }
                ]}
                variant="admin"
              />
            </div>

            {/* Admin Notes & SLA Replacement Log */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Notes & SLA Replacement Log</label>
              <textarea
                rows="3"
                placeholder="Log standby unit swaps, asset tag IDs, or lease renewal milestones..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0D3B2A] text-xs font-mono"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedRental(null)}
                className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 rounded-full bg-[#0D3B2A] text-white hover:bg-[#153423] font-bold text-xs shadow-md border border-[#D4A24C]/40 transition cursor-pointer active:scale-95"
              >
                Save Updates
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}