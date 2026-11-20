/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
  Printer,
  Calendar,
  ChevronRight,
  Scale
} from 'lucide-react';
import { useCompany } from '../context/SettingsContext';

export default function LegalLayout({
  title,
  subtitle,
  _policyKey = 'policy',
  toc = [],
  children
}) {
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';
  const legalVersion = company?.legal_version || '1.0';
  const [activeSection, setActiveSection] = useState(toc[0]?.id || '');

  useEffect(() => {
    if (!toc || toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -65% 0px' }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  const formattedDate = useMemo(() => {
    const raw = company?.legal_last_updated || '2026-01-01T00:00:00Z';
    return new Date(raw).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [company]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8 font-sans">
      <Helmet>
        <title>{title} | {brandName} Enterprise Legal</title>
        <meta
          name="description"
          content={`${title} for ${brandName} corporate IT hardware procurement, rentals, and asset disposition.`}
        />
      </Helmet>

      {/* Statutory Advocate Review Notice */}
      <div className="bg-[#FAF7F2] border border-[#D4A24C]/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-[#8A5E12] shadow-2xs print:hidden">
        <Scale className="w-5 h-5 text-[#8A5E12] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block uppercase tracking-wider font-mono text-[10.5px]">
            Statutory Legal Review Notice (Draft Specimen)
          </strong>
          <p className="leading-relaxed text-[#5A6B63]">
            This policy document is drafted under the provisions of the Information Technology Act 2000, IT (Intermediary Guidelines) Rules 2021, Digital Personal Data Protection (DPDP) Act 2023, Consumer Protection (E-Commerce) Rules 2020, and E-Waste (Management) Rules 2022. It must be formally reviewed by a qualified Indian advocate / corporate legal counsel prior to final commercial execution.
          </p>
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D4A24C]/25">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8A5E12] font-semibold">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/legal" className="hover:underline">Legal & Governance</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0D3B2A]">{title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3B2A] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#5A6B63] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] font-mono text-slate-600">
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D4A24C]/30 text-[#0D3B2A] font-bold">
              Version {legalVersion}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-[#8A5E12]" />
              Last Updated: {formattedDate}
            </span>
            <span>•</span>
            <span className="text-slate-500">
              Jurisdiction: {company?.jurisdiction_city || 'New Delhi'}, India
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-full bg-white border border-[#D4A24C]/40 hover:bg-[#FAF7F2] text-[#0D3B2A] font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-2xs active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-[#8A5E12]" />
            <span>Print Policy Document</span>
          </button>
        </div>
      </div>

      {/* Main Grid: TOC + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents (TOC) */}
        {toc && toc.length > 0 && (
          <aside className="lg:col-span-4 sticky top-28 bg-white rounded-3xl border border-[#D4A24C]/25 p-6 shadow-sm space-y-4 print:hidden">
            <div className="flex items-center gap-2 border-b border-[#D4A24C]/20 pb-3">
              <FileText className="w-4 h-4 text-[#8A5E12]" />
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#0D3B2A]">
                Document Sections
              </h2>
            </div>
            <nav className="space-y-1 text-xs">
              {toc.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className={`block py-1.5 px-2.5 rounded-lg transition line-clamp-1 border-l-2 ${
                      isActive
                        ? 'bg-[#FAF7F2] text-[#0D3B2A] font-bold border-[#D4A24C]'
                        : 'border-transparent text-slate-600 hover:text-[#0D3B2A] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="font-mono text-[#8A5E12] mr-1.5">{idx + 1}.</span>
                    {item.title}
                  </a>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#D4A24C]/15 text-[11px] text-slate-500 space-y-1">
              <span className="block font-semibold text-[#0D3B2A]">Need compliance assistance?</span>
              <p>
                Reach our statutory legal desk at{' '}
                <a href={`mailto:${company?.grievance_officer?.email || 'grievance@example.com'}`} className="text-[#8A5E12] underline font-mono">
                  {company?.grievance_officer?.email || 'grievance@example.com'}
                </a>
              </p>
            </div>
          </aside>
        )}

        {/* Policy Body */}
        <div className={`${toc && toc.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-3xl border border-[#D4A24C]/25 p-7 sm:p-10 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed`}>
          {children}
        </div>
      </div>
    </div>
  );
}
