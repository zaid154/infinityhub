import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Repeat, Calendar, CheckCircle2, Clock } from 'lucide-react';
import api from '../services/api';

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await api.get('/rentals/my-rentals');
        if (res.data.success) {
          setRentals(res.data.rentals);
        }
      } catch (err) {
        console.error('[Fetch Rentals Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Hardware Leases</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your ongoing corporate laptop fleets, tenure renewal dates, and free maintenance status.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading rentals...</div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Repeat className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Active Rental Leases</h3>
          <p className="text-xs text-slate-500">Calculate rental fleet pricing for your developers or office staff.</p>
          <Link
            to="/rental"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Explore Corporate Rental Plans
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {rentals.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Repeat className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    Status: {r.status}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {r.product?.title || 'Corporate Laptop Fleet'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fleet Size: <strong>{r.quantity} Units</strong> • Tenure: <strong>{r.tenure.replace(/_/g, ' ')}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Lease Started: {new Date(r.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right space-y-2 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Monthly Lease Rate</span>
                  <span className="text-xl font-bold text-blue-600 font-mono">
                    ₹{r.monthly_rate.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center md:justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 24-hr on-site replacement active
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
