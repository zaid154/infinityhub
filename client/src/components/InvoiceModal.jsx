import React from 'react';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-8 sm:p-10 shadow-2xl relative border border-[#D4A24C]/30 my-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-[#FAF7F2] print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3E8D2] text-[#8A5E12] border border-[#D4A24C]/30">
              Official Tax Invoice / Proforma
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs flex items-center gap-2 transition shadow-md border border-[#D4A24C]/40 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 transition rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="pt-6 space-y-8 text-xs text-slate-700">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
            <div>
              <BrandLogo theme="light" size="md" />
              <p className="text-[11px] text-[#5A6B63] mt-2 max-w-xs leading-relaxed">
                Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR, India.<br />
                <strong>GSTIN:</strong> 07AAACN8412K1Z9 • <strong>Desk:</strong> +91 98765 43210<br />
                <strong>Email:</strong> procurement@novainfotech.in
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xl font-bold font-serif text-[#0D3B2A] block">
                {order.payment_status === 'paid' ? 'TAX INVOICE' : 'PROFORMA INVOICE'}
              </span>
              <p className="font-mono text-sm font-bold text-[#8A5E12]">{order.invoice_number}</p>
              <p className="text-[11px] text-slate-500">
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F3E8D2] text-[#8A5E12]'
              }`}>
                Payment: {order.payment_status}
              </span>
            </div>
          </div>

          {/* Billed To / Shipped To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF7F2] p-5 rounded-2xl border border-[#D4A24C]/20">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A5E12] block mb-1">
                Billed & Dispatched To:
              </span>
              <h4 className="font-bold text-sm text-[#0D3B2A]">
                {order.shipping_address?.company_name || order.user?.company_name || 'Individual Client'}
              </h4>
              <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                Attn: {order.shipping_address?.contact_person || order.user?.name}<br />
                {order.shipping_address?.street}, {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}<br />
                Phone: {order.shipping_address?.phone || order.user?.phone}
              </p>
              {order.shipping_address?.gst_number && (
                <p className="font-mono font-bold text-[#0D3B2A] mt-1 text-[11px]">
                  Client GSTIN: {order.shipping_address.gst_number}
                </p>
              )}
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A5E12] block mb-1">
                Dispatch SLA & Terms:
              </span>
              <p className="text-[11px] text-slate-600">Standard 24–48h Hardware Standby Replacement SLA</p>
              <p className="text-[11px] text-slate-600">Place of Supply: Delhi NCR (07)</p>
              <p className="text-[11px] text-slate-600">Dispatch Status: <strong className="capitalize text-[#0D3B2A]">{order.order_status}</strong></p>
            </div>
          </div>

          {/* Itemized Hardware Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-slate-200 text-[#8A5E12] font-mono uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Hardware Description</th>
                  <th className="py-3 px-4 font-bold text-center">Qty</th>
                  <th className="py-3 px-4 font-bold text-right">Unit Rate</th>
                  <th className="py-3 px-4 font-bold text-right">GST Rate</th>
                  <th className="py-3 px-4 font-bold text-right">Taxable Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      ₹{item.price?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#8A5E12]">
                      {item.gst_rate}% (₹{item.gst_amount?.toLocaleString('en-IN')})
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#0D3B2A]">
                      ₹{item.total?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="space-y-1.5 max-w-sm text-[11px] text-slate-500">
              <p className="flex items-center gap-1 font-semibold text-[#0D3B2A]">
                <ShieldCheck className="w-4 h-4 text-[#8A5E12]" />
                100% Tax Deductible GSTR-2B Input Tax Credit
              </p>
              <p>Payment via Bank Wire / NEFT / RTGS to Nova Infotech Solutions.</p>
              <p>Certified 30-Point Testing Protocol & Diagnostic Warranty Included.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-800">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total GST (18%):</span>
                <span className="font-mono font-bold text-slate-800">+ ₹{order.total_gst?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Logistics:</span>
                <span className="font-mono font-bold text-slate-800">+ ₹{order.delivery_charges?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-300 font-bold text-sm text-[#0D3B2A]">
                <span>Grand Total:</span>
                <span className="font-mono text-base text-[#8A5E12]">₹{order.grand_total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
