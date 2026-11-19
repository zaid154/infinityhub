/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function RefundCancellationPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';
  const supportEmail = company?.support_email || company?.email || 'support@example.com [PLACEHOLDER]';

  const toc = [
    { id: 'cancellation-terms', title: 'Commercial Order Cancellation Windows' },
    { id: 'doa-policy', title: 'Dead-on-Arrival (DOA) 48-Hour Protocol' },
    { id: 'rental-deposit-refund', title: 'Rental Security Deposit Refund Process' },
    { id: 'return-eligibility', title: 'Hardware Return Eligibility & RMA Authorization' },
    { id: 'refund-mode-timelines', title: 'Refund Banking Modes & Statutory Timelines' },
    { id: 'non-refundable', title: 'Non-Refundable Line Items' }
  ];

  return (
    <LegalLayout
      title="Refund, Cancellation & Return Policy"
      subtitle="Standard commercial refund workflows, DOA protocols, and corporate order cancellation rules."
      policyKey="refund-policy"
      toc={toc}
    >
      <section id="cancellation-terms" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Commercial Order Cancellation Windows
        </h2>
        <p>
          Corporate clients of <strong>{legal}</strong> (<strong>"{brand}"</strong>) may cancel purchase orders subject to the following staging criteria:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Pre-Dispatch Cancellation:</strong> If a cancellation notice is submitted in writing prior to hardware dispatch and logistics carrier handover, <strong>100% of the advance consideration</strong> shall be refunded without any penalty.</li>
          <li><strong>In-Transit Cancellation:</strong> If an order is cancelled after transit handover and carrier tracking number generation, return freight logistics charges and a <strong>5% administrative restocking fee</strong> shall be deducted from the refund.</li>
          <li><strong>Post-Delivery:</strong> Once hardware has been accepted at the consignee’s facility, cancellations are governed by the RMA and DOA provisions set forth below.</li>
        </ul>
      </section>

      <section id="doa-policy" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. Dead-on-Arrival (DOA) 48-Hour Protocol
        </h2>
        <p>
          We maintain an uncompromising zero-defect policy. If any delivered laptop, monitor, or server exhibits an inoperable hardware state upon unboxing:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>The Client must notify our Central Support Desk at <a href={`mailto:${supportEmail}`} className="text-[#8A5E12] underline">{supportEmail}</a> within <strong>48 hours</strong> of carrier delivery timestamp.</li>
          <li>Our technical engineering desk shall immediately issue a Return Merchandise Authorization (RMA) ticket.</li>
          <li>{brand} shall arrange free priority doorstep reverse pickup and dispatch an identical replacement machine on a <strong>1-to-1 immediate swap basis</strong>, or issue a <strong>100% full refund</strong> if replacement stock is unavailable.</li>
        </ol>
      </section>

      <section id="rental-deposit-refund" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Rental Security Deposit Refund Process
        </h2>
        <p>
          Where a refundable security deposit was collected under an operating equipment rental lease:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Upon completion of the lease term and receipt of the hardware fleet at our warehouse, a Joint Physical Inspection Report is concluded within <strong>3 business days</strong>.</li>
          <li>Subject to verification that machines are free of unapproved physical damage or missing components, 100% of the deposit is remitted via NEFT/RTGS to the Client’s verified corporate bank account within <strong>5 to 7 business days</strong>.</li>
        </ul>
      </section>

      <section id="return-eligibility" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Hardware Return Eligibility & RMA Authorization
        </h2>
        <p>
          No returned shipment shall be accepted at our fulfillment depots without an active, officially issued RMA number printed on the outer packing slip.
        </p>
        <p>
          Returned units must include all original bundled accessories, factory power adapters, internal battery packs, and mounting brackets in clean, non-defaced condition.
        </p>
      </section>

      <section id="refund-mode-timelines" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Refund Banking Modes & Statutory Timelines
        </h2>
        <p>
          All approved refunds are processed strictly through official banking channels:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Electronic Wire (NEFT/RTGS):</strong> 3 to 5 business days from approval date.</li>
          <li><strong>Corporate Credit Card / Net Banking:</strong> 5 to 7 banking days, subject to the issuing bank's clearing cycle.</li>
          <li><strong>GST Credit Note:</strong> A formal GST Credit Note under Section 34 of the CGST Act is issued alongside the refund remittance advice.</li>
        </ul>
      </section>

      <section id="non-refundable" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          6. Non-Refundable Line Items
        </h2>
        <p>
          The following customized line items are non-refundable once performed:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Custom BIOS enterprise flashing, asset tagging, and proprietary laser engraving requested by the Client.</li>
          <li>Specialized one-time on-site deployment engineer visits and physical rack installation labor fees.</li>
        </ul>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Escalations & Claims:</strong> Contact our Desk at <a href={`mailto:${supportEmail}`} className="text-[#8A5E12] underline">{supportEmail}</a>. Jurisdiction: <strong>{jurisdiction}</strong>, India.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
