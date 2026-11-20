import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import { FALLBACK_COMPANY_SETTINGS } from '../config/company';

const SettingsContext = createContext({
  settings: FALLBACK_COMPANY_SETTINGS,
  company: FALLBACK_COMPANY_SETTINGS,
  loading: true,
  error: null,
  isDemoMode: false,
  refreshSettings: async () => {},
  renderToken: (text) => text
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_COMPANY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      // Prefer cached public settings (safe for unauthenticated visitors)
      const res = await api.get('/settings/public').catch(() => api.get('/settings'));
      if (res.data?.success && res.data?.settings) {
        setSettings((prev) => ({
          ...prev,
          ...res.data.settings,
          grievance_officer: {
            ...prev.grievance_officer,
            ...(res.data.settings.grievance_officer || {})
          },
          social_links: {
            ...prev.social_links,
            ...(res.data.settings.social_links || {})
          },
          bank_details: {
            ...prev.bank_details,
            ...(res.data.settings.bank_details || {})
          },
          category_gst_rates:
            res.data.settings.category_gst_rates && res.data.settings.category_gst_rates.length > 0
              ? res.data.settings.category_gst_rates
              : prev.category_gst_rates
        }));
        setError(null);
      }
    } catch (err) {
      console.warn('[SettingsContext] Falling back to default company configuration:', err?.message);
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    api.get('/settings/public')
      .then((res) => {
        if (!isMounted || !res.data?.success || !res.data.settings) return;
        setSettings((prev) => ({
          ...prev,
          ...res.data.settings,
          grievance_officer: {
            ...prev.grievance_officer,
            ...(res.data.settings.grievance_officer || {})
          },
          social_links: {
            ...prev.social_links,
            ...(res.data.settings.social_links || {})
          },
          bank_details: {
            ...prev.bank_details,
            ...(res.data.settings.bank_details || {})
          },
          category_gst_rates:
            res.data.settings.category_gst_rates && res.data.settings.category_gst_rates.length > 0
              ? res.data.settings.category_gst_rates
              : prev.category_gst_rates
        }));
        setError(null);
      })
      .catch((err) => {
        console.warn('[SettingsContext] Falling back to default company configuration:', err?.message);
        if (isMounted) setError(err.message || 'Failed to fetch settings');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Check if critical enterprise identity fields still have demo placeholders
  const isDemoMode = useMemo(() => {
    if (!settings) return true;
    const placeholderSignals = [
      settings.brand_name === 'Demo Infotech',
      settings.legal_name?.includes('[PLACEHOLDER]'),
      settings.gst_number?.includes('[PLACEHOLDER]'),
      settings.cin_number?.includes('[PLACEHOLDER]'),
      settings.phone?.includes('XXXXX'),
      settings.email?.includes('example.com')
    ];
    return placeholderSignals.some(Boolean);
  }, [settings]);

  // Safe Token Interpolator for Legal & Policy Pages
  const renderToken = useCallback(
    (text) => {
      if (!text || typeof text !== 'string') return text;
      const s = settings || FALLBACK_COMPANY_SETTINGS;
      const tmChar = s.tm_symbol === 'R' ? '®' : s.tm_symbol === 'TM' ? '™' : '';
      const formattedDate = s.legal_last_updated
        ? new Date(s.legal_last_updated).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

      const tokenMap = {
        '{{brandName}}': s.brand_name || 'Demo Infotech',
        '{{brandNameShort}}': s.brand_name_short || 'Demo',
        '{{legalName}}': s.legal_name || 'Demo Infotech Private Limited',
        '{{tagline}}': s.tagline || '',
        '{{tmSymbol}}': tmChar,
        '{{cin}}': s.cin_number || '',
        '{{cinNumber}}': s.cin_number || '',
        '{{gstin}}': s.gst_number || '',
        '{{gstNumber}}': s.gst_number || '',
        '{{registeredAddress}}': s.registered_address || s.address || '',
        '{{operationsAddress}}': s.operations_address || s.address || '',
        '{{address}}': s.address || '',
        '{{jurisdictionCity}}': s.jurisdiction_city || 'New Delhi',
        '{{isoCertNumber}}': s.iso_cert_number || '',
        '{{eprNumber}}': s.epr_registration_number || '',
        '{{phone}}': s.phone || '',
        '{{whatsapp}}': s.whatsapp || '',
        '{{email}}': s.email || '',
        '{{supportEmail}}': s.support_email || s.email || '',
        '{{procurementEmail}}': s.procurement_email || s.email || '',
        '{{businessHours}}': s.business_hours || '',
        '{{supportSLA}}': s.support_sla || '24–48h Hardware Standby Replacement SLA',
        '{{grievanceName}}': s.grievance_officer?.name || 'Grievance Officer',
        '{{grievanceDesignation}}': s.grievance_officer?.designation || 'Head of Legal & Enterprise Compliance',
        '{{grievanceEmail}}': s.grievance_officer?.email || 'grievance@example.com',
        '{{grievancePhone}}': s.grievance_officer?.phone || '+91 XXXXX XXXXX',
        '{{grievanceAddress}}': s.grievance_officer?.address || s.registered_address || '',
        '{{thirdPartyDisclaimer}}': s.third_party_disclaimer || '',
        '{{legalVersion}}': s.legal_version || '1.0',
        '{{lastUpdated}}': formattedDate,
        '{{websiteUrl}}': s.website_url || 'http://localhost:5173'
      };

      let result = text;
      for (const [key, val] of Object.entries(tokenMap)) {
        result = result.split(key).join(val);
      }
      return result;
    },
    [settings]
  );

  const value = {
    settings,
    company: settings, // Primary alias for brand identity
    loading,
    error,
    isDemoMode,
    refreshSettings: fetchSettings,
    renderToken
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Named alias useCompany for cleaner enterprise semantics
export function useCompany() {
  return useSettings();
}

export default SettingsContext;
