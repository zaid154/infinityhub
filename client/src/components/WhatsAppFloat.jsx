import React from 'react';
import { MessageCircle, FileText } from 'lucide-react';

export default function WhatsAppFloat({ onOpenRFQ }) {
  const whatsappNumber = '919876543210';
  const whatsappText = encodeURIComponent(
    'Hello Nova Infotech, we require corporate bulk hardware / laptops for our office.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pointer-events-auto">
      {/* Quick RFQ Pill */}
      {onOpenRFQ && (
        <button
          onClick={() => onOpenRFQ('Floating Quick Button')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-2xl border border-[#D4A24C]/60 transition transform hover:-translate-y-0.5"
        >
          <FileText className="w-4 h-4 text-[#D4A24C]" />
          <span>Request Quick RFQ</span>
        </button>
      )}

      {/* WhatsApp Action Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#0D3B2A] hover:bg-[#153423] border border-[#D4A24C]/60 text-[#25D366] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
        title="Chat with Corporate IT Desk on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current text-[#25D366]" />
      </a>
    </div>
  );
}
