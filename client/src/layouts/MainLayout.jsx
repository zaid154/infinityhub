import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RFQModal from '../components/RFQModal';
import CookieConsentBanner from '../components/CookieConsentBanner';
import ChatbotWidget from '../components/ChatbotWidget';
import WhatsAppFloat from '../components/WhatsAppFloat';
export default function MainLayout() {
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [rfqContext, setRfqContext] = useState('');
  const location = useLocation();
  const isHome = location.pathname === '/';

  const openRFQ = (context = '') => {
    setRfqContext(context);
    setRfqModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900">
      <Navbar onOpenRFQ={openRFQ} />
      
      <main className={`flex-1 ${!isHome ? 'pt-16 sm:pt-[72px] lg:pt-20' : ''}`}>
        <Outlet context={{ openRFQ }} />
      </main>

      <Footer />

      <RFQModal
        isOpen={rfqModalOpen}
        onClose={() => setRfqModalOpen(false)}
        initialContext={rfqContext}
      />

      <CookieConsentBanner />
      <ChatbotWidget />
      <WhatsAppFloat />
    </div>
  );
}
