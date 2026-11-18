import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, FileText, CheckCircle2, Clock } from 'lucide-react';
import api from '../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('[Fetch Orders Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal Overview</span>
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Order History & Invoices</h1>
        <p className="text-xs text-slate-500 mt-1">
          Download GST tax invoices and track order dispatch statuses.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500">Explore our hardware inventory to place your first wholesale order.</p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Browse Hardware Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 text-xs">
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900">{o.invoice_number}</span>
                  <p className="text-slate-500 mt-0.5">
                    Placed on{' '}
                    {new Date(o.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      o.payment_status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Payment: {o.payment_status}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    Status: {o.order_status}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 text-xs">
                {o.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-slate-800 font-semibold">
                      {item.title} <span className="text-slate-400 font-normal">× {item.quantity}</span>
                    </span>
                    <span className="font-mono text-slate-700 font-semibold">
                      ₹{item.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-end gap-4 text-xs">
                <div className="text-slate-500 space-y-0.5">
                  <p>Subtotal: ₹{o.subtotal?.toLocaleString('en-IN')}</p>
                  <p>GST Total: + ₹{o.total_gst?.toLocaleString('en-IN')}</p>
                  <p>Delivery: + ₹{o.delivery_charges?.toLocaleString('en-IN')}</p>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase">Grand Total</span>
                  <span className="text-lg font-bold text-blue-600 font-mono">
                    ₹{o.grand_total?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
