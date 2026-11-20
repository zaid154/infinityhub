import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Repeat, CheckCircle2 } from 'lucide-react';
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
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A5E12] hover:text-[#0D3B2A] transition"
      >
        <ArrowLeft className="w-4 h-4 text-[#D4A24C]" />
        <span>Back to Portal Overview</span>
      </Link>

      <div className="border-b border-[#D4A24C]/25 pb-4">
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
          — ACTIVE INFRASTRUCTURE LEASING
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
          Active Hardware Leases & Fleet Subscriptions
        </h1>
        <p className="text-xs text-[#5A6B63] mt-1">
          Monitor your ongoing corporate laptop fleets, tenure renewal dates, and guaranteed 24–48h standby replacement SLA.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-[#5A6B63]">Loading rentals...</div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#D4A24C]/25 p-8 space-y-3">
          <Repeat className="w-12 h-12 text-[#D4A24C] mx-auto" />
          <h3 className="text-sm font-bold font-serif text-[#0D3B2A]">No Active Rental Leases</h3>
          <p className="text-xs text-[#5A6B63]">Calculate rental fleet pricing for your developers or office staff.</p>
          <Link
            to="/rental"
            className="inline-block px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#124e38] text-white font-bold text-xs shadow-md tracking-wider uppercase transition border border-[#D4A24C]/40"
          >
            Explore Corporate Rental Plans
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {rentals.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-3xl border border-[#D4A24C]/25 p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#D4A24C]/60 transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] text-[#0D3B2A] flex items-center justify-center shrink-0 border border-[#D4A24C]/30">
                  <Repeat className="w-7 h-7 text-[#8A5E12]" />
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#8A5E12] uppercase border border-[#D4A24C]/30">
                    Status: {r.status}
                  </span>
                  <h3 className="text-base font-bold font-serif text-[#0D3B2A]">
                    {r.product?.title || 'Corporate Laptop Fleet'}
                  </h3>
                  <p className="text-xs text-[#5A6B63]">
                    Fleet Size: <strong>{r.quantity} Units</strong> • Tenure: <strong>{r.tenure.replace(/_/g, ' ')}</strong>
                  </p>
                  <p className="text-[11px] text-[#5A6B63]/80">
                    Lease Started: {new Date(r.start_date || r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {r.end_date && ` • Renews: ${new Date(r.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </p>
                  {r.admin_notes && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/25 text-[11px] text-[#5A6B63]">
                      <strong className="text-[#0D3B2A]">SLA Provisioning Note:</strong> {r.admin_notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-left md:text-right space-y-2 border-t md:border-t-0 pt-4 md:pt-0 border-[#D4A24C]/15">
                <div>
                  <span className="text-[#8A5E12] text-[10px] uppercase font-semibold block">Monthly Lease Rate</span>
                  <span className="text-xl font-bold text-[#0D3B2A] font-mono">
                    ₹{r.monthly_rate.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 font-semibold flex items-center md:justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 24-hr on-site replacement active
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
