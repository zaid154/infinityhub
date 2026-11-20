import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  ShoppingBag,
  Repeat,
  Users,
  Recycle,
  MapPin,
  Settings,
  LogOut,
  ExternalLink,
  Server,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();

  const brandTitle = company?.brand_name?.toUpperCase() || 'DEMO INFOTECH';

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Inquiries & RFQs', path: '/admin/inquiries', icon: FileText },
    { label: 'Demand Radar', path: '/admin/demand', icon: Sparkles },
    { label: 'Orders & Invoices', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Rental Fleets', path: '/admin/rentals', icon: Repeat },
    { label: 'Customer Directory', path: '/admin/customers', icon: Users },
    { label: 'Asset Buyback', path: '/admin/buyback', icon: Recycle },
    { label: 'Delivery Zones', path: '/admin/delivery-zones', icon: MapPin },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] text-[#111827]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#072117] text-[#90b09a] flex flex-col shrink-0 border-r border-[#D4A24C]/20">
        <div className="p-4 border-b border-[#FAF7F2]/10 flex items-center justify-between">
          <BrandLogo theme="dark" size="sm" showSubtitle={false} />
          <Link to="/" target="_blank" title="View Public Site" className="text-[#90b09a] hover:text-[#FAF7F2] transition">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-[#0D3B2A] text-[#FAF7F2] border-l-4 border-[#D4A24C] shadow-md'
                      : 'text-[#90b09a] hover:text-[#FAF7F2] hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D4A24C]' : 'text-[#90b09a]'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#FAF7F2]/10 text-xs">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="font-bold text-[#FAF7F2] truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-[#90b09a] truncate font-mono">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 text-[#90b09a] hover:text-red-400 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-[#D4A24C]/20 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#8A5E12] font-bold">
              {brandTitle} ENTERPRISE MANAGEMENT SUITE
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <Link
              to="/products"
              target="_blank"
              className="px-4 py-1.5 rounded-full border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#D4A24C]/10 font-bold flex items-center gap-1.5 transition"
            >
              <span>View Live Catalog</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8A5E12]" />
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 bg-[#FAF7F2]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
