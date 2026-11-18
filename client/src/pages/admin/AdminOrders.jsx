import React, { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, Truck, CheckCircle2, Eye, Edit2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('[Admin fetch orders error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    try {
      const res = await api.put(`/orders/${selectedOrder._id}/status`, {
        order_status: orderStatus,
        payment_status: paymentStatus
      });
      if (res.data.success) {
        toast.success('Order status updated');
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Orders & Tax Invoices</h1>
          <p className="text-xs text-slate-500 mt-1">Manage purchase orders, payments, and dispatch tracking.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No orders logged.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Invoice / Date</th>
                  <th className="py-3.5 px-4 font-bold">Client / Company</th>
                  <th className="py-3.5 px-4 font-bold">Items Count</th>
                  <th className="py-3.5 px-4 font-bold">Amount</th>
                  <th className="py-3.5 px-4 font-bold">Payment</th>
                  <th className="py-3.5 px-4 font-bold">Dispatch Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono">
                      <strong className="text-slate-900 block">{o.invoice_number}</strong>
                      <span className="text-[10px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block">
                        {o.shipping_address?.company_name || o.user?.company_name || 'Individual'}
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        {o.shipping_address?.contact_person || o.user?.name} ({o.shipping_address?.phone || o.user?.phone})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {o.items?.length || 0} hardware items
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{o.grand_total.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.payment_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                        {o.order_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setOrderStatus(o.order_status);
                          setPaymentStatus(o.payment_status);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 text-xs border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Manage Order: {selectedOrder.invoice_number}
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600">
              <p>Client: <strong>{selectedOrder.shipping_address?.company_name || selectedOrder.user?.name}</strong></p>
              <p>Total: <strong>₹{selectedOrder.grand_total.toLocaleString('en-IN')}</strong></p>
              <p>Shipping To: {selectedOrder.shipping_address?.street}, {selectedOrder.shipping_address?.city}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dispatch / Order Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid (Verified)</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
