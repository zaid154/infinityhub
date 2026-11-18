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
  MessageSquare
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentInquiries(res.data.recentInquiries || []);
          setRecentOrders(res.data.recentOrders || []);
        }
      } catch (err) {
        console.error('[Admin Analytics Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xs text-slate-400">Loading admin metrics...</div>;
  }

  return (
    <div className="space-y-8 select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — EXECUTIVE OPERATIONS DESK
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Enterprise Fleet Overview
          </h1>
          <p className="text-xs text-[#5A6B63] mt-1">Real-time hardware inventory, quotation leads, and rental fleets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider shadow transition border border-[#D4A24C]/40 flex items-center gap-1.5"
          >
            <span>+ Add New Hardware</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans text-[#8A5E12] uppercase font-bold tracking-wider block">
              Active Stock
            </span>
            <span className="text-2xl font-bold text-[#0D3B2A] font-serif mt-1 block">
              {stats?.totalProducts || 0} Products
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#0D3B2A] border border-[#D4A24C]/30 flex items-center justify-center font-bold shadow-sm">
            <Package className="w-5 h-5 text-[#8A5E12]" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans text-[#8A5E12] uppercase font-bold tracking-wider block">
              Pending RFQs / Leads
            </span>
            <span className="text-2xl font-bold text-[#8A5E12] font-serif mt-1 block">
              {stats?.newInquiries || 0} Pending
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center font-bold shadow-sm">
            <FileText className="w-5 h-5 text-[#8A5E12]" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans text-[#8A5E12] uppercase font-bold tracking-wider block">
              Active Leases
            </span>
            <span className="text-2xl font-bold text-[#0D3B2A] font-serif mt-1 block">
              {stats?.activeRentals || 0} Fleets
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#0D3B2A] border border-[#D4A24C]/30 flex items-center justify-center font-bold shadow-sm">
            <Repeat className="w-5 h-5 text-[#0D3B2A]" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-sans text-[#8A5E12] uppercase font-bold tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl font-bold text-[#0D3B2A] font-serif mt-1 block">
              ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center font-bold shadow-sm">
            <TrendingUp className="w-5 h-5 text-[#8A5E12]" />
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Inquiries & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent RFQs */}
        <div className="bg-white rounded-3xl border border-[#D4A24C]/25 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4A24C]/15 pb-3">
            <h2 className="text-sm font-bold font-serif text-[#0D3B2A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8A5E12]" />
              Latest Corporate RFQs / Leads
            </h2>
            <Link to="/admin/inquiries" className="text-xs text-[#8A5E12] font-bold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No recent inquiries.</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-[#0D3B2A]">{inq.company_name}</h4>
                    <p className="text-[11px] text-[#5A6B63]">
                      {inq.contact_person} ({inq.phone}) • {inq.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inq.status === 'new' ? 'bg-[#F3E8D2] text-[#8A5E12] border border-[#D4A24C]/30' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {inq.status}
                    </span>
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#0D3B2A] text-white hover:bg-[#153423] transition"
                      title="Reply on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D4A24C]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-[#D4A24C]/25 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4A24C]/15 pb-3">
            <h2 className="text-sm font-bold font-serif text-[#0D3B2A] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#0D3B2A]" />
              Recent Purchase Orders
            </h2>
            <Link to="/admin/orders" className="text-xs text-[#8A5E12] font-bold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No recent orders logged.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div
                  key={o._id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-[#0D3B2A] font-mono">{o.invoice_number}</span>
                    <p className="text-[11px] text-[#5A6B63]">
                      {o.shipping_address?.company_name || o.user?.name} • ₹{o.grand_total.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      o.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F3E8D2] text-[#8A5E12]'
                    }`}
                  >
                    {o.payment_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
