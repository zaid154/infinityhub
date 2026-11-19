/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function RentalSLAPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';
  const supportEmail = company?.support_email || company?.email || 'support@example.com [PLACEHOLDER]';
  const supportPhone = company?.phone || '+91 XXXXX XXXXX [PLACEHOLDER]';

  const toc = [
    { id: 'definitions', title: 'Statutory & Operational Definitions' },
    { id: 'standby-sla', title: '24–48h Standby Hardware Replacement Scope' },
    { id: 'covered-geographies', title: 'Covered Geographies & Turnaround Tiers' },
    { id: 'exclusions', title: 'Exclusions & Voidance of Standby SLA' },
    { id: 'security-deposit', title: 'Security Deposits & Corporate GST Waivers' },
    { id: 'lease-tenure', title: 'Lease Tenure & Minimum Commitment' },
    { id: 'data-responsibility', title: 'Data Responsibility & NIST SP 800-88 Wiping' },
    { id: 'return-protocol', title: 'Fleet Decommissioning & Return Reconciliation' },
    { id: 'late-fees-default', title: 'Late Payment Penalties & Commercial Default' },
    { id: 'termination', title: 'Early Termination & Equipment Repossession' }
  ];

  return (
    <LegalLayout
      title="Corporate Rental & Standby SLA Terms"
      subtitle="Master Service Level Agreement governing corporate IT hardware leases, operating equipment rentals, and standby swap protocols."
      policyKey="rental-sla"
      toc={toc}
    >
      <section id="definitions" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Statutory & Operational Definitions
        </h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>"Lessor" / "Vendor":</strong> {legal} (operating as "{brand}").</li>
          <li><strong>"Lessee" / "Client":</strong> The enterprise, company, or institutional customer leasing hardware units.</li>
          <li><strong>"Equipment Fleet":</strong> Laptops, workstations, displays, and peripheral IT hardware leased under an active Rental Work Order.</li>
          <li><strong>"Standby Replacement Unit":</strong> An equivalent or higher-specification hardware machine pre-imaged and delivered to replace a non-functional unit.</li>
          <li><strong>"Business Hours":</strong> 9:30 AM to 7:30 PM Indian Standard Time (IST), Monday through Saturday, excluding declared national holidays.</li>
        </ul>
      </section>

      <section id="standby-sla" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. 24–48h Standby Hardware Replacement SLA
        </h2>
        <p>
          During the active term of a rental contract, the Lessor guarantees that in the event of an inherent hardware defect (motherboard crash, battery failure, RAM bit error, or internal display fault) reported during Business Hours, a Standby Replacement Unit shall be dispatched or delivered on-site within:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Within 24 Hours:</strong> In Tier-1 Central Hubs (Delhi NCR, Bangalore, Mumbai).</li>
          <li><strong>Within 48 Hours:</strong> In Tier-2 Metros (Pune, Hyderabad, Chennai, Kolkata, Ahmedabad).</li>
        </ul>
        <p>
          <strong>Remedy for SLA Failure:</strong> If the Lessor fails to dispatch a replacement unit within the stipulated SLA window due to reasons attributable solely to the Lessor, a pro-rata daily rental credit shall be applied to the Lessee's billing account for every 24-hour delay increment.
        </p>
      </section>

      <section id="covered-geographies" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Covered Geographies & Logistics Tiers
        </h2>
        <p>
          Hardware rental leases and standby swaps are supported across 19,000+ Indian postal codes through centralized operations centers situated in Delhi NCR, Bangalore, and Mumbai. For remote work-from-home (WFH) employees in Tier-3 locations, dispatches are coordinated via priority insured air express couriers with an SLA of <strong>48 to 72 hours</strong>.
        </p>
      </section>

      <section id="exclusions" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Exclusions & Voidance of Standby SLA
        </h2>
        <p>
          The free ongoing repair and standby swap SLA strictly covers normal manufacturing and wear-and-tear defects. The following scenarios are expressly excluded:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-red-900/90">
          <li>Physical drop damage, cracked screens, shattered hinges, or casing rupture resulting from mishandling.</li>
          <li>Liquid spill or corrosive moisture ingress inside chassis or keyboard.</li>
          <li>Electrical burnout caused by charging via ungrounded generators or non-OEM third-party adapters.</li>
          <li>Unauthorized internal disassembly, component swapping, or tampering with warranty security void stickers.</li>
          <li>Software, operating system corruption, ransomware infection, or data loss caused by end-user configuration.</li>
        </ul>
        <p className="text-xs text-slate-600">
          In cases of excluded physical or liquid damage, the Lessee shall be billed for actual component replacement costs based on the standard OEM price schedule.
        </p>
      </section>

      <section id="security-deposit" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Security Deposits & Corporate GST Waivers
        </h2>
        <p>
          For GST-registered corporate entities with a verified credit history and active incorporation exceeding 2 years, refundable security deposits may be <strong>100% waived</strong> upon submission of corporate board resolutions, GST verification, and formal MSA execution.
        </p>
        <p>
          Where a security deposit is collected, it shall be held in escrow and refunded within <strong>7 business days</strong> following completion of lease tenure and physical hardware reconciliation.
        </p>
      </section>

      <section id="lease-tenure" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          6. Lease Tenure & Minimum Commitments
        </h2>
        <p>
          Standard commercial rental tenures range from <strong>1 month to 36 months</strong>. The minimum billing cycle for any deployed fleet unit is 30 calendar days. Monthly invoices are generated on the 1st of each calendar month with a standard payment grace period of 7 business days.
        </p>
      </section>

      <section id="data-responsibility" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          7. Data Responsibility & NIST SP 800-88 Cleansing
        </h2>
        <p>
          The Lessee is solely responsible for backing up all proprietary company data prior to surrendering or swapping any leased machine.
        </p>
        <p>
          Upon return to the Lessor’s warehouse, all secondary storage media undergo mandatory <strong>NIST SP 800-88 Rev. 1 cryptographic data wiping</strong>. Once sanitized, client data cannot be recovered by either party.
        </p>
      </section>

      <section id="return-protocol" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          8. Fleet Decommissioning & Return Reconciliation
        </h2>
        <p>
          Upon lease completion, {brand} arranges doorstep reverse pickup through secure insured logistics. A formal Joint Physical Inspection Report is generated within <strong>3 business days</strong> of warehouse receipt to verify serial numbers and cosmetic condition. Normal wear (micro key polish, gentle bezel rubbing) is 100% absorbed by the Lessor.
        </p>
      </section>

      <section id="late-fees-default" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          9. Late Payment Penalties & Commercial Default
        </h2>
        <p>
          Invoices overdue beyond 15 calendar days shall incur a late payment interest fee of <strong>1.5% per month</strong> (18% per annum). In the event non-payment exceeds 30 calendar days, the Lessor reserves the legal right to suspend on-site SLA services and demand immediate return of leased hardware.
        </p>
      </section>

      <section id="termination" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          10. Early Termination & Equipment Repossession
        </h2>
        <p>
          Either party may terminate a rental agreement upon providing <strong>30 calendar days written notice</strong>. In the event of material default, bankruptcy, or unauthorized subleasing, the Lessor reserves an absolute right to enter the Lessee’s premises during business hours to safely repossess all leased IT assets.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Dispute Resolution:</strong> Governed by the <em>Arbitration and Conciliation Act, 1996</em> with seat at <strong>{jurisdiction}</strong>, India.</p>
          <p><strong>Support & SLA Desk:</strong> Email <a href={`mailto:${supportEmail}`} className="text-[#8A5E12] underline">{supportEmail}</a> or call {supportPhone}.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
