/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import LegalLayout from '../../components/LegalLayout';
import { useCompany } from '../../context/SettingsContext';

export default function CookiePolicyPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';

  const toc = [
    { id: 'cookie-nature', title: 'What Are Cookies & Web Technologies?' },
    { id: 'statutory-basis', title: 'Statutory Basis & DPDP Act 2023 Compliance' },
    { id: 'cookie-categories', title: 'Table of Deployed Cookies' },
    { id: 'browser-management', title: 'How to Manage & Disable Cookies in Browser' },
    { id: 'policy-updates', title: 'Updates to Cookie Governance' }
  ];

  const handleResetConsent = () => {
    localStorage.removeItem('demo_cookie_consent');
    window.location.reload();
  };

  return (
    <LegalLayout
      title="Cookie Policy & Web Telemetry"
      subtitle="Transparency report detailing session cookies, performance telemetry, and consent choices under Indian IT & DPDP regulations."
      policyKey="cookie-policy"
      toc={toc}
    >
      <section id="cookie-nature" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. What Are Cookies & Web Technologies?
        </h2>
        <p>
          This Cookie Policy explains how <strong>{legal}</strong> (<strong>"{brand}"</strong>) utilizes cookies, pixel tags, and local storage tokens when corporate users visit our website and catalog management portals. Cookies are small alphanumeric text files stored on your computer or mobile device to preserve your session state and enable efficient platform navigation.
        </p>
      </section>

      <section id="statutory-basis" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. Statutory Basis & DPDP Act 2023 Compliance
        </h2>
        <p>
          In alignment with the <em>Digital Personal Data Protection Act, 2023</em> and the <em>Information Technology Act, 2000</em>, {brand} does not deploy non-essential tracking cookies or profiling scripts prior to receiving affirmative user consent.
        </p>
        <p>
          Strictly necessary session cookies are deployed on the basis of legitimate operational necessity to maintain cybersecurity, authenticate user login tokens, and process procurement shopping carts.
        </p>
      </section>

      <section id="cookie-categories" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Table of Deployed Cookies
        </h2>
        <div className="overflow-x-auto border border-[#D4A24C]/25 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#072117] text-[#FAF7F2] font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Cookie Name</th>
                <th className="p-3">Purpose & Description</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4A24C]/15 font-sans bg-white">
              <tr className="hover:bg-[#FAF7F2]/60">
                <td className="p-3 font-bold text-[#0D3B2A]">Strictly Necessary</td>
                <td className="p-3 font-mono text-slate-700">app_auth_token</td>
                <td className="p-3 text-slate-600">Encrypted JWT token preserving corporate user authentication and dashboard session.</td>
                <td className="p-3 font-mono">7 Days</td>
                <td className="p-3">{brand} (First-Party)</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2]/60">
                <td className="p-3 font-bold text-[#0D3B2A]">Strictly Necessary</td>
                <td className="p-3 font-mono text-slate-700">demo_cookie_consent</td>
                <td className="p-3 text-slate-600">Stores user cookie preference choices to prevent repeated modal prompts.</td>
                <td className="p-3 font-mono">1 Year</td>
                <td className="p-3">{brand} (First-Party)</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2]/60">
                <td className="p-3 font-bold text-[#0D3B2A]">Functional</td>
                <td className="p-3 font-mono text-slate-700">cart_state</td>
                <td className="p-3 text-slate-600">Preserves wholesale product selections and rental fleet calculations in cart.</td>
                <td className="p-3 font-mono">Session / 30 Days</td>
                <td className="p-3">{brand} (First-Party)</td>
              </tr>
              <tr className="hover:bg-[#FAF7F2]/60">
                <td className="p-3 font-bold text-[#0D3B2A]">Analytics (Optional)</td>
                <td className="p-3 font-mono text-slate-700">_gid, _ga</td>
                <td className="p-3 text-slate-600">Aggregated anonymized page dwell time and catalog bounce rate measurement.</td>
                <td className="p-3 font-mono">24h - 2 Years</td>
                <td className="p-3">Google Analytics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="browser-management" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. How to Manage & Disable Cookies in Your Browser
        </h2>
        <p>
          Corporate IT administrators and users can control or block cookies at the browser level:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data.</li>
          <li><strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Enhanced Tracking Protection.</li>
          <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies.</li>
          <li><strong>Apple Safari:</strong> Preferences → Privacy → Block all cookies.</li>
        </ul>
        <p className="pt-2">
          You can also reset your cookie consent on this website at any time by clicking the button below:
        </p>
        <div className="pt-1">
          <button
            onClick={handleResetConsent}
            className="px-4 py-2 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs cursor-pointer shadow-sm transition"
          >
            Reset Cookie Consent Choices
          </button>
        </div>
      </section>

      <section id="policy-updates" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          5. Updates to Cookie Governance
        </h2>
        <p>
          We may update this Cookie Policy periodically to reflect changes in our web infrastructure or Indian statutory requirements. All revisions shall be published on this page with an updated version timestamp.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Compliance Cell:</strong> Jurisdiction: <strong>{jurisdiction}</strong>, India.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
