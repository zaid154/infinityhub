/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Scale,
  ShieldCheck,
  Lock,
  Truck,
  RotateCcw,
  Cookie,
  AlertTriangle,
  Award,
  Recycle,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useCompany } from '../context/SettingsContext';

export default function Legal() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';

  const policies = [
    {
      title: '1. Privacy Policy & Data Governance',
      desc: 'Compliance framework conforming to the Digital Personal Data Protection (DPDP) Act 2023, data fiduciary obligations, and principal rights.',
      path: '/privacy',
      icon: Lock,
      tag: 'DPDP Act 2023'
    },
    {
      title: '2. Terms of Commercial Sale & Supply',
      desc: 'Master commercial terms governing B2B hardware procurement, GST invoicing, risk transfer, and Indian arbitration.',
      path: '/terms',
      icon: Scale,
      tag: 'B2B Contract'
    },
    {
      title: '3. Corporate Rental SLA Terms',
      desc: 'Master service level agreement covering operating hardware leases, 24–48h standby replacement turnaround, and covered cities.',
      path: '/rental-sla',
      icon: ShieldCheck,
      tag: '24-48h SLA'
    },
    {
      title: '4. Refund, Cancellation & Return Policy',
      desc: 'Order cancellation windows, 48-hour Dead-on-Arrival (DOA) replacement workflows, and rental security deposit refunds.',
      path: '/refund-policy',
      icon: RotateCcw,
      tag: '48h DOA'
    },
    {
      title: '5. Commercial Hardware Warranty Policy',
      desc: 'Comprehensive coverage specifications across refurbished tiers (6–12 months), logic boards, power rails, and battery health.',
      path: '/warranty-policy',
      icon: Award,
      tag: '6–12 Months'
    },
    {
      title: '6. Shipping & Pan-India Dispatch Policy',
      desc: 'Central fulfillment depot procedures, 100% full-value marine cargo transit insurance, and WFH employee doorstep logistics.',
      path: '/shipping-policy',
      icon: Truck,
      tag: 'Insured Cargo'
    },
    {
      title: '7. Hardware Replacement & Hot-Swap Policy',
      desc: 'Zero-downtime hot-swap protocol: advance replacement machine dispatch within 30 days of purchase or throughout rental leases.',
      path: '/replacement-policy',
      icon: RotateCcw,
      tag: 'Hot-Swap'
    },
    {
      title: '8. Cookie Policy & Web Telemetry',
      desc: 'Granular breakdown of strictly necessary, functional, and performance cookies with browser opt-out controls.',
      path: '/cookie-policy',
      icon: Cookie,
      tag: 'No Tracking'
    },
    {
      title: '9. Legal & Operational Disclaimer',
      desc: 'OEM trademark ownership disclosures (Dell, HP, Lenovo, NVIDIA), illustrative stock imagery, and advisory limitations.',
      path: '/disclaimer',
      icon: AlertTriangle,
      tag: 'Non-Affiliation'
    },
    {
      title: '10. Refurbished Quality & Grading Disclosure',
      desc: 'Our 3-tier grading matrix (Grade A+/A/B), 30-point diagnostics protocol, and minimum 80% battery capacity threshold.',
      path: '/refurbished-disclosure',
      icon: Award,
      tag: '30-Pt Diagnostic'
    },
    {
      title: '11. E-Waste Management & EPR Compliance',
      desc: 'E-Waste (Management) Rules 2022 framework, CPCB EPR registration reference, and NIST SP 800-88 data sanitization.',
      path: '/ewaste-policy',
      icon: Recycle,
      tag: 'CPCB EPR'
    },
    {
      title: '12. Data Deletion & Grievance Redressal',
      desc: 'Designated Statutory Grievance Redressal Officer under IT Rules 2021 & DPDP Act 2023 with interactive online filing form.',
      path: '/grievance',
      icon: FileText,
      tag: '24h Statutory Ack'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12 font-sans">
      <Helmet>
        <title>Legal & Compliance Hub | {brand}</title>
        <meta
          name="description"
          content={`Browse all statutory policies, DPDP Act 2023 disclosures, commercial terms, rental SLAs, and grievance mechanisms for ${brand}.`}
        />
      </Helmet>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#8A5E12] font-bold block">
          — STATUTORY COMPLIANCE & LEGAL FRAMEWORK
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0D3B2A] tracking-tight">
          Legal & Governance Hub
        </h1>
        <p className="text-sm sm:text-base text-[#5A6B63] leading-relaxed">
          Comprehensive statutory policy documentation for <strong>{legal}</strong> conforming to Indian corporate, commercial contract, e-commerce, consumer protection, and data privacy legislation.
        </p>
      </div>

      {/* Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((p, idx) => {
          const Icon = p.icon;
          return (
            <Link
              key={idx}
              to={p.path}
              className="p-6 bg-white rounded-3xl border border-[#D4A24C]/25 hover:border-[#0D3B2A] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/30 flex items-center justify-center text-[#8A5E12] group-hover:bg-[#0D3B2A] group-hover:text-[#D4A24C] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF7F2] text-[#8A5E12] border border-[#D4A24C]/30">
                    {p.tag}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-[#0D3B2A] text-base group-hover:text-[#8A5E12] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-[#5A6B63] leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0D3B2A] group-hover:text-[#8A5E12]">
                <span>Read Policy Document</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Statutory Footer Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#D4A24C]/30 shadow-sm space-y-3 text-xs text-[#5A6B63]">
        <h3 className="font-serif font-bold text-[#0D3B2A] text-base">
          Legal Verification & Dispute Settlement
        </h3>
        <p className="leading-relaxed">
          All contracts and transactions executed via {brand} are governed by the substantive laws of India. Commercial disputes are subject to binding arbitration under the <em>Arbitration and Conciliation Act, 1996</em> with seat and exclusive judicial jurisdiction situated at <strong>{jurisdiction}</strong>, India.
        </p>
      </div>
    </div>
  );
}
