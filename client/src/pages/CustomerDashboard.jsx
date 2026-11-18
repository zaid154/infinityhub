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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Corporate Client Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome, <strong className="text-slate-800">{user?.name}</strong>{' '}
            {user?.company_name && `(${user.company_name})`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/products"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
          >
            Browse New Hardware
          </Link>
          <Link
            to="/dashboard/profile"
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block font-mono">
              Total Orders
            </span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
              {orders.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block font-mono">
              Active Leases
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
              {rentals.filter((r) => r.status === 'active').length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Repeat className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block font-mono">
              Account Status
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 mt-2 inline-block">
              GST Verified Entity
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            Recent Orders & Tax Invoices
          </h2>
          <Link
            to="/dashboard/orders"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-xs text-slate-500">No hardware purchase orders placed yet.</p>
            <Link to="/products" className="text-xs text-blue-600 font-bold hover:underline">
              Start your first order
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((o) => (
              <div
                key={o._id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">{o.invoice_number}</span>
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
                  <p className="text-[11px] text-slate-500 mt-1">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}{' '}
                    • {o.items?.length || 0} items
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    ₹{o.grand_total.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to={`/dashboard/orders`}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold text-[11px] hover:bg-slate-100 transition"
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
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Repeat className="w-4 h-4 text-emerald-600" />
            Active Laptop Rental Fleets
          </h2>
          <Link
            to="/dashboard/rentals"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading rentals...</div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-xs text-slate-500">No active rental fleets currently.</p>
            <Link to="/rental" className="text-xs text-blue-600 font-bold hover:underline">
              Calculate rental costs for your team
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rentals.slice(0, 3).map((r) => (
              <div
                key={r._id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{r.product?.title || 'Rental Laptop'}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Quantity: <strong>{r.quantity} Units</strong> • Tenure: {r.tenure.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600 font-mono">
                    ₹{r.monthly_rate.toLocaleString('en-IN')}/mo
                  </span>
                  <p className="text-[10px] text-emerald-600 font-semibold">Active Lease</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
