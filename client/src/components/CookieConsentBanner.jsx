import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Cookie, X, Check } from 'lucide-react';
import { useCompany } from '../context/SettingsContext';
import { useReducedMotionSafe } from '../animations';

const COOKIE_STORAGE_KEY = 'demo_cookie_consent';

export default function CookieConsentBanner() {
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';

  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and locked
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!saved) {
      // Delay slightly for smooth page entrance
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (choice, customPrefs = null) => {
    const payload = {
      status: choice, // 'accepted' | 'rejected' | 'custom'
      preferences: customPrefs || (choice === 'accepted'
        ? { necessary: true, analytics: true, marketing: true }
        : { necessary: true, analytics: false, marketing: false }),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload));
    setVisible(false);
  };

  const shouldReduce = useReducedMotionSafe();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40"
        >
          <div className="bg-[#072117]/95 backdrop-blur-xl border border-[#D4A24C]/40 rounded-3xl p-5 sm:p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0D3B2A] border border-[#D4A24C]/40 flex items-center justify-center text-[#D4A24C] shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-[#FAF7F2]">
                Cookie & Privacy Preferences
              </h4>
              <p className="text-[10px] text-[#90b09a]">DPDP Act 2023 & IT Rules 2011</p>
            </div>
          </div>
          <button
            onClick={() => saveConsent('rejected')}
            className="text-[#90b09a] hover:text-white transition p-1 cursor-pointer"
            title="Reject Non-Essential Cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-[11px] leading-relaxed text-[#FAF7F2]/85">
          {brandName} uses strictly necessary session cookies for security and order checkout. With your consent, we also store anonymized telemetry to improve our enterprise catalog and lease workflows.{' '}
          <Link to="/cookie-policy" className="text-[#D4A24C] underline hover:text-[#FAF7F2]">
            Read Cookie Policy
          </Link>
          .
        </p>

        {/* Granular Management Toggle Pane */}
        {showManage && (
          <div className="p-3 bg-[#0D3B2A]/70 border border-[#D4A24C]/25 rounded-2xl space-y-2.5 text-[11px]">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Strictly Necessary</span>
                <span className="text-[10px] text-[#90b09a]">Session auth & CSRF protection</span>
              </div>
              <span className="text-[10px] font-mono text-[#D4A24C] uppercase font-bold">Required</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <div>
                <span className="font-bold text-white block">Analytics Telemetry</span>
                <span className="text-[10px] text-[#90b09a]">Catalog navigation performance</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 accent-[#D4A24C] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <div>
                <span className="font-bold text-white block">Marketing & Inquiries</span>
                <span className="text-[10px] text-[#90b09a]">B2B catalog recommendations</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="w-4 h-4 accent-[#D4A24C] rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {showManage ? (
            <button
              onClick={() => saveConsent('custom', preferences)}
              className="flex-1 py-2 px-3 rounded-full bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] text-[11px] font-bold uppercase tracking-wider transition cursor-pointer text-center"
            >
              Save Preferences
            </button>
          ) : (
            <>
              <button
                onClick={() => saveConsent('accepted')}
                className="flex-1 py-2 px-3 rounded-full bg-[#D4A24C] hover:bg-[#c5943b] text-[#072117] text-[11px] font-bold uppercase tracking-wider transition cursor-pointer text-center shadow-xs"
              >
                Accept All
              </button>
              <button
                onClick={() => saveConsent('rejected')}
                className="flex-1 py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider transition cursor-pointer text-center border border-white/15"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => setShowManage(true)}
                className="w-full py-1 text-center text-[10px] text-[#90b09a] hover:text-[#D4A24C] underline transition cursor-pointer"
              >
                Customize Preferences
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
