import React from 'react';
import {
  Server,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Award,
  Users,
  Building,
  Truck
} from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          Corporate Background & Testing Lab
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Pioneering Reliable Enterprise IT Infrastructure
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Founded with a clear vision: empower growing Indian enterprises, IT startups, and BPOs with commercial-grade computing power without the crushing cost of brand-new retail machines.
        </p>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono">1,450+</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Ready Stock Units</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">120+</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Active Enterprise Clients</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">24h</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Hardware Replacement SLA</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 font-mono">100%</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Tax Compliant GST Bills</div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-7 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Commercial Grade Only</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We exclusively procure magnesium-alloy commercial series (Lenovo ThinkPad, Dell Latitude, HP EliteBook). We do not deal in flimsy plastic consumer machines, ensuring exceptional longevity for workforces.
          </p>
        </div>

        <div className="p-7 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">In-House Chip-Level Lab</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our refurbishment facility is equipped with BGA rework stations, thermal imaging cameras, and battery diagnostic analyzers. Every motherboard, heatsink, and RAM socket is inspected with micro precision.
          </p>
        </div>

        <div className="p-7 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Clean Legal Pedigree</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All devices enter our facility through corporate refresh cycles and legitimate corporate liquidations. Every unit is cataloged with serial numbers, asset tags, and 100% GST tax invoices.
          </p>
        </div>
      </div>
    </div>
  );
}
