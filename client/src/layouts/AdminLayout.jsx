import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  Repeat,
  Users,
  Recycle,
  MapPin,
  Settings,
  LogOut,
  ExternalLink,
  Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Inquiries & RFQs', path: '/admin/inquiries', icon: FileText },
    { label: 'Orders & Invoices', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Rental Fleets', path: '/admin/rentals', icon: Repeat },
    { label: 'Customer Directory', path: '/admin/customers', icon: Users },
    { label: 'Asset Buyback', path: '/admin/buyback', icon: Recycle },
    { label: 'Delivery Zones', path: '/admin/delivery-zones', icon: MapPin },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <BrandLogo theme="dark" size="sm" showSubtitle={false} />
          <Link to="/" target="_blank" title="View Public Site" className="text-slate-400 hover:text-white">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
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
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Nova Infotech Corporate Management
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <Link
              to="/products"
              target="_blank"
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1"
            >
              <span>View Live Catalog</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
