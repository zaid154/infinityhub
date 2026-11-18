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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Enterprise Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time hardware inventory, quotation leads, and rental fleets.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/new"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
              Live Stock
            </span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
              {stats?.totalProducts || 0} Products
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
              New RFQs / Inquiries
            </span>
            <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
              {stats?.newInquiries || 0} Pending
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
              Active Rentals
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
              {stats?.activeRentals || 0} Fleets
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Repeat className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl font-extrabold text-blue-600 font-mono mt-1 block">
              ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Inquiries & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent RFQs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Latest Corporate RFQs / Leads
            </h2>
            <Link to="/admin/inquiries" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
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
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{inq.company_name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {inq.contact_person} ({inq.phone}) • {inq.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inq.status === 'new' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {inq.status}
                    </span>
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                      title="Reply on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Recent Purchase Orders
            </h2>
            <Link to="/admin/orders" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
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
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 font-mono">{o.invoice_number}</span>
                    <p className="text-[11px] text-slate-500">
                      {o.shipping_address?.company_name || o.user?.name} • ₹{o.grand_total.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      o.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
