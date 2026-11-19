import React from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../context/SettingsContext';

/**
 * BrandLogo - Unified Single-Source Brand Asset
 * Completely dynamic: reads brand_name, tagline, tm_symbol, and logo_url from Admin SiteSettings.
 */
export default function BrandLogo({
  theme = 'auto', // 'auto', 'light', 'dark'
  isSolidNav = true,
  size = 'md', // 'sm', 'md', 'lg'
  showSubtitle = true,
  subtitleClassName = '',
  asLink = true,
  className = ''
}) {
  const { company } = useCompany();
  const isDarkBg = theme === 'dark' || (theme === 'auto' && !isSolidNav);

  const emblemSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-11 h-11 sm:w-12 sm:h-12'
  };

  const starSizes = {
    sm: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    md: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
    lg: 'w-5.5 h-5.5 sm:w-6 sm:h-6'
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl lg:text-[22px]',
    lg: 'text-2xl sm:text-3xl'
  };

  // Dynamic Brand Name parsing
  const fullBrandName = company?.brand_name || company?.company_name || 'Demo Infotech';
  const nameParts = fullBrandName.trim().split(' ');
  const firstWord = nameParts[0] || 'Demo';
  const remainingWords = nameParts.slice(1).join(' ');

  // Trademark symbol display
  const tmChar = company?.tm_symbol === 'R' ? '®' : company?.tm_symbol === 'TM' ? '™' : '';

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group shrink-0 ${className}`}>
      {/* If custom logo URL exists, show image; otherwise show official Star Emblem */}
      {company?.logo_url ? (
        <img
          src={company.logo_url}
          alt={fullBrandName}
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

      {/* Brand Wordmark & Dynamic Tagline */}
      <div className="flex flex-col min-w-0">
        <div
          className={`${titleSizes[size]} font-bold tracking-tight font-serif flex items-center gap-1.5 leading-none whitespace-nowrap shrink-0 transition-colors ${
            isDarkBg ? 'text-[#FAF7F2]' : 'text-[#072117]'
          }`}
        >
          <span>{firstWord.toUpperCase()}</span>
          {remainingWords && (
            <span className="text-[#D4A24C] font-normal italic">
              {remainingWords.toUpperCase()}
            </span>
          )}
          {tmChar && (
            <sup className="text-[10px] font-sans font-semibold text-[#D4A24C] -top-1 ml-0.5 select-none">
              {tmChar}
            </sup>
          )}
        </div>

        {showSubtitle && (
          <p
            className={`text-[9px] tracking-[0.14em] uppercase font-sans font-semibold transition-colors mt-0.5 truncate max-w-[200px] sm:max-w-[280px] ${
              isDarkBg ? 'text-[#90b09a]' : 'text-[#5A6B63]'
            } ${subtitleClassName}`}
          >
            {company?.tagline || 'Enterprise Hardware Solutions'}
          </p>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-block" title={`${fullBrandName} - Enterprise IT Solutions`}>
        {content}
      </Link>
    );
  }

  return content;
}
