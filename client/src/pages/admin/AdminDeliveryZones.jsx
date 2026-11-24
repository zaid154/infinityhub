import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminDeliveryZones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    zone_name: '',
    cities: '',
    states: '',
    pincode_prefixes: '',
    estimated_days: '2-3 Business Days',
    delivery_charge: 0,
    is_active: true
  });

  const fetchZones = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.get('/settings/delivery-zones');
      if (res.data?.success) {
        setZones(res.data.zones);
      }
    } catch (err) {
      console.error('[Fetch Zones Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    api.get('/settings/delivery-zones')
      .then((res) => {
        if (isMounted && res.data?.success) {
          setZones(res.data.zones);
        }
      })
      .catch((err) => {
        console.error('[Fetch Zones Error]', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      zone_name: '',
      cities: '',
      states: '',
      pincode_prefixes: '',
      estimated_days: '2-3 Business Days',
      delivery_charge: 0,
      is_active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (zone) => {
    setEditingId(zone._id);
    setFormData({
      zone_name: zone.zone_name,
      cities: (zone.cities || []).join(', '),
      states: (zone.states || []).join(', '),
      pincode_prefixes: (zone.pincode_prefixes || []).join(', '),
      estimated_days: zone.estimated_days || '2-3 Business Days',
      delivery_charge: zone.delivery_charge,
      is_active: zone.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/settings/delivery-zones/${editingId}`, formData);
        if (res.data.success) {
          toast.success('Zone updated');
          setShowModal(false);
          fetchZones();
        }
      } else {
        const res = await api.post('/settings/delivery-zones', formData);
        if (res.data.success) {
          toast.success('Zone created');
          setShowModal(false);
          fetchZones();
        }
      }
    } catch {
      toast.error('Failed to save zone');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this delivery zone?')) return;
    try {
      const res = await api.delete(`/settings/delivery-zones/${id}`);
      if (res.data.success) {
        toast.success('Zone deleted');
        fetchZones();
      }
    } catch {
      toast.error('Failed to delete zone');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Delivery Logistics Zones</h1>
          <p className="text-slate-500 mt-1">Configure shipping charges per geographical region or metro city.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#124e38] text-white font-bold text-xs shadow flex items-center gap-1.5 transition tracking-wider uppercase"
        >
          <Plus className="w-4 h-4 text-[#D4A24C]" />
          <span>Add Delivery Zone</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading delivery zones...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Zone Name</th>
                  <th className="py-3.5 px-4 font-bold">Covered Cities</th>
                  <th className="py-3.5 px-4 font-bold">Delivery Charge</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zones.map((z) => (
                  <tr key={z._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{z.zone_name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{z.cities?.join(', ')}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{z.delivery_charge}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          z.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {z.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(z)}
                          className="min-h-9 min-w-9 flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-[#0D3B2A] transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(z._id)}
                          className="min-h-9 min-w-9 flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-[calc(100vw-1.5rem)] sm:w-full p-5 sm:p-7 shadow-2xl space-y-4 border border-slate-200 max-h-[90dvh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">
              {editingId ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Zone Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi NCR (Local Hub)"
                  value={formData.zone_name}
                  onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cities (Comma Separated) *</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Delhi, Noida, Gurgaon, Faridabad"
                  value={formData.cities}
                  onChange={(e) => setFormData({ ...formData, cities: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">States (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi, NCR, Haryana, Uttar Pradesh"
                  value={formData.states}
                  onChange={(e) => setFormData({ ...formData, states: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pincode Prefixes (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 110, 11, 201, 121, 122"
                  value={formData.pincode_prefixes}
                  onChange={(e) => setFormData({ ...formData, pincode_prefixes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Charge (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.delivery_charge}
                    onChange={(e) => setFormData({ ...formData, delivery_charge: Number(e.target.value) })}
                    className="w-full min-h-11 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base sm:text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transit SLA</label>
                  <input
                    type="text"
                    placeholder="e.g. Same-Day / 24 Hours"
                    value={formData.estimated_days}
                    onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
                    className="w-full min-h-11 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="accent-[#0D3B2A]"
                />
                <span className="font-semibold text-slate-700">Active</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#124e38] text-white font-bold text-xs shadow tracking-wider uppercase transition"
                >
                  Save Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
