import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ShoppingBag } from 'lucide-react';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function NotFound() {
  const { company } = useCompany();
  const brandName = company?.brand_name || 'Demo Infotech';

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>404 - Page Not Found | {brandName}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#D4A24C]/30 shadow-xl max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <BrandLogo theme="light" size="md" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-mono font-bold text-[#D4A24C] block">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2A]">
            Resource Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6B63] max-w-sm mx-auto leading-relaxed">
            The hardware catalog item or enterprise policy page you requested is unavailable or has been relocated within {brandName}'s network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#D4A24C]/20">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#0D3B2A] hover:bg-[#153423] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <Home className="w-3.5 h-3.5 text-[#D4A24C]" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#D4A24C]/10 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#8A5E12]" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
