import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiBookOpen, FiCalendar, FiPlusCircle,
  FiExternalLink, FiLogOut, FiMenu, FiX, FiMoon, FiSun,
  FiShield, FiCheckCircle
} from 'react-icons/fi';
import { FaSuitcase } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import pcteLogo from '../assets/pcte-logo.png';

const adminNavItems = [
  { to: '/admin/overview', label: 'Dashboard Overview', icon: FiGrid },
  { to: '/admin/enquiries', label: 'Student Registrations', icon: FiBookOpen, badge: 'Desk' },
  { to: '/admin/packages', label: 'Tour Packages & Seats', icon: FaSuitcase, badge: 'Manager' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const activeNav = adminNavItems.find(item => location.pathname === item.to) || { label: 'Admin Portal' };

  return (
    <div className="flex h-screen bg-[#F1F5F9] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. ADMIN SIDEBAR (Focused on Students & Packages)             */}
      {/* ============================================================ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0F2942] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <img src={pcteLogo} alt="PCTE Logo" className="h-10 w-auto rounded-lg bg-white/95 p-1 shadow" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-[#E11D48] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                  Admin
                </span>
                <span className="text-[10px] font-bold text-amber-300">Desk</span>
              </div>
              <h2 className="font-display text-sm font-black tracking-tight text-white">
                PCTE Travel Portal
              </h2>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Focused Admin Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Admin Management
          </div>

          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#9B1C1C] text-white shadow-md shadow-red-950/40 font-extrabold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="text-[13px]">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                    isActive ? 'bg-white text-[#E11D48]' : 'bg-white/10 text-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-3 space-y-2 bg-[#0A1D30]">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <FiExternalLink size={14} className="text-amber-400" />
              Open Website
            </span>
            <span className="text-[10px] text-slate-400">New Tab ↗</span>
          </Link>

          <div className="flex items-center justify-between rounded-xl bg-black/20 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-[#E11D48] flex items-center justify-center font-bold text-xs text-white shrink-0">
                <FiShield size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@pctetravels.com'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition shrink-0"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ============================================================ */}
      {/* 2. MAIN ADMIN CONTENT CONTAINER                              */}
      {/* ============================================================ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0F1D30] px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-200 lg:hidden"
            >
              <FiMenu size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Admin /
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {activeNav.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Admin Live</span>
            </div>

            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:scale-105 transition shadow-sm"
              title="Toggle Dark/Light Mode"
            >
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 text-xs font-bold text-[#E11D48] hover:bg-[#E11D48] hover:text-white transition shadow-sm"
            >
              <FiLogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Routed Admin Pages */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC] dark:bg-[#070D18]">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
