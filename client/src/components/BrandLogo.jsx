import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

/**
 * BrandLogo - Unified Single-Source Brand Asset for Nova Infotech
 * Used across Navbar, Footer, Admin, and Authentication pages.
 */
export default function BrandLogo({
  theme = 'auto', // 'auto', 'light', 'dark'
  isSolidNav = true,
  size = 'md', // 'sm', 'md', 'lg'
  showSubtitle = true,
  asLink = true,
  className = ''
}) {
  const { settings } = useSettings();
  // Determine if logo should be light-colored (on dark backgrounds) or dark-colored (on light backgrounds)
  const isDarkBg = theme === 'dark' || (theme === 'auto' && !isSolidNav);

  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  // Split company name into first word and remaining
  const fullCompanyName = settings?.company_name || 'NOVA INFOTECH';
  const nameParts = fullCompanyName.trim().split(' ');
  const firstWord = nameParts[0] || 'NOVA';
  const remainingWords = nameParts.slice(1).join(' ') || (nameParts.length === 1 ? '' : 'INFOTECH');

  const content = (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* If custom logo URL exists, show image; otherwise show official Star Emblem */}
      {settings?.logo_url ? (
        <img
          src={settings.logo_url}
          alt={fullCompanyName}
          className={`${emblemSizes[size]} object-contain rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0`}
        />
      ) : (
        <div
          className={`${emblemSizes[size]} rounded-full bg-[#0D3B2A] border border-[#D4A24C]/70 flex items-center justify-center text-[#D4A24C] shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0`}
        >
          <svg
            className={starSizes[size]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      )}

      {/* Brand Wordmark & Official Tagline */}
      <div className="flex flex-col">
        <div
          className={`${titleSizes[size]} font-bold tracking-tight font-serif flex items-center gap-1.5 leading-none transition-colors ${
            isDarkBg ? 'text-[#FAF7F2]' : 'text-[#072117]'
          }`}
        >
          <span>{firstWord.toUpperCase()}</span>
          {remainingWords && (
            <span className={`${isDarkBg ? 'text-[#D4A24C]' : 'text-[#D4A24C]'} font-normal italic`}>
              {remainingWords.toUpperCase()}
            </span>
          )}
        </div>

        {showSubtitle && (
          <p
            className={`text-[9px] tracking-[0.22em] uppercase font-sans font-semibold transition-colors mt-1 ${
              isDarkBg ? 'text-[#90b09a]' : 'text-[#5A6B63]'
            }`}
          >
            {settings?.tagline || 'Certified Enterprise Hardware'}
          </p>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-block" title={`${fullCompanyName} - Certified Enterprise Hardware`}>
        {content}
      </Link>
    );
  }

  return content;
}
