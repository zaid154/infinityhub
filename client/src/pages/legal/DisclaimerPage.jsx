/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function DisclaimerPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';

  const toc = [
    { id: 'general-disclaimer', title: 'General Information & Non-Binding Nature' },
    { id: 'oem-non-affiliation', title: 'OEM Trademark Ownership & Non-Affiliation' },
    { id: 'product-imagery', title: 'Product Images, Aesthetic Variations & Stock Specs' },
    { id: 'technical-advisory', title: 'Consultation & AI Chatbot Advisory Disclaimer' },
    { id: 'third-party-links', title: 'Third-Party Web Links & Hyperlinks' }
  ];

  return (
    <LegalLayout
      title="Legal & Operational Disclaimer"
      subtitle="Comprehensive disclosures regarding OEM trademarks, illustrative product imagery, and technical advisory limitations."
      policyKey="disclaimer"
      toc={toc}
    >
      <section id="general-disclaimer" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. General Information & Non-Binding Nature
        </h2>
        <p>
          The information, hardware specifications, catalog listings, and pricing estimates provided on this website by <strong>{legal}</strong> (<strong>"{brand}"</strong>) are presented in good faith for general commercial information and corporate procurement planning purposes.
        </p>
      </section>

      <section id="oem-non-affiliation" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. OEM Trademark Ownership & Express Non-Affiliation
        </h2>
        <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4A24C]/40 space-y-2">
          <strong className="text-[#0D3B2A] block uppercase font-mono text-xs">
            Third-Party Proprietary Rights Declaration:
          </strong>
          <p className="text-xs text-slate-700 leading-relaxed">
            {company?.third_party_disclaimer ||
              'All third-party trademarks, logos, and brand names (including Dell, HP, Lenovo, ThinkPad, Latitude, EliteBook, Apple, Samsung, NVIDIA, Intel, and AMD) are the registered properties of their respective owners. Use of these names, trademarks, and brands does not imply endorsement, affiliation, or direct sponsorship unless explicitly stated.'}
          </p>
          <p className="text-[11px] text-slate-500 italic pt-1 border-t border-[#D4A24C]/20">
            {brand} is an independent corporate hardware vendor, lessor, and IT asset disposition (ITAD) enterprise, and is not an authorized distributor or exclusive agent of any manufacturer unless explicitly documented in a formal written supply agreement.
          </p>
        </div>
      </section>

      <section id="product-imagery" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Product Images, Aesthetic Variations & Stock Specs
        </h2>
        <p>
          Product photographs and 360-degree interactive displays showcased across our catalog are for <strong>illustrative visual representation</strong>.
        </p>
        <p>
          Because our enterprise inventory encompasses corporate lease returns and enterprise refurbished stock, minor aesthetic variations (such as gentle palm-rest polish, minor micro-abrasions, or varied keyboard country layout keys) may exist across individual units within a single lot, provided each unit strictly adheres to our published Grade A+ functional diagnostic criteria.
        </p>
      </section>

      <section id="technical-advisory" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Technical Consultation & AI Chatbot Advisory Disclaimer
        </h2>
        <p>
          Hardware configuration guidance, GPU benchmark estimates, and rental tenure calculators provided via our AI consultant bot or telephone desk are offered as preliminary commercial guidance. The Client is solely responsible for verifying compatibility with its proprietary corporate software stacks, hypervisors, and security compliance frameworks.
        </p>
      </section>

      <section id="third-party-links" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Third-Party Web Links & Hyperlinks
        </h2>
        <p>
          Our platform may contain links to external sites (such as courier tracking portals, driver repositories, or payment gateways). {brand} does not exercise control over, endorse, or accept liability for the content, privacy protocols, or practices of third-party platforms.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Corporate Jurisdiction:</strong> Courts of <strong>{jurisdiction}</strong>, India have exclusive jurisdiction.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
