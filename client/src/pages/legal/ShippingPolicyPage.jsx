/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function ShippingPolicyPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';
  const opsHubs = company?.warehouse_locations || 'Delhi NCR, Bangalore, and Mumbai';
  const supportEmail = company?.support_email || company?.email || 'support@example.com [PLACEHOLDER]';

  const toc = [
    { id: 'fulfillment-network', title: 'Fulfillment Hubs & Pan-India Reach' },
    { id: 'dispatch-timelines', title: 'Order Processing & Dispatch Timelines' },
    { id: 'packaging-standards', title: 'Shockproof Packaging Standards' },
    { id: 'marine-insurance', title: 'All-Risk Marine Transit Cargo Insurance' },
    { id: 'wfh-rosters', title: 'Decentralized WFH Employee Fleet Dispatch' },
    { id: 'tracking-verification', title: 'Carrier Tracking & Consignment Inspection' },
    { id: 'delivery-failure', title: 'Delivery Exceptions & Redirection Protocols' }
  ];

  return (
    <LegalLayout
      title="Shipping & Pan-India Dispatch Policy"
      subtitle="Comprehensive logistics procedures, fulfillment timelines, transit insurance, and WFH employee dispatch standards."
      policyKey="shipping-policy"
      toc={toc}
    >
      <section id="fulfillment-network" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Fulfillment Hubs & Pan-India Reach
        </h2>
        <p>
          <strong>{legal}</strong> (<strong>"{brand}"</strong>) operates centralized warehousing and diagnostic fulfillment centers strategically situated in:
        </p>
        <p className="font-semibold text-[#0D3B2A] bg-[#FAF7F2] p-3 rounded-xl border border-[#D4A24C]/30 text-xs">
          Central Operations: {opsHubs}
        </p>
        <p>
          We provide enterprise surface and air express courier dispatches covering more than <strong>19,000 postal codes</strong> across all 28 States and 8 Union Territories of India.
        </p>
      </section>

      <section id="dispatch-timelines" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. Order Processing & Dispatch Timelines
        </h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Standard In-Stock Hardware:</strong> Dispatched from our warehouse within <strong>24 to 48 hours</strong> of Purchase Order verification and proforma sign-off.</li>
          <li><strong>Custom Imaged Fleets:</strong> Machines requiring custom corporate OS image deployment, BitLocker encryption, or domain provisioning are dispatched within <strong>48 to 72 hours</strong>.</li>
          <li><strong>Estimated Transit Transit Windows:</strong>
            <ul className="list-circle pl-5 pt-1 space-y-0.5 text-xs text-slate-600">
              <li>Tier-1 Metro Hubs (Delhi NCR, Bangalore, Mumbai, Pune, Hyderabad, Chennai): <strong>1 to 2 business days</strong>.</li>
              <li>Tier-2 Cities & State Capitals: <strong>2 to 4 business days</strong>.</li>
              <li>Tier-3 and Remote Pincodes: <strong>4 to 6 business days</strong>.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section id="packaging-standards" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Heavy-Duty Shockproof Packaging Standards
        </h2>
        <p>
          All commercial laptops and enterprise displays are packaged utilizing military-grade anti-static polyethylene foam sleeves, reinforced corner edge protectors, and 5-ply heavy-gauge corrugated outer boxes sealed with tamper-evident security tape. Each consignment carries a serialized external packing list.
        </p>
      </section>

      <section id="marine-insurance" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. All-Risk Marine Transit Cargo Insurance
        </h2>
        <p>
          Every shipment dispatched by {brand} is <strong>100% covered under an active All-Risk Marine Cargo Transit Insurance policy</strong>.
        </p>
        <p>
          In the improbable event of road carrier collision, vehicle overturn, transit water damage, or courier theft, the financial loss is 100% absorbed by the Vendor. Upon generation of the official carrier surveyor report or police FIR, {brand} immediately dispatches replacement hardware without waiting for insurance claim settlements.
        </p>
      </section>

      <section id="wfh-rosters" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Decentralized WFH Employee Fleet Dispatch
        </h2>
        <p>
          For corporate onboarding cohorts, HR and IT managers may submit an encrypted CSV dispatch roster. We manage individual doorstep delivery to employee residences across India, complete with:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Automated SMS and email tracking links transmitted to both the employee and the corporate IT administrator.</li>
          <li>Direct OTP-verified delivery authentication to ensure hardware is handed only to the authorized employee.</li>
          <li>Digital electronic proof-of-delivery (e-POD) with consignee signature archived in your portal dashboard.</li>
        </ul>
      </section>

      <section id="tracking-verification" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          6. Carrier Tracking & Consignment Inspection
        </h2>
        <p>
          Upon delivery, the consignee is advised to inspect the exterior packaging for any visible crushing or security tape breach. If significant carton damage is observed, the consignee must note <em>"Received in Damaged Condition"</em> on the courier delivery run sheet and notify our desk within <strong>24 hours</strong>.
        </p>
      </section>

      <section id="delivery-failure" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          7. Delivery Exceptions & Redirection Protocols
        </h2>
        <p>
          If an employee is unreachable after 3 delivery attempts, the consignment is securely held at the carrier’s nearest destination hub for 48 hours. Our operations desk coordinates with the corporate HR manager for immediate address re-routing or consolidation back to the corporate headquarters.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Logistics Operations Desk:</strong> Email <a href={`mailto:${supportEmail}`} className="text-[#8A5E12] underline">{supportEmail}</a>. Jurisdiction: <strong>{jurisdiction}</strong>, India.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
