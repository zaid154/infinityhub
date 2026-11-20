import React from 'react';
import { X, Printer, ArrowLeft, ShieldCheck, CheckCircle2, CreditCard } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

/**
 * Converts Indian Rupee number to formal Indian accounting words
 */
function numberToWordsINR(amount) {
  if (!amount || isNaN(amount)) return 'INR Zero Only';
  const num = Math.round(Number(amount));
  if (num === 0) return 'INR Zero Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n) {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10] : '');
  }

  function convertThreeDigits(n) {
    let str = '';
    if (Math.floor(n / 100) > 0) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
    }
    const rem = n % 100;
    if (rem > 0) {
      str += convertTwoDigits(rem);
    }
    return str.trim();
  }

  let crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  let lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  let thousand = Math.floor(rem / 1000);
  rem = rem % 1000;
  let hundred = rem;

  let res = '';
  if (crore > 0) res += convertThreeDigits(crore) + ' Crore ';
  if (lakh > 0) res += convertThreeDigits(lakh) + ' Lakh ';
  if (thousand > 0) res += convertThreeDigits(thousand) + ' Thousand ';
  if (hundred > 0) res += convertThreeDigits(hundred) + ' ';

  return 'INR ' + res.trim() + ' Only';
}

/**
 * Returns official Indian HSN Code for IT hardware
 */
function getHsnCode(item) {
  const title = (item.title || '').toLowerCase();
  if (title.includes('laptop') || title.includes('thinkpad') || title.includes('latitude') || title.includes('elitebook')) {
    return '8471 30 10';
  }
  if (title.includes('monitor') || title.includes('display')) {
    return '8528 52 00';
  }
  if (title.includes('desktop') || title.includes('workstation') || title.includes('optiplex')) {
    return '8471 49 00';
  }
  if (title.includes('ram') || title.includes('gpu') || title.includes('cpu') || title.includes('rtx')) {
    return '8473 30 20';
  }
  return '8471 30 00';
}

function formatInvoiceDate(dateVal) {
  const d = new Date(dateVal || '2026-01-01T00:00:00Z');
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default function InvoiceModal({ order, onClose }) {
  const { settings } = useSettings();
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = order.payment_status === 'paid';
  const totalGst = order.total_gst || 0;
  const halfGst = Math.round(totalGst / 2);

  const formattedDate = formatInvoiceDate(order.createdAt);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex justify-center items-center print:p-0 print:bg-white print:overflow-visible">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] shadow-2xl relative border border-slate-300 overflow-hidden flex flex-col print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none print:max-h-none">
        
        {/* ======================================================== */}
        {/* PERMANENT TOP NAVIGATION & ACTIONS TOOLBAR (FIXED)       */}
        {/* ======================================================== */}
        <div className="shrink-0 bg-[#0D3B2A] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#D4A24C]/40 shadow-md print:hidden">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] font-bold text-xs flex items-center gap-1.5 transition border border-white/20 cursor-pointer active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4A24C]" />
              <span>Back to Orders</span>
            </button>
            <span className="hidden sm:inline-block text-xs text-white/80 font-mono">
              Invoice #{order.invoice_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white transition rounded-full hover:bg-white/10 cursor-pointer"
              title="Close Invoice (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SCROLLABLE OFFICIAL INDIAN B2B GST TAX INVOICE SHEET     */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 text-slate-800 space-y-6 text-xs bg-white print:overflow-visible print:p-0">
          
          {/* Header Banner: Company Info & Document Identifiers */}
          <div className="border border-slate-300 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start gap-6 bg-[#FAF7F2]/40">
            {/* Left: Supplier Legal Identity */}
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-serif font-bold text-base shadow-xs shrink-0">
                  ★
                </div>
                <div>
                  <h1 className="text-base font-serif font-extrabold text-[#0D3B2A] tracking-tight leading-none">
                    {settings?.legal_name?.toUpperCase() || settings?.company_name?.toUpperCase() || 'DEMO INFOTECH'}
                  </h1>
                  <span className="text-[10px] text-[#8A5E12] font-semibold tracking-wide uppercase">
                    {settings?.tagline || 'Enterprise IT Infrastructure & Refurbished Fleets'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                <strong>Registered Facility:</strong> {settings?.registered_address || settings?.address || 'Corporate Headquarters [PLACEHOLDER]'}
              </p>
              <p className="text-[11px] font-mono text-slate-700 pt-0.5">
                <strong>GSTIN:</strong> {settings?.gst_number || '07AAAAA0000A1Z5 [PLACEHOLDER]'} • <strong>State:</strong> {settings?.jurisdiction_city || 'Delhi NCR'}
              </p>
              <p className="text-[11px] text-slate-600">
                <strong>Email:</strong> {settings?.email || 'procurement@example.com [PLACEHOLDER]'} • <strong>Desk:</strong> {settings?.phone || '+91 XXXXX XXXXX [PLACEHOLDER]'}
              </p>
            </div>

            {/* Right: Invoice Type & Metadata */}
            <div className="md:text-right space-y-1.5 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-200">
              <div className="inline-block">
                <span className="text-lg sm:text-xl font-serif font-bold text-[#0D3B2A] block leading-tight">
                  {isPaid ? 'TAX INVOICE' : 'PROFORMA TAX INVOICE'}
                </span>
                <span className="text-[9px] text-slate-500 font-sans block">
                  (Issued under Section 31 of CGST Act, 2017 & Rule 46 of CGST Rules)
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border my-1 bg-white border-slate-300">
                <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                <span className={isPaid ? 'text-emerald-800' : 'text-amber-800'}>
                  {isPaid ? 'Original for Recipient • Paid' : 'Payment Pending • Proforma'}
                </span>
              </div>

              <table className="text-[11px] text-left md:text-right w-full font-mono mt-1">
                <tbody>
                  <tr>
                    <td className="text-slate-500 pr-2">Invoice No:</td>
                    <td className="font-bold text-[#0D3B2A]">{order.invoice_number}</td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 pr-2">Invoice Date:</td>
                    <td className="font-semibold text-slate-700">{formattedDate}</td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 pr-2">Place of Supply:</td>
                    <td className="text-slate-700">Delhi NCR (Code: 07)</td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 pr-2">Reverse Charge:</td>
                    <td className="text-slate-700">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Billed To (Buyer) & Shipped To (Consignee) Dual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Billed To */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8A5E12] block border-b border-slate-200 pb-1">
                Details of Buyer / Billed To:
              </span>
              <h3 className="font-bold text-sm text-[#0D3B2A]">
                {order.shipping_address?.company_name || order.user?.company_name || 'Individual Corporate Client'}
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                <strong>Attn:</strong> {order.shipping_address?.contact_person || order.user?.name || 'Authorized Signatory'}<br />
                {order.shipping_address?.street || 'Corporate Office Address'}, {order.shipping_address?.city || 'Delhi NCR'}, {order.shipping_address?.state || 'Delhi'} - {order.shipping_address?.pincode || '110001'}<br />
                <strong>Phone:</strong> {order.shipping_address?.phone || order.user?.phone || 'On Record'}<br />
                <strong>Email:</strong> {order.user?.email || 'procurement@client.com'}
              </p>
              <div className="pt-1 text-[11px] font-mono">
                <strong>Buyer GSTIN:</strong>{' '}
                <span className="font-bold text-[#0D3B2A]">
                  {order.shipping_address?.gst_number || 'Unregistered / Retail'}
                </span>
                <br />
                <strong>State & Code:</strong> {order.shipping_address?.state || 'Delhi'} (07)
              </div>
            </div>

            {/* Box 2: Shipped To */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8A5E12] block border-b border-slate-200 pb-1">
                Details of Consignee / Shipped To:
              </span>
              <h3 className="font-bold text-sm text-[#0D3B2A]">
                {order.shipping_address?.company_name || order.user?.company_name || 'Delivery Site'}
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                <strong>Site Incharge:</strong> {order.shipping_address?.contact_person || order.user?.name}<br />
                {order.shipping_address?.street || 'Delivery Address'}, {order.shipping_address?.city || 'Delhi NCR'}, {order.shipping_address?.state || 'Delhi'} - {order.shipping_address?.pincode || '110001'}<br />
                <strong>Transport Mode:</strong> Insured Surface Express Transit
              </p>
              <div className="pt-1 text-[11px]">
                <strong>Dispatch Status:</strong>{' '}
                <span className="capitalize font-bold text-[#0D3B2A]">{order.order_status || 'Confirmed'}</span>
                <br />
                <strong>SLA Guarantee:</strong> 24–48h Standby Replacement SLA Active
              </div>
            </div>
          </div>

          {/* Itemized Hardware & Tax Schedule Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-300 text-[#0D3B2A] font-semibold text-[10.5px]">
                  <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Description of Hardware & Equipment</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center font-mono text-[10px] w-24">HSN/SAC</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center font-mono w-14">Qty</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-right font-mono w-24">Unit Rate</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-right font-mono w-28">Taxable Value</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-right font-mono w-20">CGST (9%)</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-right font-mono w-20">SGST (9%)</th>
                  <th className="py-2.5 px-3 text-right font-mono w-28">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items?.map((item, idx) => {
                  const itemGst = item.gst_amount || Math.round((item.total || 0) * 0.18 / 1.18);
                  const itemHalfGst = Math.round(itemGst / 2);
                  const itemTaxable = (item.total || 0) - itemGst;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-slate-900">
                        <div>{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          Grade A+ Enterprise Hardware • MemTest86 & Thermal Stress Lab Verified
                        </div>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-[10px] text-slate-600">
                        {getHsnCode(item)}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono font-bold text-slate-800">
                        {item.quantity} Nos
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono text-slate-700">
                        ₹{item.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono font-semibold text-slate-800">
                        ₹{itemTaxable.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono text-slate-600 text-[11px]">
                        ₹{itemHalfGst.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono text-slate-600 text-[11px]">
                        ₹{itemHalfGst.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0D3B2A]">
                        ₹{item.total?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold border-t border-slate-300 text-slate-800 text-[11px]">
                  <td colSpan={5} className="py-2 px-3 border-r border-slate-300 text-right uppercase tracking-wider font-serif">
                    Subtotal Values:
                  </td>
                  <td className="py-2 px-3 border-r border-slate-300 text-right font-mono">
                    ₹{order.subtotal?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-300 text-right font-mono text-[#8A5E12]">
                    ₹{halfGst.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-300 text-right font-mono text-[#8A5E12]">
                    ₹{halfGst.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-[#0D3B2A]">
                    ₹{(order.subtotal + totalGst).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in Words & Financial Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1">
            {/* Left 7 Columns: Amount in Words + Bank Details */}
            <div className="md:col-span-7 space-y-4">
              {/* Amount in Words */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 block">
                  Total Amount Chargeable (in words):
                </span>
                <p className="font-serif font-bold text-slate-900 text-xs mt-1">
                  {numberToWordsINR(order.grand_total)}
                </p>
              </div>

              {/* Corporate Bank NEFT/RTGS Details */}
              <div className="p-3.5 rounded-xl border border-slate-300 bg-white space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8A5E12] flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    Electronic Wire / NEFT / RTGS Remittance:
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Direct Corporate A/C
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono pt-1 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[9.5px]">Beneficiary Name:</span>
                    <strong>{settings?.bank_details?.account_name || settings?.legal_name || settings?.company_name || 'Demo Infotech Private Limited [PLACEHOLDER]'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9.5px]">Bank Name:</span>
                    <strong>{settings?.bank_details?.bank_name || 'Bank Name [PLACEHOLDER]'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9.5px]">Account Number:</span>
                    <strong className="text-[#0D3B2A]">{settings?.bank_details?.account_number || '00000000000000 [PLACEHOLDER]'}</strong> (Current)
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9.5px]">IFSC Code:</span>
                    <strong className="text-[#0D3B2A]">{settings?.bank_details?.ifsc_code || 'BANK0000000 [PLACEHOLDER]'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9.5px]">Branch:</span>
                    <span>{settings?.bank_details?.branch || 'Corporate Branch [PLACEHOLDER]'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9.5px]">UPI ID:</span>
                    <span>{settings?.bank_details?.upi_id || 'demoinfotech@bank'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Official Calculations Box */}
            <div className="md:col-span-5 border border-slate-300 rounded-xl p-4 bg-slate-50/70 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Subtotal:</span>
                <span className="font-mono font-semibold text-slate-800">
                  ₹{order.subtotal?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Central Tax (CGST 9%):</span>
                <span className="font-mono font-semibold text-slate-800">
                  + ₹{halfGst.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State Tax (SGST 9%):</span>
                <span className="font-mono font-semibold text-slate-800">
                  + ₹{halfGst.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Insured Freight & Dispatch:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {order.delivery_charges ? `+ ₹${order.delivery_charges.toLocaleString('en-IN')}` : 'FREE (Included)'}
                </span>
              </div>

              <div className="pt-2 border-t-2 border-slate-300 flex justify-between items-baseline font-bold">
                <span className="font-serif text-sm text-[#0D3B2A]">INVOICE GRAND TOTAL:</span>
                <span className="font-mono text-lg text-[#8A5E12]">
                  ₹{order.grand_total?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[10px] text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>GST Tax Invoice provided with every order</span>
              </div>
            </div>
          </div>

          {/* Legal Declarations & Authorized Signatory Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-300">
            {/* Terms */}
            <div className="space-y-1 text-[10.5px] text-slate-500 leading-snug">
              <span className="font-bold text-slate-700 block uppercase font-mono text-[10px]">
                Terms & Conditions:
              </span>
              <p>1. Certified enterprise hardware backed by {(settings?.support_sla || '24–48h Standby SLA').replace(/\s*\(subject to sla terms\)/gi, '')} (subject to SLA terms).</p>
              <p>2. Payment due strictly under agreed corporate master service terms.</p>
              <p>3. Input Tax Credit under Section 16(2) of CGST Act subject to portal reflection on GSTR-2B.</p>
              <p>4. All disputes subject to exclusive jurisdiction of courts in {settings?.jurisdiction_city || 'New Delhi'}, India.</p>
            </div>

            {/* Official Stamp & Authorized Signatory */}
            <div className="border border-slate-300 rounded-xl p-4 flex flex-col justify-between text-right bg-white relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-700 block">
                For {settings?.legal_name?.toUpperCase() || settings?.company_name?.toUpperCase() || 'DEMO INFOTECH'}
              </span>

              {/* Digital Seal & Manager Signature Block */}
              <div className="my-2 flex items-center justify-end gap-3 min-h-[48px]">
                {/* Official Seal Image if configured */}
                {settings?.company_seal_url ? (
                  <img
                    src={settings.company_seal_url}
                    alt="Company Seal"
                    className="w-14 h-14 object-contain opacity-90 drop-shadow-xs"
                  />
                ) : (
                  <div className="border-2 border-dashed border-[#D4A24C] text-[#8A5E12] rounded-lg px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider inline-flex items-center gap-1 rotate-[-2deg] bg-[#FAF7F2]">
                    <CheckCircle2 className="w-3 h-3 text-[#0D3B2A]" />
                    <span>DIGITALLY SIGNED & VERIFIED</span>
                  </div>
                )}

                {/* Manager Signature */}
                {settings?.signature_url ? (
                  <img
                    src={settings.signature_url}
                    alt="Authorized Signature"
                    className="h-11 max-w-[140px] object-contain drop-shadow-xs"
                  />
                ) : (
                  <div className="font-serif italic font-bold text-base text-[#0D3B2A] tracking-wider pr-1">
                    {settings?.signatory_name || 'Authorized Signatory [PLACEHOLDER]'}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-1">
                <span className="text-[10.5px] font-bold text-slate-800 block">
                  {settings?.signatory_name || 'Authorized Signatory [PLACEHOLDER]'}
                </span>
                <span className="text-[9px] text-[#8A5E12] block font-semibold">
                  {settings?.signatory_designation || 'Authorized Signatory / Commercial Manager'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* FOOTER ACTIONS BAR (ACCESSIBLE FROM BOTTOM)              */}
        {/* ======================================================== */}
        <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-300 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0D3B2A]" />
            <span>Back to Orders</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs border border-[#D4A24C]/40 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4A24C]" />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}