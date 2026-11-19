import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useCompany } from '../context/SettingsContext';

export default function WhatsAppFloat() {
  const { company } = useCompany();
  const rawNumber = company?.whatsapp || '+91 XXXXX XXXXX';
  // Strip non-digit characters for the wa.me link
  const digitsOnly = rawNumber.replace(/\D/g, '');
  const brandName = company?.brand_name || 'Demo Infotech';

  const whatsappText = encodeURIComponent(
    `Hello ${brandName}, we require corporate bulk hardware / laptops for our office.`
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 pointer-events-auto">
      {/* Sleek Floating WhatsApp Icon */}
      <a
        href={digitsOnly ? `https://wa.me/${digitsOnly}?text=${whatsappText}` : '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#072117]/90 hover:bg-[#072117] border border-[#D4A24C]/60 text-[#25D366] shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group backdrop-blur-md"
        title={`Chat with ${brandName} Corporate IT Desk on WhatsApp`}
      >
        <MessageCircle className="w-6 h-6 fill-current text-[#25D366] group-hover:scale-105 transition-transform" />
      </a>
    </div>
  );
}
