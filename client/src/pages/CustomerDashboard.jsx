import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Repeat,
  User,
  FileText,
  ArrowRight,
  Package,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, rentalsRes] = await Promise.all([
          api.get('/orders/my-orders'),
          api.get('/rentals/my-rentals')
        ]);
        if (ordersRes.data.success) setOrders(ordersRes.data.orders);
        if (rentalsRes.data.success) setRentals(rentalsRes.data.rentals);
      } catch (err) {
        console.error('[Dashboard fetch error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D4A24C]/25">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
            — ENTERPRISE CLIENT OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
            Corporate Client Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6B63] mt-1">
            Welcome, <strong className="text-[#0D3B2A]">{user?.name}</strong>{' '}
            {user?.company_name && `(${user.company_name})`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider shadow transition border border-[#D4A24C]/40"
          >
            Browse New Hardware
          </Link>
          <Link
            to="/dashboard/profile"
            className="px-4 py-2.5 rounded-full border border-[#D4A24C]/30 text-[#0D3B2A] font-bold text-xs hover:bg-[#FAF7F2] transition"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8A5E12] font-bold uppercase tracking-wider block font-sans">
              Total Orders
            </span>
            <span className="text-2xl font-bold text-[#0D3B2A] font-serif mt-1 block">
              {orders.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#0D3B2A] border border-[#D4A24C]/30 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6 text-[#8A5E12]" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8A5E12] font-bold uppercase tracking-wider block font-sans">
              Active Leases
            </span>
            <span className="text-2xl font-bold text-[#0D3B2A] font-serif mt-1 block">
              {rentals.filter((r) => r.status === 'active').length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#0D3B2A] border border-[#D4A24C]/30 flex items-center justify-center font-bold">
            <Repeat className="w-6 h-6 text-[#0D3B2A]" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8A5E12] font-bold uppercase tracking-wider block font-sans">
              Account Status
            </span>
            <span className="text-xs font-bold text-[#0D3B2A] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#D4A24C]/40 mt-2 inline-block">
              GST Verified Entity
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6 text-[#8A5E12]" />
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl border border-[#D4A24C]/25 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D4A24C]/15 pb-4">
          <h2 className="text-base font-bold font-serif text-[#0D3B2A] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#8A5E12]" />
            Recent Orders & Tax Invoices
          </h2>
          <Link
            to="/dashboard/orders"
            className="text-xs font-bold text-[#8A5E12] hover:text-[#0D3B2A] flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-[#5A6B63]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-xs text-[#5A6B63]">No hardware purchase orders placed yet.</p>
            <Link to="/products" className="text-xs text-[#8A5E12] font-bold hover:underline">
              Start your first order
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((o) => (
              <div
                key={o._id}
                className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0D3B2A] font-mono">{o.invoice_number}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        o.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.payment_status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A6B63] mt-1">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}{' '}
                    • {o.items?.length || 0} items
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#0D3B2A] font-mono">
                    ₹{o.grand_total.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to={`/dashboard/orders`}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#D4A24C]/40 text-[#0D3B2A] font-bold text-[11px] hover:bg-[#FAF7F2] transition shadow-xs"
                  >
                    View Invoice
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Rental Leases */}
      <div className="bg-white rounded-3xl border border-[#D4A24C]/25 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D4A24C]/15 pb-4">
          <h2 className="text-base font-bold font-serif text-[#0D3B2A] flex items-center gap-2">
            <Repeat className="w-4 h-4 text-[#8A5E12]" />
            Active Laptop Rental Fleets
          </h2>
          <Link
            to="/dashboard/rentals"
            className="text-xs font-bold text-[#8A5E12] hover:text-[#0D3B2A] flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A24C]" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-[#5A6B63]">Loading rentals...</div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-xs text-[#5A6B63]">No active rental fleets currently.</p>
            <Link to="/rental" className="text-xs text-[#8A5E12] font-bold hover:underline">
              Calculate rental costs for your team
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rentals.slice(0, 3).map((r) => (
              <div
                key={r._id}
                className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-[#0D3B2A] font-serif">{r.product?.title || 'Rental Laptop'}</h4>
                  <p className="text-[11px] text-[#5A6B63] mt-0.5">
                    Quantity: <strong>{r.quantity} Units</strong> • Tenure: {r.tenure.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#0D3B2A] font-mono">
                    ₹{r.monthly_rate.toLocaleString('en-IN')}/mo
                  </span>
                  <p className="text-[10px] text-emerald-700 font-semibold">Active Lease</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
