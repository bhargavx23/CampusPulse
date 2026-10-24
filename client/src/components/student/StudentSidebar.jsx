import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { Logo } from '../ui';

export function StudentSidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = user ? notificationService.getUnreadCount(user.email) : 0;

  // Close mobile drawer on route change
  useEffect(() => {
    if (mobileOpen && onClose) {
      onClose();
    }
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
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

  const navItems = [
    { name: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'My Complaints', to: '/student/complaints', icon: FileText, exact: true },
    { name: 'Submit Grievance', to: '/student/complaints/new', icon: PlusCircle, exact: true },
    {
      name: 'Notifications',
      to: '/student/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
      exact: true,
    },
    { name: 'Student Profile', to: '/student/profile', icon: User, exact: true },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#F1F4FA] text-[#172033] select-none border-r border-[#E5E9F2]">
      {/* 1. Brand Logo Header */}
      <div className="h-16 px-5 border-b border-[#E5E9F2] flex items-center justify-between shrink-0 bg-[#F1F4FA]">
        <Logo
          to="/student/dashboard"
          onClick={onClose}
          size="sm"
          showSubtitle
          subtitle="Student Workspace"
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
        className="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
        aria-label="Student Main Navigation"
      >
        <p className="px-3 pb-2 text-[10px] font-bold text-[#8993A5] uppercase tracking-wider">
          Student Workspace
        </p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact ?? true}
                onClick={onClose}
                className={({ isActive }) => `
                  relative flex items-center justify-between min-h-[42px] px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold pl-4 shadow-soft'
                      : 'text-[#596579] hover:text-[#172033] hover:bg-white'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
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
                      <span className="ml-2 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#4F46E5] text-white shrink-0 shadow-soft">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* 3. Bottom Account Profile & Sign Out Controls */}
      <div className="p-3 border-t border-[#E5E9F2] space-y-2 shrink-0 bg-[#F1F4FA]">
        {user && (
          <Link
            to="/student/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E5E9F2] hover:border-[#D5DCE8] hover:shadow-soft transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4F46E5] font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-100 shadow-soft">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-semibold text-[#172033] truncate group-hover:text-[#4F46E5] transition-colors">
                {user.name}
              </p>
              <p className="text-[10px] text-[#596579] truncate">
                {user.studentId || user.rollNumber || user.email}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#8993A5] group-hover:text-[#4F46E5] transition-colors shrink-0" />
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#596579] hover:text-[#E11D48] hover:bg-[#FFF0F3] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
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

export default StudentSidebar;
