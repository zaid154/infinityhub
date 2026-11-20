/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import { Link } from 'react-router-dom';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function PrivacyPolicyPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const gstin = company?.gst_number || '07AAAAA0000A1Z5 [PLACEHOLDER]';
  const cin = company?.cin_number || 'U72900DL2024PTC000000 [PLACEHOLDER]';
  const regAddress = company?.registered_address || 'Registered Office Address [PLACEHOLDER]';
  const grievance = company?.grievance_officer || {
    name: 'Statutory Grievance Officer [PLACEHOLDER]',
    designation: 'Head of Legal & Enterprise Compliance',
    email: 'grievance@example.com [PLACEHOLDER]',
    phone: '+91 XXXXX XXXXX [PLACEHOLDER]',
    address: 'Legal Cell Address [PLACEHOLDER]'
  };

  const toc = [
    { id: 'data-fiduciary', title: 'Data Fiduciary Identity & Scope' },
    { id: 'data-collected', title: 'Categories of Personal & Commercial Data' },
    { id: 'purposes', title: 'Specified Lawful Purposes of Processing' },
    { id: 'consent-withdrawal', title: 'Consent Framework & Right of Withdrawal' },
    { id: 'retention', title: 'Data Retention & Statutory Disposal' },
    { id: 'security-standards', title: 'Security Safeguards & NIST SP 800-88' },
    { id: 'principal-rights', title: 'Rights of Data Principals (DPDP Act 2023)' },
    { id: 'cross-border', title: 'Cross-Border Data Transfers' },
    { id: 'children-data', title: 'Protection of Children’s Data' },
    { id: 'grievance-redressal', title: 'Statutory Grievance Redressal Mechanism' }
  ];

  return (
    <LegalLayout
      title="Privacy Policy & Data Governance"
      subtitle="Conforming to the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology Act, 2000."
      policyKey="privacy"
      toc={toc}
    >
      <section id="data-fiduciary" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Data Fiduciary Identity & Scope
        </h2>
        <p>
          This Privacy Policy governs the processing of personal data and corporate procurement records collected by <strong>{legal}</strong> (operating under the brand name <strong>"{brand}"</strong>, hereinafter referred to as the <strong>"Data Fiduciary"</strong>, <strong>"Company"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong>).
        </p>
        <p>
          We operate as an enterprise-to-enterprise (B2B) vendor providing commercial hardware supply, corporate computer rentals, asset liquidation (ITAD), and component distribution across the territory of India. We are committed to upholding the data protection principles enunciated under the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em>, the <em>Information Technology Act, 2000 (IT Act)</em>, and the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>.
        </p>
        <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs font-mono space-y-1">
          <p><strong>Corporate Entity:</strong> {legal}</p>
          <p><strong>CIN:</strong> {cin} • <strong>GSTIN:</strong> {gstin}</p>
          <p><strong>Registered Office:</strong> {regAddress}</p>
        </div>
      </section>

      <section id="data-collected" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. Categories of Personal & Commercial Data Collected
        </h2>
        <p>
          We collect and process only such data as is strictly necessary for formal corporate hardware transactions, logistics delivery, and statutory tax compliance:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Corporate Identity Data:</strong> Entity name, registered address, Corporate Identification Number (CIN), Goods and Services Tax Identification Number (GSTIN), and Permanent Account Number (PAN).</li>
          <li><strong>Authorized Representative Data:</strong> Full name, corporate email address, business telephone/mobile number, designation, and official authorization credentials of procurement managers, IT heads, and directors.</li>
          <li><strong>Logistics & Consignee Data:</strong> Delivery addresses, site incharge contact details, employee work-from-home (WFH) dispatch rosters (where explicitly instructed for decentralized device delivery), and consignment receipt acknowledgements.</li>
          <li><strong>Commercial & Transaction Data:</strong> Purchase orders (PO), quotation histories, rental lease agreements, proforma invoices, payment gateway reference identifiers, and bank remittance advice details.</li>
          <li><strong>Technical Telemetry:</strong> Anonymized server logs, IP addresses, browser types, and session tokens utilized solely for portal cybersecurity and denial-of-service mitigation.</li>
        </ul>
      </section>

      <section id="purposes" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Specified Lawful Purposes of Processing
        </h2>
        <p>
          Pursuant to Section 4 of the DPDP Act 2023, data is processed solely for lawful and specified purposes:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Execution and performance of B2B equipment sale agreements, master rental contracts, and SLA obligations.</li>
          <li>Pan-India logistics routing, consignment transit insurance, and reverse pickup of leased fleets.</li>
          <li>Issuance of statutory GST Tax Invoices under Section 31 of the Central Goods and Services Tax (CGST) Act, 2017 and reporting to the GST Network (GSTN).</li>
          <li>Preventive on-site hardware maintenance, hot-swap standby provisioning, and warranty claims execution.</li>
          <li>Asset buyback valuation, custody transfer verification, and issuance of certified NIST SP 800-88 Certificates of Data Destruction.</li>
        </ol>
      </section>

      <section id="consent-withdrawal" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Consent Framework & Right of Withdrawal
        </h2>
        <p>
          Where processing is based on consent (such as voluntary subscription to fleet availability digests or non-transactional portal communications), consent is obtained through an affirmative, unbundled action.
        </p>
        <p>
          A Data Principal has the statutory right to withdraw consent at any time with the same ease with which consent was originally provided. Withdrawal of consent does not affect the legality of processing conducted prior to withdrawal, nor does it override our statutory obligations to retain commercial records mandated by Indian tax and company laws.
        </p>
      </section>

      <section id="retention" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Data Retention & Statutory Disposal
        </h2>
        <p>
          Personal and commercial data shall be retained only for as long as is necessary to fulfill the purpose for which it was collected, or as required under applicable Indian statutory regimes:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Tax invoices, ledgers, and audit trails: Retained for a mandatory minimum of <strong>8 financial years</strong> under Section 36 of the CGST Act and Section 128 of the Companies Act, 2013.</li>
          <li>Rental agreement telemetry: Retained for the duration of the active lease plus <strong>3 years</strong> following lease termination or hardware reconciliation.</li>
          <li>Routine procurement inquiries: Retained for <strong>180 days</strong>, following which data is purged unless converted into an active commercial relationship.</li>
        </ul>
      </section>

      <section id="security-standards" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          6. Technical Security Safeguards & NIST SP 800-88 Standard
        </h2>
        <p>
          {brand} implements comprehensive technical and operational safeguards conforming to ISO/IEC 27001 standards and Rule 8 of the IT (Reasonable Security Practices) Rules, 2011.
        </p>
        <p>
          All secondary storage media (hard disk drives, NVMe solid state drives) sourced via enterprise liquidation or returned at lease completion undergo rigorous multi-pass cryptographic data sanitization conforming to <strong>NIST SP 800-88 Rev. 1 (Guidelines for Media Sanitization)</strong>. No storage drive is ever redeployed or resold with remnant client data.
        </p>
      </section>

      <section id="principal-rights" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          7. Rights of Data Principals (DPDP Act, 2023)
        </h2>
        <p>
          Every Data Principal whose personal data is processed by {brand} possesses the following statutory rights under Chapter III of the DPDP Act 2023:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Right to Access:</strong> The right to obtain a summary of personal data being processed and the identities of data fiduciaries with whom such data has been shared.</li>
          <li><strong>Right to Correction & Erasure:</strong> The right to request rectification of inaccurate or misleading data and completion of incomplete records.</li>
          <li><strong>Right to Erasure:</strong> The right to request deletion of personal data where retention is no longer necessary, subject to prevailing Indian statutory retention mandates.</li>
          <li><strong>Right of Grievance Redressal:</strong> The right to lodge a formal complaint with our Statutory Grievance Officer and subsequently escalate to the Data Protection Board of India.</li>
          <li><strong>Right to Nominate:</strong> The right to designate any other individual to exercise rights on their behalf in the event of death or incapacity.</li>
        </ul>
        <p className="pt-1">
          To exercise any of these statutory rights, submit an official request via our dedicated{' '}
          <Link to="/grievance" className="text-[#8A5E12] font-bold underline">
            Data Deletion & Grievance Redressal Portal
          </Link>
          .
        </p>
      </section>

      <section id="cross-border" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          8. Cross-Border Data Transfers
        </h2>
        <p>
          Personal data collected by {brand} is stored on secure cloud and on-premise infrastructure physically located within the sovereign territory of the Republic of India. No personal data is transferred outside India except in strict compliance with Central Government notifications and Section 16 of the DPDP Act 2023.
        </p>
      </section>

      <section id="children-data" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          9. Protection of Children’s Data
        </h2>
        <p>
          Our services are exclusively intended for commercial enterprises, institutional purchasers, and corporate entities. We do not knowingly solicit, collect, or process personal data relating to minors (individuals below 18 years of age) under Section 9 of the DPDP Act 2023.
        </p>
      </section>

      <section id="grievance-redressal" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          10. Statutory Grievance Redressal Mechanism
        </h2>
        <p>
          Pursuant to Section 13 of the DPDP Act 2023 and Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the Company has designated the following Statutory Grievance Redressal Officer:
        </p>
        <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4A24C]/35 space-y-1.5 text-xs">
          <p><strong>Name:</strong> {grievance.name}</p>
          <p><strong>Designation:</strong> {grievance.designation}</p>
          <p><strong>Postal Address:</strong> {grievance.address}</p>
          <p><strong>Direct Desk:</strong> {grievance.phone}</p>
          <p><strong>Official Email:</strong> <a href={`mailto:${grievance.email}`} className="text-[#8A5E12] underline">{grievance.email}</a></p>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-[#D4A24C]/20">
            <strong>Statutory Turnaround Timeline:</strong> All privacy grievances shall be acknowledged within <strong>24 hours</strong> of receipt and resolved conclusively within <strong>30 calendar days</strong>.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
