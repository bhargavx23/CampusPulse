import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  AlertCircle,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '../../components/ui';

export function StudentDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.email) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const s = complaintService.getStats(user.email);
    setStats(s);

    const complaints = complaintService.getComplaints({
      studentEmail: user.email,
      search: searchTerm,
      status: statusFilter,
    });
    setRecentComplaints(complaints.slice(0, 5));

    const activities = complaintService.getRecentActivities(user.email);
    setRecentActivities(activities);

    // Fetch fresh from backend
    await complaintService.fetchComplaints({
      search: searchTerm,
      status: statusFilter,
    });

    setStats(complaintService.getStats(user.email));
    setRecentComplaints(
      complaintService
        .getComplaints({
          studentEmail: user.email,
          search: searchTerm,
          status: statusFilter,
        })
        .slice(0, 5)
    );
    setRecentActivities(complaintService.getRecentActivities(user.email));
  };

  useEffect(() => {
    if (user?.email) {
      const complaints = complaintService.getComplaints({
        studentEmail: user.email,
        search: searchTerm,
        status: statusFilter,
      });
      setRecentComplaints(complaints.slice(0, 5));
    }
  }, [searchTerm, statusFilter]);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') return <Badge variant="resolved" showDot>Resolved</Badge>;
    if (s === 'in-progress') return <Badge variant="in-progress" showDot>In Progress</Badge>;
    if (s === 'rejected') return <Badge variant="rejected" showDot>Rejected</Badge>;
    return <Badge variant="pending" showDot>Pending</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* ========================================================= */}
      {/* 1. WELCOME SECTION                                        */}
      {/* ========================================================= */}
      <div className="rounded-2xl bg-white border border-workspace-border p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-workspace-softIndigo text-primary-700 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-primary-600" />
            <span>Active Student Portal</span>
          </div>
          <h2 className="font-sora text-2xl sm:text-3xl font-bold text-workspace-textPrimary tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h2>
          <p className="font-sans text-sm sm:text-base text-workspace-textSecondary leading-relaxed">
            Track your campus requests, view real-time department updates, and stay informed as your institution works toward resolving them.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/student/complaints/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="bg-primary-600 hover:bg-primary-700 shadow-sm px-5"
            >
              Submit Complaint
            </Button>
          </Link>
          <Link to="/student/complaints">
            <Button variant="outline" size="md">
              View All
            </Button>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. STATISTICS CARDS (Calculated from actual data)         */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total */}
        <div className="rounded-2xl bg-white border border-workspace-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 animate-fade-in-stagger-1">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-workspace-textSecondary">
              Total Filed
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-workspace-textPrimary">
            {stats.total}
          </div>
          <p className="text-[11px] text-workspace-textMuted mt-1">
            Lifetime campus tickets
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-2xl bg-white border border-workspace-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 animate-fade-in-stagger-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Pending
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-amber-900">
            {stats.pending}
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1">
            Awaiting department review
          </p>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl bg-white border border-workspace-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 animate-fade-in-stagger-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              In Progress
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-blue-900">
            {stats.inProgress}
          </div>
          <p className="text-[11px] text-blue-700/80 mt-1">
            Technicians actively assigned
          </p>
        </div>

        {/* Resolved */}
        <div className="rounded-2xl bg-white border border-workspace-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 animate-fade-in-stagger-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Resolved
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-emerald-900">
            {stats.resolved}
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">
            Successfully completed
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT: RECENT COMPLAINTS & ACTIVITY   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Complaints (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-workspace-border shadow-soft">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Recent Complaints</CardTitle>
                <CardDescription>
                  Your latest reported issues and active tickets
                </CardDescription>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs rounded-xl border border-workspace-border bg-white px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  aria-label="Filter complaints by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <Link to="/student/complaints">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {recentComplaints.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    title="No complaints found"
                    description="You haven't filed any complaints matching this filter yet."
                    action={
                      <Link to="/student/complaints/new">
                        <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                          File First Complaint
                        </Button>
                      </Link>
                    }
                  />
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-sm font-sans">
                      <thead className="bg-slate-50/80 text-[11px] font-semibold text-workspace-textMuted uppercase tracking-wider border-b border-slate-100">
                        <tr>
                          <th className="py-3.5 px-6">ID & Title</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Filed Date</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentComplaints.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/60 transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="space-y-0.5">
                                <span className="font-mono text-xs font-semibold text-primary-700">
                                  #{item.id}
                                </span>
                                <Link
                                  to={`/student/complaints/${item.id}`}
                                  className="block font-manrope font-semibold text-workspace-textPrimary group-hover:text-primary-600 transition-colors line-clamp-1"
                                >
                                  {item.title}
                                </Link>
                                <span className="text-[11px] text-workspace-textMuted block">
                                  {item.location}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs font-medium text-slate-600">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                              {formatDate(item.createdAt)}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              {getStatusBadge(item.status)}
                            </td>
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <Link to={`/student/complaints/${item.id}`}>
                                <Button variant="outline" size="sm" className="h-8 text-xs">
                                  Track
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View */}
                  <div className="sm:hidden divide-y divide-slate-100">
                    {recentComplaints.map((item) => (
                      <div key={item.id} className="p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-semibold text-primary-700">
                            #{item.id}
                          </span>
                          {getStatusBadge(item.status)}
                        </div>
                        <div>
                          <Link
                            to={`/student/complaints/${item.id}`}
                            className="font-manrope font-semibold text-sm text-workspace-textPrimary line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.location} · {formatDate(item.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <Link to={`/student/complaints/${item.id}`}>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity Feed & Campus Contacts (1 Col) */}
        <div className="space-y-6">
          {/* Recent Activity Timeline Feed */}
          <Card className="border-workspace-border shadow-soft">
            <CardHeader>
              <div>
                <CardTitle className="text-base font-semibold">Activity Timeline</CardTitle>
                <CardDescription>Updates on your active issues</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No activity history recorded yet.
                </p>
              ) : (
                <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {recentActivities.slice(0, 4).map((act) => (
                    <div key={act.id} className="relative text-xs">
                      {/* Timeline dot */}
                      <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary-600 ring-4 ring-white" />
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-workspace-textPrimary">
                            {act.label}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(act.timestamp)}
                          </span>
                        </div>
                        <Link
                          to={`/student/complaints/${act.complaintId}`}
                          className="font-medium text-primary-600 hover:underline block line-clamp-1"
                        >
                          #{act.complaintId}: {act.complaintTitle}
                        </Link>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {act.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Institutional Helpdesk Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-manrope font-semibold text-sm">
              <PhoneCall className="w-4 h-4 text-primary-600" />
              <span>Campus Facilities Support</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              For campus emergencies (gas leaks, live wire hazards, structural dangers), contact the 24/7 central control desk immediately.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Facilities Emergency:</span>
                <span className="font-mono font-semibold text-slate-800">Ext. 4400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security Control:</span>
                <span className="font-mono font-semibold text-slate-800">Ext. 9110</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardPage;
