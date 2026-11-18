import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, FileText, CheckCircle2, Clock, Printer } from 'lucide-react';
import api from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingInvoice, setViewingInvoice] = useState(null);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8 select-none">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A5E12] hover:text-[#0D3B2A] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal Overview</span>
      </Link>

      <div className="border-b border-[#D4A24C]/25 pb-4">
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
          — CORPORATE ACCOUNTING & PROCUREMENT
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
          Order History & Tax Invoices
        </h1>
        <p className="text-xs text-[#5A6B63] mt-1">
          Download GSTR-2B compliant tax invoices and track hardware dispatch timelines.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#D4A24C]/25 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#D4A24C]/50 mx-auto" />
          <h3 className="text-sm font-bold font-serif text-[#0D3B2A]">No Orders Placed Yet</h3>
          <p className="text-xs text-[#5A6B63]">Explore our hardware inventory to place your first wholesale order.</p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs uppercase tracking-wider transition shadow border border-[#D4A24C]/40"
          >
            Browse Hardware Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-3xl border border-[#D4A24C]/25 p-6 sm:p-7 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4A24C]/15 pb-4 text-xs">
                <div>
                  <span className="font-mono font-bold text-sm text-[#0D3B2A]">{o.invoice_number}</span>
                  <p className="text-[#5A6B63] mt-0.5 text-[11px]">
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
                        : 'bg-[#F3E8D2] text-[#8A5E12]'
                    }`}
                  >
                    Payment: {o.payment_status}
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF7F2] text-[#0D3B2A] border border-[#D4A24C]/30">
                    Status: {o.order_status}
                  </span>

                  <button
                    onClick={() => setViewingInvoice(o)}
                    className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F3E8D2] text-[#0D3B2A] border border-[#D4A24C]/35 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#8A5E12]" />
                    <span>View / Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 text-xs">
                {o.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <span className="text-slate-800 font-semibold">
                      {item.title} <span className="text-slate-400 font-normal">× {item.quantity}</span>
                    </span>
                    <span className="font-mono text-[#0D3B2A] font-bold">
                      ₹{item.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="pt-4 border-t border-[#D4A24C]/15 flex flex-wrap justify-between items-end gap-4 text-xs">
                <div className="text-[#5A6B63] space-y-0.5 text-[11px]">
                  <p>Subtotal: ₹{o.subtotal?.toLocaleString('en-IN')}</p>
                  <p>GST Total (18%): + ₹{o.total_gst?.toLocaleString('en-IN')}</p>
                  <p>Delivery: + ₹{o.delivery_charges?.toLocaleString('en-IN')}</p>
                </div>

                <div className="text-right">
                  <span className="text-[#8A5E12] block text-[10px] font-sans font-bold uppercase tracking-wider">Grand Total</span>
                  <span className="text-xl font-bold text-[#0D3B2A] font-serif">
                    ₹{o.grand_total?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {viewingInvoice && (
        <InvoiceModal order={viewingInvoice} onClose={() => setViewingInvoice(null)} />
      )}
    </div>
  );
}
