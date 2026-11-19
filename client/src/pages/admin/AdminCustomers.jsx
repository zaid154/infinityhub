import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Building, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/admin/customers');
        if (res.data.success) {
          setCustomers(res.data.customers);
        }
      } catch (err) {
        console.error('[Admin Customers Error]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6 text-xs ">
      <div>
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold block">
          — ENTERPRISE CLIENT REPOSITORY
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0D3B2A] tracking-tight mt-0.5">
          Customer & Corporate Directory
        </h1>
        <p className="text-[#5A6B63] mt-1">Registered corporate entities, enterprise contact persons, and GST verification records.</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No registered customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#D4A24C]/15 text-[#8A5E12] font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Contact Name</th>
                  <th className="py-3.5 px-4 font-bold">Company</th>
                  <th className="py-3.5 px-4 font-bold">Email</th>
                  <th className="py-3.5 px-4 font-bold">Phone</th>
                  <th className="py-3.5 px-4 font-bold">Email Verified</th>
                  <th className="py-3.5 px-4 font-bold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{c.company_name || 'Individual'}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{c.email}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      {c.email_verified ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
