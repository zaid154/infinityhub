import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Percent,
  FileCheck2,
  Building2,
  Clock,
  Check
} from 'lucide-react';
import RentalCalculator from '../components/RentalCalculator';

export default function RentalPlans() {
  const { openRFQ } = useOutletContext();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-14 select-none">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#8A5E12] font-bold block">
          — ZERO CAPEX CORPORATE INFRASTRUCTURE
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0D3B2A] tracking-tight">
          Flexible Enterprise IT Fleet Leasing
        </h1>
        <p className="text-sm sm:text-base text-[#5A6B63] leading-relaxed">
          Scale your workforce with certified Grade A+ commercial laptops (ThinkPad, Latitude, EliteBook) on flexible monthly contracts with guaranteed on-site maintenance and zero capital expenditure.
        </p>
      </div>

      {/* Interactive Luxury Rental Estimator */}
      <RentalCalculator onOpenRFQ={openRFQ} />

      {/* Dedicated Rental SLA Terms & Enterprise Guarantees (#sla) */}
      <section id="sla" className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
            — SERVICE LEVEL AGREEMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Ironclad Corporate Rental SLA Terms
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63]">
            Every corporate rental contract is governed by standard enterprise-grade commitments:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">24–48h Standby Swap SLA</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              If any leased machine encounters a hardware fault, we deliver a pre-configured replacement machine on-site within 24 to 48 hours. Zero workforce downtime.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">100% GSTR-2B Input Tax Credit</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              Monthly lease invoices carry full 18% GST credits directly verifiable on your GST portal. 100% tax-deductible as Operational Expenditure (OPEX).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">Free Maintenance & Repairs</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              All ongoing technical diagnostics, thermal repasting, RAM/SSD upgrades, and battery replacements are provided completely free of charge during the rental term.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">Flexible Tenures (1–36 Months)</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              Start with a 1-month trial, a 6-month project term, or a multi-year fleet contract. Scale up or scale down machine counts as your hiring fluctuates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">Clean OS Imaging Included</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              Machines arrive pre-loaded with genuine Windows 11 Pro 64-bit and your organization's custom enterprise software stack, ready for immediate employee sign-in.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4A24C]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B2A] text-[#D4A24C] flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#0D3B2A]">Up to 15% Long-Term Rebates</h3>
            <p className="text-xs text-[#5A6B63] leading-relaxed">
              Tier discounts of 5% on 6-month leases and 15% on 12+ month contracts, plus volume bonuses on fleets of 25+ and 50+ laptops.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => openRFQ('Formal Enterprise Fleet Rental SLA Contract Inquiry')}
            className="px-8 py-3.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-sans font-bold text-xs uppercase tracking-widest shadow-md transition cursor-pointer"
          >
            Request Fleet Lease SLA Contract
          </button>
        </div>
      </section>
    </div>
  );
}
