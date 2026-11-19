/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function WarrantyPolicyPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';
  const supportEmail = company?.support_email || company?.email || 'support@example.com [PLACEHOLDER]';

  const toc = [
    { id: 'warranty-tiers', title: 'Commercial Warranty Tiers & Duration' },
    { id: 'coverage-scope', title: 'Component Coverage Scope' },
    { id: 'battery-coverage', title: 'Battery & Consumable Component Scope' },
    { id: 'warranty-exclusions', title: 'Exclusions & Warranty Void Conditions' },
    { id: 'claims-process', title: 'Step-by-Step Warranty Claim & RMA Workflow' },
    { id: 'logistics-freight', title: 'Warranty Freight Logistics & Insurance' }
  ];

  return (
    <LegalLayout
      title="Commercial Hardware Warranty Policy"
      subtitle="Comprehensive coverage specifications for commercial refurbished fleets, enterprise components, and leased hardware."
      policyKey="warranty-policy"
      toc={toc}
    >
      <section id="warranty-tiers" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Commercial Warranty Tiers & Duration
        </h2>
        <p>
          <strong>{legal}</strong> (<strong>"{brand}"</strong>) provides structured commercial warranty coverage across all IT equipment categories:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 space-y-1">
            <span className="font-bold text-[#0D3B2A] block">Grade A+ Corporate Refurbished</span>
            <span className="text-sm font-serif font-bold text-[#8A5E12] block">6 to 12 Months</span>
            <p className="text-[11px] text-slate-600">Full hardware replacement warranty covering motherboard, screen & RAM.</p>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 space-y-1">
            <span className="font-bold text-[#0D3B2A] block">Corporate Rental Leases</span>
            <span className="text-sm font-serif font-bold text-[#8A5E12] block">Continuous (Tenure)</span>
            <p className="text-[11px] text-slate-600">Free repairs, spares & 24–48h standby replacement throughout the lease.</p>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 space-y-1">
            <span className="font-bold text-[#0D3B2A] block">Enterprise Components (RAM/SSD)</span>
            <span className="text-sm font-serif font-bold text-[#8A5E12] block">1 to 3 Years</span>
            <p className="text-[11px] text-slate-600">Over-the-counter testing and replacement against bit errors or drive wear.</p>
          </div>
        </div>
      </section>

      <section id="coverage-scope" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. Component Coverage Scope
        </h2>
        <p>
          Our warranty covers latent internal component failures occurring during normal commercial business usage:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Logic Boards & Motherboards:</strong> Chipset failure, CPU thermal throttling, cold solder failure, integrated graphics anomalies, and voltage regulation circuitry.</li>
          <li><strong>Internal Displays:</strong> Backlight inverter failure, vertical line distortion, and active matrix defects exceeding 3 dead pixels.</li>
          <li><strong>Memory & Storage:</strong> Non-correctable bit errors (verified via MemTest86) and NVMe/SSD read/write controller failure.</li>
          <li><strong>Power System:</strong> Internal DC charging jacks, factory power adapters, and internal charging rails.</li>
        </ul>
      </section>

      <section id="battery-coverage" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Battery & Consumable Component Scope
        </h2>
        <p>
          Lithium-ion batteries are consumable electrochemical components. Every Grade A+ refurbished machine is certified upon dispatch with battery health holding at least <strong>80% of original factory design capacity</strong>.
        </p>
        <p>
          Laptops sold outright include a <strong>90-day battery health warranty</strong> guaranteeing that the battery will maintain at least 2 to 4 hours of standard commercial operational life under typical productivity workloads. For rental fleets, degraded batteries are swapped free of charge throughout the lease term.
        </p>
      </section>

      <section id="warranty-exclusions" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Exclusions & Warranty Void Conditions
        </h2>
        <p>
          Warranty coverage is automatically rendered void in any of the following occurrences:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-red-900/90">
          <li>Physical drop impact, exterior cracked casings, cracked display glass, or broken hinge assemblies.</li>
          <li>Liquid ingress, moisture corrosion, or chemical exposure.</li>
          <li>Electrical surge damage resulting from ungrounded circuits or third-party non-standard power bricks.</li>
          <li>Removal, defacing, or alteration of the {brand} warranty security void tamper-evident seal or serial number label.</li>
          <li>Unauthorized internal disassembly, soldering, or third-party repair attempts.</li>
        </ul>
      </section>

      <section id="claims-process" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Step-by-Step Warranty Claim & RMA Workflow
        </h2>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><strong>Raise RMA Ticket:</strong> Email <a href={`mailto:${supportEmail}`} className="text-[#8A5E12] underline">{supportEmail}</a> with machine serial number, invoice copy, and brief defect description.</li>
          <li><strong>Diagnostic Screening:</strong> Our senior hardware engineer reviews diagnostic telemetry or schedules a remote diagnostics session within <strong>4 business hours</strong>.</li>
          <li><strong>Resolution Dispatch:</strong> If a defect is confirmed, {brand} coordinates immediate 1-to-1 replacement machine dispatch or ships identical tested replacement components.</li>
        </ol>
      </section>

      <section id="logistics-freight" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          6. Warranty Freight Logistics & Insurance
        </h2>
        <p>
          For valid warranty claims, {brand} bears <strong>100% of the two-way logistics shipping freight</strong> and covers transit insurance. The Client is only required to repackage the defective unit safely inside the protective packaging provided by our carrier partner.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Support Desk:</strong> Email <a href={`mailto:${supportEmail}`} className="text-[#8A5E12] underline">{supportEmail}</a>. Jurisdiction: <strong>{jurisdiction}</strong>, India.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
