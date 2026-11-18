import React, { useState, useEffect } from 'react';
import { Repeat, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rentals');
      if (res.data.success) {
        setRentals(res.data.rentals);
      }
    } catch (err) {
      console.error('[Admin Rentals Error]', err);
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
        admin_notes: notes
      });
      if (res.data.success) {
        toast.success('Rental status updated');
        setSelectedRental(null);
        fetchRentals();
      }
    } catch (err) {
      toast.error('Failed to update rental status');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Corporate Rental Fleets</h1>
        <p className="text-slate-500 mt-1">Track active leases, renewal dates, and returned equipment.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading rentals...</div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No rental fleet records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Client / Company</th>
                  <th className="py-3.5 px-4 font-bold">Hardware Fleet</th>
                  <th className="py-3.5 px-4 font-bold">Volume</th>
                  <th className="py-3.5 px-4 font-bold">Tenure</th>
                  <th className="py-3.5 px-4 font-bold">Monthly Rate</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rentals.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block">{r.user?.company_name || r.user?.name}</strong>
                      <span className="text-[11px] text-slate-400">{r.user?.phone}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {r.product?.title || 'Commercial Laptop'}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{r.quantity} Units</td>

                    <td className="py-3.5 px-4 capitalize text-slate-600">{r.tenure.replace(/_/g, ' ')}</td>

                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      ₹{r.monthly_rate.toLocaleString('en-IN')}/mo
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'returned'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRental(r);
                          setStatus(r.status);
                          setNotes(r.admin_notes || '');
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRental && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Manage Rental Fleet</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="active">Active</option>
                <option value="returned">Returned / Closed</option>
                <option value="overdue">Overdue / Follow-up Needed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Notes</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedRental(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
