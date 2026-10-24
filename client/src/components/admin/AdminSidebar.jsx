import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  Users,
  BarChart3,
  Shield,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { Logo } from '../ui';

export function AdminSidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const stats = complaintService.getStats();

  // Close mobile drawer on route changes
  useEffect(() => {
    if (mobileOpen && onClose) {
      onClose();
    }
  }, [location.pathname, location.search]);

  // Lock body scroll on mobile drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
    navigate('/login');
  };

  const currentPathWithSearch = location.pathname + location.search;

  const operationItems = [
    { name: 'Operations Overview', to: '/admin/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'All Complaints', to: '/admin/complaints', icon: FileText, exact: true },
    {
      name: 'Pending Triage',
      to: '/admin/complaints?status=pending',
      icon: Clock,
      badge: stats.pending > 0 ? stats.pending : null,
      badgeColor: 'bg-[#FFF4DB] text-[#D97706]',
    },
    {
      name: 'Active Dispatches',
      to: '/admin/complaints?status=in-progress',
      icon: RefreshCw,
      badge: stats.inProgress > 0 ? stats.inProgress : null,
      badgeColor: 'bg-[#EEF2FF] text-[#4F46E5]',
    },
    { name: 'Resolved Archive', to: '/admin/complaints?status=resolved', icon: CheckCircle2 },
  ];

  const managementItems = [
    { name: 'Students Directory', to: '/admin/students', icon: Users },
    { name: 'Reports & Analytics', to: '/admin/analytics', icon: BarChart3 },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#F1F4FA] text-[#172033] select-none border-r border-[#E5E9F2]">
      {/* 1. Header & Brand Indicator */}
      <div className="h-16 px-5 border-b border-[#E5E9F2] flex items-center justify-between shrink-0 bg-[#F1F4FA]">
        <Logo
          to="/admin/dashboard"
          onClick={onClose}
          size="sm"
          showSubtitle
          subtitle="Admin Operations"
        />

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[#596579] hover:text-[#172033] hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Scrollable Navigation Menu */}
      <nav
        className="flex-1 px-3 py-4 space-y-6 overflow-y-auto"
        aria-label="Administrator Main Navigation"
      >
        {/* Operations Section */}
        <div>
          <p className="px-3 pb-2 text-[10px] font-bold text-[#8993A5] uppercase tracking-wider">
            Operations
          </p>
          <div className="space-y-1">
            {operationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.to.includes('?')
                ? currentPathWithSearch === item.to
                : location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`
                    relative flex items-center justify-between min-h-[42px] px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                    ${
                      isActive
                        ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold pl-4 shadow-soft'
                        : 'text-[#596579] hover:text-[#172033] hover:bg-white'
                    }
                  `}
                >
                  {isActive && (
                    <span
                      className="absolute left-1.5 top-2.5 bottom-2.5 w-1 bg-[#4F46E5] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#4F46E5]'
                          : 'text-[#8993A5] group-hover:text-[#4F46E5]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`ml-2 px-2 py-0.5 text-[11px] font-bold rounded-full ${item.badgeColor || 'bg-[#EEF2FF] text-[#4F46E5]'} shrink-0`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Management & Governance Section */}
        <div>
          <p className="px-3 pb-2 text-[10px] font-bold text-[#8993A5] uppercase tracking-wider">
            Governance
          </p>
          <div className="space-y-1">
            {managementItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive: navActive }) => `
                    relative flex items-center justify-between min-h-[42px] px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                    ${
                      navActive
                        ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold pl-4 shadow-soft'
                        : 'text-[#596579] hover:text-[#172033] hover:bg-white'
                    }
                  `}
                >
                  {({ isActive: navActive }) => (
                    <>
                      {navActive && (
                        <span
                          className="absolute left-1.5 top-2.5 bottom-2.5 w-1 bg-[#4F46E5] rounded-full"
                          aria-hidden="true"
                        />
                      )}
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                            navActive
                              ? 'text-[#4F46E5]'
                              : 'text-[#8993A5] group-hover:text-[#4F46E5]'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 3. Bottom Administrator Profile & Sign Out Controls */}
      <div className="p-3 border-t border-[#E5E9F2] space-y-2 shrink-0 bg-[#F1F4FA]">
        {user && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E5E9F2] shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-[#172554] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-soft">
              <Shield className="w-4 h-4 text-[#4F46E5]" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-[#172033] truncate">
                {user.name || 'Bhargav Pasupuleti'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.2 rounded">
                  Admin
                </span>
                <span className="text-[10px] text-[#596579] truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#596579] hover:text-[#E11D48] hover:bg-[#FFF0F3] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Fixed 256px) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30 bg-[#F1F4FA] border-r border-[#E5E9F2]">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && typeof document !== 'undefined' &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[9999] flex">
            <div
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transition-opacity duration-200"
              onClick={onClose}
              aria-hidden="true"
            />
            <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-modal animate-drawer-in bg-[#F1F4FA]">
              {sidebarContent}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default AdminSidebar;
