/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function RefurbishedDisclosurePage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';

  const toc = [
    { id: 'grading-matrix', title: 'Enterprise Hardware Grading Matrix' },
    { id: '30point-protocol', title: 'The 30-Point Engineering Diagnostic Protocol' },
    { id: 'battery-capacity', title: 'Battery Health Standards (>80% Capacity)' },
    { id: 'cosmetic-standards', title: 'Cosmetic Standards vs Functional Perfection' },
    { id: 'os-licensing', title: 'Genuine Operating System & BIOS Licensing' }
  ];

  return (
    <LegalLayout
      title="Refurbished Hardware Quality & Grading Disclosure"
      subtitle="Complete transparency report outlining our 3-tier grading matrix, 30-point diagnostics, and battery cycle thresholds."
      policyKey="refurbished-disclosure"
      toc={toc}
    >
      <section id="grading-matrix" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Enterprise Hardware Grading Matrix
        </h2>
        <p>
          At <strong>{legal}</strong> (<strong>"{brand}"</strong>), we classify every reconditioned corporate machine through rigorous engineering standards before clearance for lease or wholesale dispatch:
        </p>

        <div className="space-y-3 pt-1">
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4A24C]/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0D3B2A] font-serif text-sm">Grade A+ Pristine (Corporate Executive)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0D3B2A] text-white">95–99% Like New</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Near-mint condition with zero structural dents, flawless screen with zero dead pixels, pristine keyboard keys, and minimal micro-scuffs invisible at arm's length. Sourced primarily from executive leasing contracts.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0D3B2A] font-serif text-sm">Grade A (Enterprise Standard)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4A24C] text-[#072117]">90–94% Excellent</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% functionally perfect. May exhibit gentle palm-rest polish or light cosmetic marks on bottom base covers. Screen is completely free of deep scratches or pressure spots. Ideal for general corporate workforces.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0D3B2A] font-serif text-sm">Grade B (Value Tier)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-200 text-slate-800">80–89% Functional Value</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% bench-tested internal components. May show visible exterior cosmetic scratches, minor bezel scuffing, or small non-obtrusive pressure marks on display. Best suited for back-office BPOs, testing labs, and industrial control desks.
            </p>
          </div>
        </div>
      </section>

      <section id="30point-protocol" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. The 30-Point Engineering Diagnostic Protocol
        </h2>
        <p>
          Every unit undergoes exhaustive bench testing inside our diagnostic facility prior to customer handover:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200 space-y-1">
            <strong className="text-[#0D3B2A] block font-mono text-[11px]">1. Computing & Memory Core</strong>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              <li>MemTest86 100% pass on all RAM addresses.</li>
              <li>Prime95 CPU core continuous stress test.</li>
              <li>FurMark GPU thermal load burn-in.</li>
              <li>Heatsink ultrasonic cleaning & Arctic MX-4 thermal repasting.</li>
            </ul>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200 space-y-1">
            <strong className="text-[#0D3B2A] block font-mono text-[11px]">2. Storage & Diagnostics</strong>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              <li>CrystalDiskInfo NVMe SMART health {'>'} 90%.</li>
              <li>NIST SP 800-88 cryptographic SSD sanitization.</li>
              <li>Zero bad sector certification.</li>
              <li>Sequential read/write benchmark validation.</li>
            </ul>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200 space-y-1">
            <strong className="text-[#0D3B2A] block font-mono text-[11px]">3. Display & Audio Systems</strong>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              <li>White, black, RGB dead pixel full scan.</li>
              <li>IPS backlight uniformity check.</li>
              <li>Dual stereo speaker frequency sweep test.</li>
              <li>Integrated noise-canceling mic & webcam test.</li>
            </ul>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200 space-y-1">
            <strong className="text-[#0D3B2A] block font-mono text-[11px]">4. Interface & Power Delivery</strong>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              <li>Thunderbolt / Type-C Power Delivery test.</li>
              <li>Every individual keyboard switch bounce test.</li>
              <li>Multi-touch trackpad & TrackPoint check.</li>
              <li>Wi-Fi 6 & Bluetooth 5.2 link stability test.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="battery-capacity" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Battery Health Standards ({'>'}80% Capacity)
        </h2>
        <p>
          We do not deploy machines with dead or swelling batteries. Every Grade A+ battery is tested with OEM battery report telemetry to ensure it retains <strong>at least 80% of its original design capacity</strong>, delivering robust multi-hour operational endurance. Any battery failing this benchmark is immediately replaced with a brand-new certified replacement cell.
        </p>
      </section>

      <section id="cosmetic-standards" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Cosmetic Standards vs Functional Perfection
        </h2>
        <p>
          While refurbished hardware offers up to <strong>65% cost savings</strong> over brand-new retail machines, clients should understand that cosmetic perfection may differ from showroom retail boxes. However, internal motherboard architecture, thermal cooling, logic pathways, and operational reliability are 100% equivalent to original OEM specifications.
        </p>
      </section>

      <section id="os-licensing" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Genuine Operating System & BIOS Licensing
        </h2>
        <p>
          Every commercial machine is provisioned using its genuine embedded OEM digital license (Windows 11 Pro / Windows 10 Pro) embedded directly within the UEFI BIOS chip, ensuring zero enterprise licensing compliance exposure during corporate audits.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Diagnostic Inquiries:</strong> Contact our Quality Engineering Desk at <a href={`mailto:${company?.email || 'procurement@example.com'}`} className="text-[#8A5E12] underline">{company?.email || 'procurement@example.com'}</a>. Jurisdiction: <strong>{jurisdiction}</strong>, India.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
