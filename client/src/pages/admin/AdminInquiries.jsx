import React, { useState, useEffect } from 'react';
import { FileText, MessageSquare, Phone, Mail, Building, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await api.get('/inquiries', { params });
      if (res.data.success) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      console.error('[Fetch Inquiries Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleUpdate = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await api.put(`/inquiries/${selectedInquiry._id}`, {
        status: newStatus,
        admin_notes: adminNotes
      });
      if (res.data.success) {
        toast.success('Inquiry updated successfully');
        setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (err) {
      toast.error('Failed to update inquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Corporate RFQs & Inquiries</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track procurement leads, update quotation statuses, and connect directly on WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="font-semibold text-slate-500">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-blue-600"
          >
            <option value="all">All Inquiries</option>
            <option value="new">New (Uncontacted)</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="converted">Converted (Won)</option>
            <option value="closed">Closed / Lost</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No inquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Company / Contact</th>
                  <th className="py-3.5 px-4 font-bold">Requirement</th>
                  <th className="py-3.5 px-4 font-bold">Quantity</th>
                  <th className="py-3.5 px-4 font-bold">Location</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block">{inq.company_name}</strong>
                      <span className="text-[11px] text-slate-500">
                        {inq.contact_person} ({inq.phone})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 capitalize">
                        {inq.inquiry_type.replace(/_/g, ' ')}
                      </span>
                      {inq.product_ref && (
                        <span className="text-[11px] text-slate-400 block line-clamp-1">
                          Ref: {inq.product_ref}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{inq.quantity}</td>

                    <td className="py-3.5 px-4 text-slate-600">{inq.city || 'N/A'}</td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inq.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : inq.status === 'converted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                          title="Message on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setNewStatus(inq.status);
                            setAdminNotes(inq.admin_notes || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition"
                        >
                          Manage
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

      {/* Edit Inquiry Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 text-xs border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Manage Inquiry: {selectedInquiry.company_name}
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600">
              <p>Contact: <strong>{selectedInquiry.contact_person}</strong> ({selectedInquiry.phone})</p>
              <p>Email: {selectedInquiry.email || 'N/A'}</p>
              <p>Requirement: {selectedInquiry.inquiry_type} ({selectedInquiry.quantity})</p>
              {selectedInquiry.message && <p>Notes: "{selectedInquiry.message}"</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="converted">Converted (Won Deal)</option>
                <option value="closed">Closed / Lost</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
              <textarea
                rows="3"
                placeholder="e.g. Sent proforma quote of ₹18,500/unit for 20 ThinkPads..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
