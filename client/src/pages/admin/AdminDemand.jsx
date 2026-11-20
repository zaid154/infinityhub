import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Search,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Building,
  User as UserIcon,
  Phone,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from '../../components/ThemeSelect';

export default function AdminDemand() {
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [stats, setStats] = useState({
    totalQueries: 0,
    unstockedCount: 0,
    plannedCount: 0,
    stockedCount: 0
  });
  const [topDemands, setTopDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortOption, setSortOption] = useState('frequency');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDemands = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.get('/demand', {
        params: {
          status: statusFilter,
          source: sourceFilter,
          sort: sortOption,
          page
        }
      });
      if (res.data?.success) {
        setDemands(res.data.demands);
        setStats(res.data.stats);
        setTopDemands(res.data.topDemands || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Fetch Demands Error]', err);
      toast.error('Failed to load customer demand records');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter, sortOption, page]);

  useEffect(() => {
    let isMounted = true;
    api.get('/demand', {
      params: {
        status: statusFilter,
        source: sourceFilter,
        sort: sortOption,
        page
      }
    })
      .then((res) => {
        if (!isMounted || !res.data?.success) return;
        setDemands(res.data.demands);
        setStats(res.data.stats);
        setTopDemands(res.data.topDemands || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        console.error('[Fetch Demands Error]', err);
        toast.error('Failed to load customer demand records');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [statusFilter, sourceFilter, sortOption, page]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/demand/${id}`, { procurement_status: newStatus });
      if (res.data.success) {
        toast.success(`Demand marked as ${newStatus.replace('_', ' ')}`);
        fetchDemands();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this demand record?')) return;
    try {
      const res = await api.delete(`/demand/${id}`);
      if (res.data.success) {
        toast.success('Demand record removed');
        fetchDemands();
      }
    } catch {
      toast.error('Failed to delete record');
    }
  };

  const handleListProduct = async (demand) => {
    // Optionally update status to procurement_planned
    if (demand.procurement_status === 'demand_logged') {
      try {
        await api.put(`/demand/${demand._id}`, { procurement_status: 'procurement_planned' });
      } catch {
        // Continue navigation
      }
    }
    const params = new URLSearchParams({
      title: demand.detected_model || demand.query_text,
      brand: demand.detected_brand || '',
      category: demand.category || 'laptop'
    });
    navigate(`/admin/products/new?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — DEMAND INTELLIGENCE & UNSTOCKED RADAR
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Customer Search & Bot Inquiries
          </h1>
          <p className="text-xs text-[#5A6B63] mt-1 max-w-2xl">
            Real-time tracking of what corporate visitors are asking the AI bot and searching on the site.
            Discover high-demand unstocked models to procure and list in your catalog.
          </p>
        </div>

        <button
          onClick={fetchDemands}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#D4A24C]/30 text-xs font-bold text-[#0D3B2A] hover:bg-[#FAF7F2] transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#8A5E12]" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-[#D4A24C]/25 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5A6B63] uppercase tracking-wider">Total Inquiries</span>
            <Search className="w-4 h-4 text-[#8A5E12]" />
          </div>
          <p className="text-2xl font-bold font-serif text-[#0D3B2A]">{stats.totalQueries}</p>
          <p className="text-[10.5px] text-[#5A6B63]">Customer searches & chat queries</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#D4A24C]/25 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Unstocked Demand</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-serif text-amber-900">{stats.unstockedCount}</p>
          <p className="text-[10.5px] text-[#5A6B63]">Requested models not in inventory</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#D4A24C]/25 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Procuring</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-serif text-blue-900">{stats.plannedCount}</p>
          <p className="text-[10.5px] text-[#5A6B63]">Marked for stock procurement</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#D4A24C]/25 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Stocked & Listed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-serif text-emerald-900">{stats.stockedCount}</p>
          <p className="text-[10.5px] text-[#5A6B63]">Successfully fulfilled & listed</p>
        </div>
      </div>

      {/* Top Unstocked Models Banner */}
      {topDemands.length > 0 && (
        <div className="bg-gradient-to-r from-[#0D3B2A] to-[#154D37] text-white p-5 rounded-2xl border border-[#D4A24C]/40 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4A24C]" />
            <h2 className="text-sm font-bold font-serif text-[#FAF7F2] tracking-wide">
              Top Unstocked Hardware Most Requested by Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topDemands.map((td) => (
              <div
                key={td._id}
                className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D4A24C] text-[#072117] uppercase">
                      {td.detected_brand || 'Hardware'}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono font-bold">
                      {td.frequency} {td.frequency === 1 ? 'request' : 'requests'}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-[#FAF7F2] mt-1 font-serif line-clamp-1">
                    {td.detected_model || td.query_text}
                  </h3>
                </div>

                <button
                  onClick={() => handleListProduct(td)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] font-bold text-[10.5px] uppercase tracking-wider shrink-0 transition flex items-center gap-1 cursor-pointer shadow-xs"
                  title="Open Product Form pre-filled with this model"
                >
                  <span>List</span>
                  <ArrowRight className="w-3 h-3 text-[#8A5E12]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D4A24C]/25 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="font-bold text-[#8A5E12] uppercase tracking-wider text-[10.5px]">Status:</label>
            <ThemeSelect
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'demand_logged', label: 'Demand Logged (New)' },
                { value: 'procurement_planned', label: 'Procurement Planned' },
                { value: 'stocked_listed', label: 'Stocked & Listed' },
                { value: 'dismissed', label: 'Dismissed' }
              ]}
              variant="admin"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label className="font-bold text-[#8A5E12] uppercase tracking-wider text-[10.5px]">Source:</label>
            <ThemeSelect
              value={sourceFilter}
              onChange={(val) => {
                setSourceFilter(val);
                setPage(1);
              }}
              options={[
                { value: 'all', label: 'All Sources' },
                { value: 'ai_chat', label: 'AI Consultant Chat' },
                { value: 'catalog_search', label: 'Catalog Search' }
              ]}
              variant="admin"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="font-bold text-[#8A5E12] uppercase tracking-wider text-[10.5px]">Sort By:</label>
          <ThemeSelect
            value={sortOption}
            onChange={(val) => {
              setSortOption(val);
              setPage(1);
            }}
            options={[
              { value: 'frequency', label: 'Most Requested (Frequency)' },
              { value: 'recent', label: 'Most Recent Inquiries' }
            ]}
            variant="admin"
          />
        </div>
      </div>

      {/* Demands Table */}
      <div className="bg-white rounded-2xl border border-[#D4A24C]/25 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#5A6B63] space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#8A5E12]" />
            <p>Loading demand intelligence feed...</p>
          </div>
        ) : demands.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#5A6B63] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#D4A24C]/30 flex items-center justify-center mx-auto text-[#0D3B2A]">
              <Search className="w-6 h-6 text-[#8A5E12]" />
            </div>
            <p className="text-sm font-bold font-serif text-[#0D3B2A]">No Demand Records Found</p>
            <p className="max-w-md mx-auto text-[11px]">
              When visitors ask the AI bot about unstocked hardware models or search for hardware on the site, their
              queries will automatically appear here with frequency metrics.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-[#D4A24C]/20 text-[#0D3B2A] font-serif font-bold uppercase text-[10.5px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Hardware Model & Brand</th>
                  <th className="py-3 px-4">Inquiry / Query Text</th>
                  <th className="py-3 px-4">Demand Frequency</th>
                  <th className="py-3 px-4">Customer / Entity</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4A24C]/15">
                {demands.map((d) => (
                    <tr key={d._id} className="hover:bg-[#FAF7F2]/60 transition">
                      <td className="py-3 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 uppercase">
                              {d.detected_brand || 'Hardware'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-slate-100 text-slate-700">
                              {d.category}
                            </span>
                            {d.is_unstocked && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                                Unstocked
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-sm text-[#0D3B2A] font-serif">
                            {d.detected_model || d.query_text}
                          </p>
                          <span className="text-[10px] text-[#5A6B63] block font-mono">
                            Last asked: {new Date(d.last_queried_at || d.updatedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top max-w-xs">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-800 italic">"{d.sample_user_message || d.query_text}"</p>
                          {d.bot_reply_summary && (
                            <p className="text-[10.5px] text-[#5A6B63] line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-200/70">
                              <span className="font-bold text-[#0D3B2A]">Bot reply: </span>
                              {d.bot_reply_summary}
                            </p>
                          )}
                          <span className="text-[10px] text-slate-400 block">
                            Source: {d.source === 'ai_chat' ? 'AI Chatbot Desk' : 'Catalog Search Bar'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-mono font-bold text-xs">
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          <span>{d.frequency} {d.frequency === 1 ? 'Customer' : 'Customers'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top">
                        {d.user_company || d.user_name ? (
                          <div className="space-y-0.5 text-[11px]">
                            {d.user_company && (
                              <p className="font-bold text-[#0D3B2A] flex items-center gap-1">
                                <Building className="w-3 h-3 text-[#D4A24C]" />
                                {d.user_company}
                              </p>
                            )}
                            {d.user_name && (
                              <p className="text-slate-700 flex items-center gap-1">
                                <UserIcon className="w-3 h-3 text-slate-400" />
                                {d.user_name}
                              </p>
                            )}
                            {d.user_phone && (
                              <p className="text-slate-600 flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {d.user_phone}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Anonymous Visitor</span>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="space-y-2">
                          <ThemeSelect
                            value={d.procurement_status}
                            onChange={(val) => handleStatusChange(d._id, val)}
                            options={[
                              { value: 'demand_logged', label: 'Demand Logged' },
                              { value: 'procurement_planned', label: 'Procurement Planned' },
                              { value: 'stocked_listed', label: 'Stocked & Listed' },
                              { value: 'dismissed', label: 'Dismiss' }
                            ]}
                            variant="admin"
                          />

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleListProduct(d)}
                              className="px-2.5 py-1 rounded-lg bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-[10px] uppercase tracking-wider transition flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Pre-fill product listing form"
                            >
                              <Package className="w-3 h-3 text-[#D4A24C]" />
                              <span>List in Inventory</span>
                            </button>

                            <button
                              onClick={() => handleDelete(d._id)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 transition cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 bg-[#FAF7F2] border-t border-[#D4A24C]/20 flex items-center justify-between text-xs">
            <span className="text-[#5A6B63]">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-white border border-[#D4A24C]/30 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-white border border-[#D4A24C]/30 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
