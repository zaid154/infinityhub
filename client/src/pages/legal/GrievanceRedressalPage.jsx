/* DRAFT – to be reviewed by a practising advocate/CA before publishing */
import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import LegalLayout from '../../components/LegalLayout';
import ThemeSelect from '../../components/ThemeSelect';
import { useCompany } from '../../context/SettingsContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function GrievanceRedressalPage() {
  const { company } = useCompany();
  const brand = company?.brand_name || 'Demo Infotech';
  const legal = company?.legal_name || 'Demo Infotech Private Limited [PLACEHOLDER]';
  const jurisdiction = company?.jurisdiction_city || 'New Delhi';
  const grievance = company?.grievance_officer || {
    name: 'Statutory Grievance Officer [PLACEHOLDER]',
    designation: 'Head of Legal & Enterprise Compliance',
    email: 'grievance@example.com [PLACEHOLDER]',
    phone: '+91 XXXXX XXXXX [PLACEHOLDER]',
    address: 'Unit No. 101, Legal Grievance Cell, Connaught Place, New Delhi 110001 [PLACEHOLDER]'
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    request_type: 'data_erasure',
    description: '',
    consent_confirmed: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.description) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/grievance/submit', formData);
      if (res.data?.success) {
        toast.success(`Grievance lodged successfully! Ticket: ${res.data.ticket_number}`);
        setTicketResult(res.data);
      } else {
        toast.error(res.data?.message || 'Submission could not be completed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit grievance. Please email our officer directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const toc = [
    { id: 'statutory-framework', title: 'Statutory Grievance Mechanism & Timelines' },
    { id: 'officer-contact', title: 'Designated Statutory Officer Contact' },
    { id: 'interactive-form', title: 'Lodge Official Grievance or Deletion Request' },
    { id: 'escalation', title: 'Escalation to Data Protection Board of India' }
  ];

  return (
    <LegalLayout
      title="Data Deletion & Statutory Grievance Redressal"
      subtitle="Institutional redressal mechanism pursuant to Section 13 of the Digital Personal Data Protection Act, 2023 and Rule 3(2) of the Information Technology Rules, 2021."
      policyKey="grievance"
      toc={toc}
    >
      <section id="statutory-framework" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          1. Statutory Grievance Mechanism & Timelines
        </h2>
        <p>
          In accordance with the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> and Rule 3(2) of the <em>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</em>, <strong>{legal}</strong> (<strong>"{brand}"</strong>) has instituted a formalized, time-bound Grievance Redressal Mechanism.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/35 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#8A5E12] font-bold block">
              Statutory Acknowledgement
            </span>
            <span className="text-base font-serif font-bold text-[#0D3B2A] block">Within 24 Hours</span>
            <p className="text-[11px] text-slate-600">Every grievance is logged with a unique tracked ticket reference number.</p>
          </div>
          <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/35 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#8A5E12] font-bold block">
              Conclusive Resolution
            </span>
            <span className="text-base font-serif font-bold text-[#0D3B2A] block">Within 30 Days</span>
            <p className="text-[11px] text-slate-600">Statutory resolution pursuant to Section 13(2) of the DPDP Act 2023.</p>
          </div>
        </div>
      </section>

      <section id="officer-contact" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          2. Designated Statutory Grievance Redressal Officer
        </h2>
        <p>
          The competent officer designated by the Board of Directors to receive and resolve privacy and data grievances is:
        </p>
        <div className="p-5 bg-white rounded-2xl border border-[#D4A24C]/35 shadow-xs space-y-2 text-xs">
          <p className="text-sm font-serif font-bold text-[#0D3B2A]">{grievance.name}</p>
          <p className="text-[#8A5E12] font-semibold">{grievance.designation}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1 border-t border-slate-100">
            <p><strong>Physical Office:</strong> {grievance.address}</p>
            <p><strong>Direct Calling Desk:</strong> {grievance.phone}</p>
            <p><strong>Statutory Email:</strong> <a href={`mailto:${grievance.email}`} className="text-[#8A5E12] underline">{grievance.email}</a></p>
            <p><strong>Operating Hours:</strong> Monday – Saturday: 10:00 AM – 6:00 PM IST</p>
          </div>
        </div>
      </section>

      <section id="interactive-form" className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          3. Lodge Official Grievance or Deletion Request
        </h2>
        <p>
          Use this interactive form to lodge an official complaint, invoke your rights as a Data Principal, or request complete cryptographic data deletion:
        </p>

        {ticketResult ? (
          <div className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-3xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Grievance Registered Successfully</span>
            </div>
            <p className="text-xs text-slate-700">
              Your official grievance reference has been generated and dispatched to the Statutory Grievance Officer:
            </p>
            <div className="p-3 bg-white rounded-xl border border-emerald-300 font-mono text-sm text-[#0D3B2A] font-bold">
              Ticket Number: {ticketResult.ticket_number}
            </div>
            <p className="text-[11px] text-slate-600">
              A formal acknowledgement has been dispatched to <strong>{ticketResult.request?.email}</strong>. Statutory turnaround: Acknowledged within 24 hours · Conclusively resolved within 30 days.
            </p>
            <button
              onClick={() => {
                setTicketResult(null);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  company_name: '',
                  request_type: 'data_erasure',
                  description: '',
                  consent_confirmed: true
                });
              }}
              className="text-xs font-bold text-[#0D3B2A] underline cursor-pointer"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-[#FAF7F2] rounded-3xl border border-[#D4A24C]/35 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Menta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Corporate / Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram@enterprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98100 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0D3B2A] mb-1">Company / Entity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Enterprise Solutions Pvt Ltd"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Nature of Statutory Request *</label>
              <ThemeSelect
                options={[
                  { value: 'data_erasure', label: 'DPDP Act Sec 12: Request for Complete Data Erasure / Deletion' },
                  { value: 'data_access', label: 'DPDP Act Sec 11: Request for Summary of Personal Data Processed' },
                  { value: 'data_correction', label: 'DPDP Act Sec 12: Request for Data Rectification / Update' },
                  { value: 'opt_out_marketing', label: 'Consent Withdrawal & Marketing Communication Opt-Out' },
                  { value: 'general_complaint', label: 'IT Rules 2021: Commercial Hardware / SLA Grievance' }
                ]}
                value={formData.request_type}
                onChange={(val) => setFormData({ ...formData, request_type: val })}
                variant="form"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0D3B2A] mb-1">Detailed Description of Grievance *</label>
              <textarea
                required
                rows={4}
                placeholder="State the exact nature of your grievance, specific data records to be purged, or invoice reference numbers..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-white border border-[#D4A24C]/30 text-[#0D3B2A] rounded-xl focus:outline-none focus:border-[#0D3B2A] resize-none"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 select-none pt-1">
              <input
                type="checkbox"
                required
                checked={formData.consent_confirmed}
                onChange={(e) => setFormData({ ...formData, consent_confirmed: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-[#0D3B2A] rounded shrink-0 cursor-pointer"
              />
              <span>
                I solemnly affirm that the information submitted is true and correct, and I am the authorized Data Principal or designated corporate representative under Indian law.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98 disabled:opacity-50 cursor-pointer border border-[#D4A24C]/40"
            >
              <Send className="w-3.5 h-3.5 text-[#D4A24C]" />
              <span>{submitting ? 'Lodging Statutory Ticket...' : 'Lodge Official Grievance Ticket'}</span>
            </button>
          </form>
        )}
      </section>

      <section id="escalation" className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#0D3B2A] border-b border-slate-200 pb-1.5">
          4. Escalation to Data Protection Board of India
        </h2>
        <p>
          If a Data Principal does not receive an acknowledgement within 24 hours or is dissatisfied with the resolution provided by our Statutory Grievance Redressal Officer within 30 days, the Data Principal has the statutory right to escalate the complaint to the <strong>Data Protection Board of India</strong> pursuant to Section 13(3) of the DPDP Act 2023.
        </p>
        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D4A24C]/30 text-xs">
          <p><strong>Corporate Jurisdiction:</strong> Courts of <strong>{jurisdiction}</strong>, India have exclusive jurisdiction.</p>
        </div>
      </section>
    </LegalLayout>
  );
}
