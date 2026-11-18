import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Award,
  Truck,
  FileText,
  Lock,
  RotateCcw,
  Building2,
  Check
} from 'lucide-react';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-14 select-none">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#8A5E12] font-bold block">
          — CERTIFIED ENTERPRISE INFRASTRUCTURE
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0D3B2A] tracking-tight">
          Pioneering Authentic IT Infrastructure
        </h1>
        <p className="text-sm sm:text-base text-[#5A6B63] leading-relaxed">
          Founded with an uncompromised vision: empower enterprises, high-growth startups, and institutions with commercial-grade computing power, certified hardware testing, and ironclad replacement SLAs.
        </p>
      </div>

      {/* Stats Counter - Al-Tooba Luxury Styling */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 bg-white rounded-3xl border border-[#D4A24C]/25 shadow-sm text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3B2A]">1,450+</div>
          <div className="text-xs text-[#5A6B63] font-semibold mt-1 uppercase tracking-wider">Ready Fleets</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-[#8A5E12]">120+</div>
          <div className="text-xs text-[#5A6B63] font-semibold mt-1 uppercase tracking-wider">Corporate Clients</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3B2A]">24–48h</div>
          <div className="text-xs text-[#5A6B63] font-semibold mt-1 uppercase tracking-wider">Replacement SLA</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-[#8A5E12]">100%</div>
          <div className="text-xs text-[#5A6B63] font-semibold mt-1 uppercase tracking-wider">GSTR-2B Tax Credit</div>
        </div>
      </div>

      {/* Navigation Pills for Policies & Background */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#D4A24C]/20 pb-4">
        {[
          { id: 'overview', label: 'Company Overview' },
          { id: 'diagnostics', label: '30-Point Testing Protocol' },
          { id: 'privacy', label: 'Privacy & Data Governance' },
          { id: 'terms', label: 'Terms & Conditions' },
          { id: 'dispatch', label: 'Pan-India Dispatch Policy' },
          { id: 'replacement', label: 'Replacement Policy' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0D3B2A] text-white shadow-md'
                : 'bg-white text-[#5A6B63] hover:text-[#0D3B2A] border border-[#D4A24C]/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 bg-white rounded-3xl border border-[#D4A24C]/20 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] text-[#0D3B2A] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-[#8A5E12]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#0D3B2A]">Commercial Grade Only</h3>
              <p className="text-xs text-[#5A6B63] leading-relaxed">
                We exclusively procure magnesium-alloy commercial series (Lenovo ThinkPad, Dell Latitude, HP EliteBook). Zero consumer grade machines, guaranteeing maximum operational durability.
              </p>
            </div>

            <div className="p-7 bg-white rounded-3xl border border-[#D4A24C]/20 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] text-[#0D3B2A] flex items-center justify-center font-bold">
                <Wrench className="w-6 h-6 text-[#8A5E12]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#0D3B2A]">Chip-Level Diagnostic Lab</h3>
              <p className="text-xs text-[#5A6B63] leading-relaxed">
                Equipped with thermal imaging, BGA diagnostics, and battery cycle testers. Every motherboard, heatsink, and RAM socket is inspected under rigorous thermal stress testing.
              </p>
            </div>

            <div className="p-7 bg-white rounded-3xl border border-[#D4A24C]/20 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] text-[#0D3B2A] flex items-center justify-center font-bold">
                <Award className="w-6 h-6 text-[#8A5E12]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#0D3B2A]">Clean Legal Pedigree</h3>
              <p className="text-xs text-[#5A6B63] leading-relaxed">
                All inventory enters our warehouse through verified enterprise refresh cycles and official ITAD liquidations. 100% tax-invoiced with genuine Windows Pro licensing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 30-Point Diagnostics */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-6 shadow-sm animate-in fade-in duration-300">
          <h2 className="text-2xl font-serif font-bold text-[#0D3B2A]">
            The 30-Point Rigorous Hardware Diagnostics
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6B63] leading-relaxed">
            Before any machine is cleared for corporate lease or wholesale dispatch, our certified engineers execute an exhaustive 3-stage validation suite:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-xs text-[#0D3B2A]">
            {[
              'MemTest86 100% RAM Bit-Error Pass',
              'CrystalDiskInfo NVMe Health > 90%',
              'FurMark GPU Thermal Stress Test',
              'Prime95 CPU Core Max Load Verification',
              'Battery Health > 80% Original Design Capacity',
              'Backlit Keyboard Every Key Strike Test',
              'Full Display Dead Pixel & Uniformity Scan',
              'Type-C Thunderbolt Power Delivery Test',
              'Dual-Band Wi-Fi 6 & Bluetooth Range Check',
              'Stereo Microphone & Web Camera Validation',
              'Internal Heatsink Cleaned & Repasted',
              'NIST 800-88 Cryptographic SSD Erase'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#D4A24C]/20">
                <Check className="w-4 h-4 text-[#8A5E12] shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Privacy & Data Governance */}
      {activeTab === 'privacy' && (
        <div id="privacy" className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-5 shadow-sm animate-in fade-in duration-300">
          <h2 className="text-2xl font-serif font-bold text-[#0D3B2A]">Privacy & Data Governance Policy</h2>
          <div className="text-xs sm:text-sm text-[#5A6B63] space-y-4 leading-relaxed font-sans">
            <p>
              Nova Infotech Solutions operates under strict enterprise data privacy compliance. We never monetize, share, or disclose client procurement records, lease contracts, or contact details to third parties.
            </p>
            <h3 className="font-bold text-[#0D3B2A] text-sm font-serif">NIST 800-88 Data Sanitization</h3>
            <p>
              All hardware sourced through corporate liquidation undergoes certified NIST 800-88 Rev. 1 cryptographic data wiping. Hard drives and SSDs are completely sanitized before resale or lease, and formal Certificates of Data Destruction are provided to corporate clients upon request.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Terms & Conditions */}
      {activeTab === 'terms' && (
        <div id="terms" className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-5 shadow-sm animate-in fade-in duration-300">
          <h2 className="text-2xl font-serif font-bold text-[#0D3B2A]">Terms of Commercial Hardware Sale</h2>
          <div className="text-xs sm:text-sm text-[#5A6B63] space-y-4 leading-relaxed font-sans">
            <p>
              All corporate orders placed via Nova Infotech are subject to formal quotation sign-off and tax invoicing. Prices shown are wholesale base rates and are subject to 18% GST with full GSTR-2B input tax credit eligibility.
            </p>
            <h3 className="font-bold text-[#0D3B2A] text-sm font-serif">Commercial Warranty</h3>
            <p>
              Hardware sold outright comes with standard 6 to 12 months comprehensive hardware replacement warranty against component failure (motherboard, screen, battery, power adapter).
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Dispatch Policy */}
      {activeTab === 'dispatch' && (
        <div id="dispatch" className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-5 shadow-sm animate-in fade-in duration-300">
          <h2 className="text-2xl font-serif font-bold text-[#0D3B2A]">Pan-India Dispatch & Logistics Policy</h2>
          <div className="text-xs sm:text-sm text-[#5A6B63] space-y-4 leading-relaxed font-sans">
            <p>
              We maintain centralized fulfillment depots in Bangalore, Delhi NCR, and Mumbai. Standard dispatches are executed within 24–48 hours of purchase order (PO) confirmation.
            </p>
            <h3 className="font-bold text-[#0D3B2A] text-sm font-serif">Transit Insurance & Shockproof Packaging</h3>
            <p>
              All machines are shipped in custom anti-static foam sleeves inside heavy-gauge corrugated cartons with 100% full-value transit insurance coverage against loss or courier damage.
            </p>
          </div>
        </div>
      )}

      {/* Tab 6: Hardware Replacement Policy */}
      {activeTab === 'replacement' && (
        <div id="replacement" className="bg-white rounded-3xl border border-[#D4A24C]/25 p-8 sm:p-10 space-y-5 shadow-sm animate-in fade-in duration-300">
          <h2 className="text-2xl font-serif font-bold text-[#0D3B2A]">Hardware Replacement SLA Guarantee</h2>
          <div className="text-xs sm:text-sm text-[#5A6B63] space-y-4 leading-relaxed font-sans">
            <p>
              Our flagship corporate commitment: if any leased machine encounters a hardware fault, our technical team executes a 24–48 hour standby machine swap on-site, ensuring zero downtime for your workforce.
            </p>
            <h3 className="font-bold text-[#0D3B2A] text-sm font-serif">Zero-Hassle Process</h3>
            <p>
              Simply email <strong className="text-[#0D3B2A]">procurement@novainfotech.in</strong> or notify our desk. We dispatch an identical replacement laptop immediately without waiting for repairs or manufacturer RMA delays.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
