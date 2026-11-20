/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function TermsConditionsPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const gstin = company?.gst_number || '07AAAAA0000A1Z5 [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';

  const toc = [
    { id: 'eligibility', title: 'Commercial Eligibility & B2B Mandate' },
    { id: 'quotations-orders', title: 'Quotations, Purchase Orders & Acceptance' },
    { id: 'pricing-gst', title: 'Pricing Architecture & GST Invoicing' },
    { id: 'payment-modes', title: 'Commercial Payment Terms & Wire Remittance' },
    { id: 'title-risk', title: 'Passage of Title & Risk of Loss' },
    { id: 'warranty-disclaimers', title: 'Hardware Warranties & Disclaimers' },
    { id: 'liability', title: 'Limitation of Corporate Liability' },
    { id: 'indemnity', title: 'Enterprise Indemnification' },
    { id: 'intellectual-property', title: 'Intellectual Property & OEM Trademarks' },
    { id: 'arbitration-governing-law', title: 'Arbitration & Governing Law (Indian Act 1996)' }
  ];

  return (
    <LegalLayout
      title="Terms of Commercial Sale & Supply"
      subtitle="Standard terms governing B2B hardware purchase, enterprise quotations, and wholesale IT supply."
      policyKey="terms"
      toc={toc}
    >
      <section id="eligibility" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Commercial Eligibility & B2B Mandate
        </h2>
        <p>
          These Terms of Commercial Sale and Supply (<strong>"Terms"</strong>) constitute a binding commercial agreement entered into pursuant to the <em>Indian Contract Act, 1872</em> between <strong>{legal}</strong> (operating as <strong>"{brand}"</strong>, hereinafter the <strong>"Vendor"</strong>, <strong>"Company"</strong>, or <strong>"we"</strong>) and the corporate purchaser, proprietorship, LLP, or registered enterprise (hereinafter the <strong>"Client"</strong> or <strong>"Buyer"</strong>).
        </p>
        <p>
          Our catalog, quotation engines, and order portals are strictly intended for <strong>Business-to-Business (B2B)</strong> commercial transactions. By accessing this platform or generating a Request for Quotation (RFQ), the Client explicitly represents and warrants that it is purchasing IT hardware solely for commercial deployment, workforce provisioning, or institutional use, and not as a consumer under the <em>Consumer Protection Act, 2019</em>.
        </p>
      </section>

      <section id="quotations-orders" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. Quotations, Purchase Orders & Contract Formation
        </h2>
        <p>
          Any quotation, catalog rate card, or online estimate generated via the {brand} portal constitutes an <em>invitation to treat</em>. A contract is formed only upon:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Issuance of an official Purchase Order (PO) by the Client bearing its corporate seal and authorized signature; and</li>
          <li>Written acceptance or Proforma Tax Invoice confirmation issued by the Vendor.</li>
        </ol>
        <p>
          Quotations remain valid for a period of <strong>7 calendar days</strong> from the date of issuance, subject to immediate warehouse stock availability and foreign currency exchange fluctuations for imported enterprise components.
        </p>
      </section>

      <section id="pricing-gst" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Pricing Architecture & Statutory GST Invoicing
        </h2>
        <p>
          Unless expressly stated in an itemized quotation, all listed product prices are exclusive of Goods and Services Tax (GST).
        </p>
        <p>
          In accordance with Section 31 of the <em>Central Goods and Services Tax Act, 2017 (CGST Act)</em>, {brand} issues a formal statutory GST Tax Invoice with every completed transaction. All invoices bear the Vendor's GSTIN (<strong>{gstin}</strong>) and the Client’s registered 15-character GSTIN. Taxes are charged at prevailing statutory rates: 18% for computers, workstations, monitors, and components; 5% for specified ITAD and scrap categories.
        </p>
        <p className="text-xs text-slate-500 italic">
          *Note: While {brand} regularly uploads outward supply statements via GSTR-1 to enable recipient reflection on GSTR-2B, credit eligibility remains subject to compliance under Section 16 of the CGST Act.
        </p>
      </section>

      <section id="payment-modes" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Commercial Payment Terms & Wire Remittance
        </h2>
        <p>
          Payments must be made in Indian National Rupees (INR) through approved banking channels:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Direct Electronic Funds Transfer:</strong> National Electronic Funds Transfer (NEFT), Real Time Gross Settlement (RTGS), or Corporate Immediate Payment Service (IMPS) to the Company's designated corporate bank account.</li>
          <li><strong>Corporate Payment Gateway:</strong> Approved corporate credit cards, net banking, or verified UPI through our encrypted payment gateway partner.</li>
          <li><strong>Credit Terms:</strong> Net-15 or Net-30 credit lines are extended exclusively to vetted enterprise accounts subject to credit evaluation and formal Master Service Agreement (MSA) execution.</li>
        </ul>
        <p>
          Overdue balances beyond agreed credit periods shall accrue commercial interest at the rate of <strong>18% per annum</strong> from the due date until full settlement.
        </p>
      </section>

      <section id="title-risk" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Passage of Title & Risk of Loss
        </h2>
        <p>
          Pursuant to the <em>Sale of Goods Act, 1930</em>:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Risk of Loss:</strong> For surface shipments, risk of loss or transit damage remains with the Vendor under our comprehensive Marine Cargo Transit Insurance until delivery is completed at the consignee’s premises.</li>
          <li><strong>Passage of Title:</strong> Title to hardware sold outright passes to the Buyer only upon receipt of 100% full cleared payment by the Vendor. For rented hardware, title remains permanently with the Vendor at all times.</li>
        </ul>
      </section>

      <section id="warranty-disclaimers" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          6. Hardware Warranties & Express Disclaimers
        </h2>
        <p>
          Hardware sold outright is accompanied by our standard <strong>6 to 12 months comprehensive hardware replacement warranty</strong> covering internal component defects (motherboards, internal power delivery, display panels, and factory memory modules).
        </p>
        <p>
          <strong>Exclusions:</strong> The warranty expressly excludes defects resulting from physical drop damage, liquid ingress, unauthorized third-party BIOS tampering, power surge without stabilizer, or normal cosmetic exterior wear.
        </p>
      </section>

      <section id="liability" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          7. Limitation of Corporate Liability
        </h2>
        <p>
          To the maximum extent permitted under Indian law, neither party shall be liable for indirect, punitive, special, exemplary, incidental, or consequential damages, including loss of business profits, workforce productivity interruptions, or loss of proprietary data.
        </p>
        <p>
          The maximum aggregate liability of {brand} arising under or in connection with any individual transaction shall strictly not exceed the total net consideration actually received by the Vendor for the specific hardware units giving rise to the claim.
        </p>
      </section>

      <section id="indemnity" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          8. Enterprise Indemnification
        </h2>
        <p>
          Each party agrees to indemnify and hold harmless the other party, its directors, officers, and employees against any third-party claims, liabilities, damages, and legal costs arising directly from willful misconduct, gross negligence, or material breach of statutory regulations.
        </p>
      </section>

      <section id="intellectual-property" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          9. Intellectual Property & Third-Party OEM Trademarks
        </h2>
        <p>
          All trademarks, corporate marks, and trade dress displayed on this website belong to their respective proprietary owners. Mentions of OEM trademarks (including Lenovo, ThinkPad, Dell, Latitude, Precision, HP, EliteBook, Intel, AMD, and NVIDIA) are made strictly for compatibility and hardware identification purposes and do not imply endorsement, affiliation, or direct agency.
        </p>
      </section>

      <section id="arbitration-governing-law" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          10. Arbitration & Governing Law (Indian Law Mandate)
        </h2>
        <p>
          These Terms and any dispute arising hereunder shall be governed by, interpreted, and construed in accordance with the substantive laws of the Republic of India.
        </p>
        <p>
          <strong>Arbitration:</strong> Any dispute, controversy, or claim arising out of or relating to this contract, including its formation, breach, or termination, shall be settled by binding arbitration in accordance with the <em>Arbitration and Conciliation Act, 1996</em> (as amended). The arbitration tribunal shall consist of a sole arbitrator appointed mutually by the parties.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Seat & Venue of Arbitration:</strong> {jurisdiction}, India</p>
          <p><strong>Language of Arbitration:</strong> English</p>
          <p><strong>Exclusive Judicial Jurisdiction:</strong> Subject to arbitration, the courts situated at <strong>{jurisdiction}</strong>, India shall have exclusive territorial jurisdiction over any judicial proceedings.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
