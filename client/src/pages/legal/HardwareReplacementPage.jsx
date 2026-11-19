/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function HardwareReplacementPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';
  const supportEmail = company?.support_email || company?.email || 'support@example.com [PLACEHOLDER]';
  const supportPhone = company?.phone || '+91 XXXXX XXXXX [PLACEHOLDER]';

  const toc = [
    { id: 'replacement-overview', title: 'Zero-Downtime Hot-Swap Guarantee' },
    { id: 'commercial-sale-30day', title: '30-Day Instant Swap (Outright Purchase)' },
    { id: 'rental-lease-swap', title: 'Continuous Fleet Hot-Swap (Rental Leases)' },
    { id: 'replacement-workflow', title: 'Step-by-Step Hot-Swap Protocol' },
    { id: 'data-sanitization', title: 'Drive Swapping & Data Security' },
    { id: 'abuse-exclusions', title: 'Exclusions & Unapproved Tampering' }
  ];

  return (
    <LegalLayout
      title="Hardware Replacement & Hot-Swap Policy"
      subtitle="Operational procedures governing advance hardware replacement, machine swaps, and defective asset returns."
      policyKey="replacement-policy"
      toc={toc}
    >
      <section id="replacement-overview" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Zero-Downtime Hot-Swap Guarantee
        </h2>
        <p>
          At <strong>{legal}</strong> (<strong>"{brand}"</strong>), our corporate mission is to ensure that enterprise employees never sit idle due to hardware bottlenecks or vendor RMA delays. Unlike retail warranty processes that require sending machines away to service centers for 3 to 4 weeks, {brand} operates an immediate <strong>1-to-1 Hot-Swap Replacement Protocol</strong>.
        </p>
      </section>

      <section id="commercial-sale-30day" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. 30-Day Instant Swap Window (Outright Purchase)
        </h2>
        <p>
          For hardware purchased outright from our sales catalog:
        </p>
        <p>
          If any workstation, corporate notebook, or enterprise display develops an internal component defect within the first <strong>30 calendar days</strong> of delivery, {brand} automatically issues an advance 1-to-1 replacement machine. We dispatch the replacement immediately upon ticket verification without waiting for the defective machine to return to our depot.
        </p>
      </section>

      <section id="rental-lease-swap" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Continuous Fleet Hot-Swap (Rental Leases)
        </h2>
        <p>
          For corporate rental clients, the hot-swap guarantee remains active throughout the entire duration of the master lease.
        </p>
        <p>
          Under our <strong>24–48h Standby Replacement SLA</strong>, our technician visits your corporate premises (or dispatches an expedited replacement to remote WFH employees) with an identical pre-configured machine so that your team experiences zero productivity loss.
        </p>
      </section>

      <section id="replacement-workflow" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Step-by-Step Hot-Swap Protocol
        </h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Ticket Initiation:</strong> Email <a href={`mailto:${supportEmail}`} className="text-[#8A5E12] underline">{supportEmail}</a> or ping our Direct Support Line at {supportPhone} with the device serial number and a short video/photo of the fault.</li>
          <li><strong>Engineering Clearance:</strong> Our diagnostics desk authorizes an RMA Hot-Swap within <strong>2 business hours</strong>.</li>
          <li><strong>Advance Dispatch:</strong> A tested, Grade A+ certified replacement unit is immediately dispatched via express surface or air courier.</li>
          <li><strong>Doorstep Exchange:</strong> The courier delivers the replacement machine and simultaneously collects the boxed defective unit in a single coordinated logistics visit.</li>
        </ol>
      </section>

      <section id="data-sanitization" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Drive Swapping & Corporate Data Security
        </h2>
        <p>
          We recognize that corporate hard drives and NVMe SSDs contain confidential enterprise assets. During on-site hot-swaps, with our engineer present, the Client’s IT administrator is permitted to physically retain the original encrypted NVMe SSD and insert it into the replacement chassis, eliminating data transfer delays.
        </p>
        <p>
          Any storage drives returned to our facilities undergo mandatory certified <strong>NIST SP 800-88 Rev. 1 cryptographic data wiping</strong>.
        </p>
      </section>

      <section id="abuse-exclusions" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          6. Exclusions & Unapproved Tampering
        </h2>
        <p>
          Hot-swap replacements are provided strictly for genuine electronic and manufacturing defects. Physical drops, water immersion, cracked screens, or damage caused by ungrounded voltage surges require repair billing and are not eligible for free hot-swap replacement.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Support & Replacement Desk:</strong> Email <a href={`mailto:${supportEmail}`} className="text-[#8A5E12] underline">{supportEmail}</a>. Jurisdiction: <strong>{jurisdiction}</strong>, India.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
