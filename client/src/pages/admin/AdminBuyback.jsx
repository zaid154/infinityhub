import React, { useState, useEffect } from 'react';
import { Recycle, MessageSquare, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ThemeSelect from '../../components/ThemeSelect';

export default function AdminBuyback() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [notes, setNotes] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/buyback');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error('[Admin Buyback Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      const res = await api.put(`/buyback/${selectedItem._id}`, {
        status,
        offered_price: offeredPrice,
        admin_notes: notes
      });
      if (res.data.success) {
        toast.success('Buyback valuation updated');
        setSelectedItem(null);
        fetchRequests();
      }
    } catch (err) {
      toast.error('Failed to update buyback request');
    }
  };

  return (
    <div className="space-y-6 text-xs select-none">
      <div>
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
          — ITAD ASSET DISPOSITION
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">Corporate Asset Liquidation (Buyback)</h1>
        <p className="text-[#5A6B63] mt-1">Review companies looking to liquidate used laptops, servers, and scrap hardware.</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading buyback requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No asset buyback requests logged.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Company / Contact</th>
                  <th className="py-3.5 px-4 font-bold">Asset Type</th>
                  <th className="py-3.5 px-4 font-bold">Approx Units</th>
                  <th className="py-3.5 px-4 font-bold">Location</th>
                  <th className="py-3.5 px-4 font-bold">Offered Valuation</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block">{item.company_name}</strong>
                      <span className="text-[11px] text-slate-500">
                        {item.contact_person} ({item.phone})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">{item.asset_type}</td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{item.approx_quantity}</td>

                    <td className="py-3.5 px-4 text-slate-600">{item.city}</td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                      {item.offered_price > 0 ? `₹${item.offered_price.toLocaleString('en-IN')}` : 'Pending Quote'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setStatus(item.status);
                            setOfferedPrice(item.offered_price || '');
                            setNotes(item.admin_notes || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#0D3B2A] hover:text-white font-bold text-[11px] transition"
                        >
                          Valuation
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Valuation for {selectedItem.company_name}
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600">
              <p>Lot: {selectedItem.asset_type} ({selectedItem.approx_quantity} Units)</p>
              {selectedItem.description && <p>Description: "{selectedItem.description}"</p>}
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <ThemeSelect
                value={status}
                onChange={(val) => setStatus(val)}
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'inspected', label: 'Inspected' },
                  { value: 'quoted', label: 'Valuation Quoted' },
                  { value: 'accepted', label: 'Accepted (Scheduled for Pickup)' },
                  { value: 'picked_up', label: 'Picked Up & Paid' },
                  { value: 'closed', label: 'Closed' }
                ]}
                variant="admin"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Offered Bulk Valuation (₹)</label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admin Notes</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSelectedItem(null)} className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 font-bold transition">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-6 py-2 rounded-full bg-[#0D3B2A] text-white hover:bg-[#153423] font-bold shadow border border-[#D4A24C]/40 transition">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
