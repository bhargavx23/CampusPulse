import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';

export function AdminHeader({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();

  const stats = complaintService.getStats();

  const getPageInfo = () => {
    const path = location.pathname;
    const search = location.search;

    if (path === '/admin/dashboard') {
      return { title: 'Administrator Operations Overview', breadcrumb: 'Overview' };
    }
    if (path === '/admin/complaints') {
      if (search.includes('pending')) {
        return { title: 'Pending Grievance Triage', breadcrumb: 'Pending Triage' };
      }
      if (search.includes('in-progress')) {
        return { title: 'Active Dispatch Queue', breadcrumb: 'In Progress' };
      }
      if (search.includes('resolved')) {
        return { title: 'Resolved Grievance Archive', breadcrumb: 'Resolved' };
      }
      return { title: 'Campus Grievance Management', breadcrumb: 'All Complaints' };
    }
    if (path === '/admin/students') {
      return { title: 'Registered Students Directory', breadcrumb: 'Students' };
    }
    if (path === '/admin/analytics') {
      return { title: 'Redressal Intelligence & Analytics', breadcrumb: 'Analytics' };
    }
    return { title: 'Administrator Workspace', breadcrumb: 'Control' };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E9F2] px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-[#596579] hover:text-[#172033] hover:bg-[#F1F4FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            aria-label="Open administrator navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#8993A5]">
              <span>CampusPulse</span>
              <ChevronRight className="w-3 h-3" />
              <span>Operations</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#4F46E5] font-semibold">{breadcrumb}</span>
            </div>
            <h1 className="font-sora text-lg sm:text-xl font-bold text-[#172033] leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Operational Status, Alerts & Admin Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Operational Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F7F3] border border-[#A7F3D0] text-[11px] font-semibold text-[#0F9D8A]">
            <span className="w-2 h-2 rounded-full bg-[#0F9D8A] animate-pulse-subtle" />
            <span>Triage Engine Active</span>
          </div>

          {/* Quick Pending Alert if any */}
          {stats.pending > 0 && (
            <Link
              to="/admin/complaints?status=pending"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF4DB] border border-[#FDE68A] text-xs font-semibold text-[#D97706] hover:bg-amber-100 transition-colors shadow-soft"
            >
              <span>{stats.pending} Needs Review</span>
            </Link>
          )}

          {/* Admin Avatar & Role Chip */}
          {user && (
            <div className="flex items-center gap-2.5 pl-2 py-1">
              <div className="w-8 h-8 rounded-xl bg-[#172554] text-white font-bold text-xs flex items-center justify-center shadow-soft">
                <Shield className="w-4 h-4 text-indigo-300" />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-[#172033] leading-tight">
                  {user.name || 'Bhargav Pasupuleti'}
                </p>
                <p className="text-[10px] text-[#4F46E5] font-semibold leading-none mt-0.5">
                  Chief Administrator
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
