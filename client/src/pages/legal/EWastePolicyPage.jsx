/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function EWastePolicyPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const eprNumber = company?.epr_registration_number || 'CPCB/EPR/2024/000000 [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';

  const toc = [
    { id: 'statutory-framework', title: 'Statutory Framework & MoEFCC Notification' },
    { id: 'epr-commitment', title: 'Extended Producer Responsibility (EPR) Commitment' },
    { id: 'itad-data-destruction', title: 'NIST SP 800-88 Certified Data Sanitization' },
    { id: 'recycling-channels', title: 'Authorized Recyclers & CPCB Channelization' },
    { id: 'certificate-destruction', title: 'Issuance of Green Certificate & Audit Reports' },
    { id: 'buyback-channel', title: 'Corporate Take-Back & E-Waste Buyback Program' }
  ];

  return (
    <LegalLayout
      title="E-Waste Management & EPR Compliance Policy"
      subtitle="Statutory compliance framework under the E-Waste (Management) Rules, 2022, CPCB guidelines, and circular ITAD lifecycle standards."
      policyKey="ewaste-policy"
      toc={toc}
    >
      <section id="statutory-framework" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Statutory Framework & MoEFCC Notification
        </h2>
        <p>
          <strong>{legal}</strong> (<strong>"{brand}"</strong>) is firmly committed to responsible environmental stewardship and circular electronics economy in strict compliance with the <em>E-Waste (Management) Rules, 2022</em> enacted by the Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India, and guidelines issued by the Central Pollution Control Board (CPCB).
        </p>
      </section>

      <section id="epr-commitment" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. Extended Producer Responsibility (EPR) Commitment
        </h2>
        <p>
          In accordance with Rule 4 of the E-Waste Rules 2022, {brand} maintains formal registration under the Central Pollution Control Board (CPCB) portal:
        </p>
        <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs font-mono space-y-1">
          <p><strong>Corporate Entity:</strong> {legal}</p>
          <p><strong>CPCB EPR Registration Reference:</strong> {eprNumber}</p>
          <p><strong>Authorized Scope:</strong> Refurbishing, ITAD asset recovery, and channelization of end-of-life electrical and electronic equipment (EEE Code: ITEW1 to ITEW8).</p>
        </div>
      </section>

      <section id="itad-data-destruction" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. NIST SP 800-88 Certified Data Sanitization
        </h2>
        <p>
          Before any electronic equipment undergoes material recovery or recycling, data-bearing media (HDDs, NVMe drives, optical discs) are subjected to mandatory <strong>NIST SP 800-88 Rev. 1 cryptographic data wiping</strong>. Non-functional drives are physically crushed or degaussed in certified industrial shredders to guarantee that corporate proprietary data is permanently unrecoverable.
        </p>
      </section>

      <section id="recycling-channels" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Authorized Recyclers & CPCB Channelization
        </h2>
        <p>
          Electronics that reach the end of their operational lifespan and cannot be refurbished are never disposed of in municipal landfills. All scrap PCBs, lithium-ion battery packs, lead-soldered assemblies, and CRT/LCD panels are transferred exclusively to <strong>State Pollution Control Board (SPCB) registered and CPCB-authorized recyclers and dismantlers</strong> equipped with zero-emission smelting and hydrometallurgical recovery systems.
        </p>
      </section>

      <section id="certificate-destruction" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Issuance of Green Certificate & Audit Reports
        </h2>
        <p>
          Corporate clients surrendering decommissioned office fleets through our ITAD program receive:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
          <li><strong>Serial-Tracked Certificate of Data Destruction (COD):</strong> Confirming wipe verification algorithm and drive serial numbers.</li>
          <li><strong>Green E-Waste Disposal Certificate:</strong> Documenting tonnage diverted from landfills for your enterprise ESG (Environmental, Social, and Governance) annual sustainability reporting.</li>
          <li><strong>Form-6 Manifest Copies:</strong> Mandatory hazardous waste transport manifests pursuant to Rule 19 of the E-Waste Rules.</li>
        </ul>
      </section>

      <section id="buyback-channel" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          6. Corporate Take-Back & E-Waste Buyback Program
        </h2>
        <p>
          We provide pan-India reverse logistics to collect decommissioned office laptops, monitors, and servers directly from client facilities. To schedule an enterprise liquidation pickup or request an official valuation for your end-of-life IT assets, visit our dedicated{' '}
          <a href="/buyback" className="text-[#8A5E12] font-bold underline">
            Corporate Buyback Portal
          </a>
          .
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>E-Waste Compliance Desk:</strong> Jurisdiction: <strong>{jurisdiction}</strong>, India.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
