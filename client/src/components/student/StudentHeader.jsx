import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Bell, PlusCircle, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { Button } from '../ui';

export function StudentHeader({ onMenuClick, onSidebarToggle, sidebarCollapsed }) {
  const { user } = useAuth();
  const location = useLocation();

  const unreadCount = user ? notificationService.getUnreadCount(user.email) : 0;

  // Determine title from current route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/student/dashboard') return { title: 'Student Dashboard', breadcrumb: 'Overview' };
    if (path === '/student/complaints') return { title: 'My Complaints', breadcrumb: 'Grievance History' };
    if (path === '/student/complaints/new') return { title: 'File New Complaint', breadcrumb: 'Submission' };
    if (path.startsWith('/student/complaints/')) return { title: 'Complaint Details', breadcrumb: 'Tracking' };
    if (path === '/student/profile') return { title: 'Student Profile', breadcrumb: 'Account' };
    if (path === '/student/notifications') return { title: 'Notifications', breadcrumb: 'Activity' };
    return { title: 'Student Workspace', breadcrumb: 'Dashboard' };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-workspace-border px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onSidebarToggle}
            className="hidden lg:inline-flex p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <span>CampusPulse</span>
              <ChevronRight className="w-3 h-3" />
              <span>Student</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#48677A] font-semibold">{breadcrumb}</span>
            </div>
            <h1 className="font-sora text-lg sm:text-xl font-bold text-workspace-textPrimary leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Quick CTA & User Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Submit Button (hidden on mobile if already on /new) */}
          {location.pathname !== '/student/complaints/new' && (
            <Link to="/student/complaints/new" className="hidden sm:inline-flex">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="bg-[#48677A] hover:bg-primary-700 shadow-sm"
              >
                Submit Issue
              </Button>
            </Link>
          )}

          {/* Notifications Link */}
          <Link
            to="/student/notifications"
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </Link>

          {/* User Profile Avatar Link */}
          {user && (
            <Link
              to="/student/profile"
              className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="View student profile"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EAF1F4] text-[#48677A] font-bold text-xs flex items-center justify-center border border-primary-100">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 leading-none">
                  {user.studentId || 'Student'}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default StudentHeader;
