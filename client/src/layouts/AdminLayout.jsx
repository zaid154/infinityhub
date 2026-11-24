import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/SettingsContext';
import BrandLogo from '../components/BrandLogo';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className="min-h-screen flex bg-[#FAF7F2] text-[#111827] relative">
      {/* Mobile/Tablet Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: Responsive Off-Canvas Drawer on <lg, Static Column on lg+ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#072117] text-[#90b09a] flex flex-col shrink-0 border-r border-[#D4A24C]/20 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-64 pb-[max(1rem,env(safe-area-inset-bottom))] ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-[#FAF7F2]/10 flex items-center justify-between">
          <BrandLogo theme="dark" size="sm" showSubtitle={false} />
          <div className="flex items-center gap-1">
            <Link to="/" target="_blank" title="View Public Site" className="p-2 text-[#90b09a] hover:text-[#FAF7F2] transition">
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden min-h-10 min-w-10 flex items-center justify-center p-2 text-[#90b09a] hover:text-white rounded-lg cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
                  `flex items-center gap-3 px-3.5 min-h-11 py-2.5 rounded-xl transition ${
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
            <div className="truncate pr-2">
              <p className="font-bold text-[#FAF7F2] truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-[#90b09a] truncate font-mono">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="min-h-10 min-w-10 flex items-center justify-center p-2 text-[#90b09a] hover:text-red-400 transition cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-[#D4A24C]/20 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-sm gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden min-h-11 min-w-11 flex items-center justify-center p-2 rounded-xl text-[#0D3B2A] hover:bg-slate-100 border border-slate-200 cursor-pointer shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#8A5E12] font-bold truncate">
              {brandTitle} ENTERPRISE SUITE
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs shrink-0">
            <Link
              to="/products"
              target="_blank"
              className="min-h-10 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#D4A24C]/40 text-[#0D3B2A] hover:bg-[#D4A24C]/10 font-bold flex items-center gap-1.5 transition"
            >
              <span className="hidden xs:inline">View Catalog</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8A5E12]" />
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-[#FAF7F2] min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
