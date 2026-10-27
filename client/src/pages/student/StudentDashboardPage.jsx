import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { api } from '../../services/apiClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '../../components/ui';

export function StudentDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      // Fetch real stats from backend
      const [statsRes, complaintsData] = await Promise.all([
        api.get('/complaints/student/stats').catch(() => null),
        complaintService.fetchComplaints({ status: statusFilter === 'all' ? undefined : statusFilter }),
      ]);

      if (statsRes?.stats) {
        setStats(statsRes.stats);
      } else {
        // Fallback to local computation
        setStats(complaintService.getStats(user.email));
      }

      const filtered = statusFilter === 'all'
        ? complaintsData
        : complaintsData.filter((c) => c.status === statusFilter);

      setRecentComplaints(filtered.slice(0, 5));

      // Build activity feed from timeline events
      const activities = complaintService.getRecentActivities(user.email);
      setRecentActivities(activities);
    } catch (err) {
      console.warn('Dashboard data load error:', err.message);
      setStats(complaintService.getStats(user.email));
      setRecentComplaints(complaintService.getComplaints({ studentEmail: user.email }).slice(0, 5));
    } finally {
      setIsLoading(false);
    }
  }, [user, statusFilter]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') return <Badge variant="resolved" showDot>Resolved</Badge>;
    if (s === 'in-progress') return <Badge variant="in-progress" showDot>In Progress</Badge>;
    if (s === 'rejected') return <Badge variant="rejected" showDot>Rejected</Badge>;
    return <Badge variant="pending" showDot>Pending</Badge>;
  };

  const StatCard = ({ label, value, icon: Icon, colorClass, bgClass, subtext }) => (
    <div className={`rounded-2xl bg-white border border-workspace-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold uppercase tracking-wider ${colorClass}`}>{label}</span>
        <div className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
      </div>
      <div className={`font-display text-3xl sm:text-4xl font-bold ${colorClass.replace('text-', 'text-').replace('-700', '-900').replace('-600', '-900')}`}>
        {isLoading ? <span className="inline-block w-8 h-8 rounded-lg bg-slate-100 animate-pulse" /> : value}
      </div>
      <p className={`text-[11px] mt-1 ${colorClass.replace('-700', '-700/80').replace('-600', '-600/80')}`}>{subtext}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-white border border-workspace-border p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-workspace-softIndigo text-primary-700 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-primary-600" />
            <span>Active Student Portal</span>
          </div>
          <h2 className="font-sora text-2xl sm:text-3xl font-bold text-workspace-textPrimary tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h2>
          <p className="font-sans text-sm sm:text-base text-workspace-textSecondary leading-relaxed">
            Track your campus requests, view real-time department updates, and stay informed as your institution resolves them.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/student/complaints/new">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />} className="shadow-sm px-5">
              Submit Complaint
            </Button>
          </Link>
          <Link to="/student/complaints">
            <Button variant="outline" size="md">View All</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard label="Total Filed" value={stats.total} icon={FileText} colorClass="text-slate-600" bgClass="bg-slate-100" subtext="Lifetime campus tickets" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} colorClass="text-amber-700" bgClass="bg-amber-50" subtext="Awaiting department review" />
        <StatCard label="In Progress" value={stats.inProgress} icon={RefreshCw} colorClass="text-primary-700" bgClass="bg-primary-50" subtext="Technicians assigned" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} colorClass="text-emerald-700" bgClass="bg-emerald-50" subtext="Successfully completed" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-workspace-border shadow-soft">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Recent Complaints</CardTitle>
                <CardDescription>Your latest reported issues and active tickets</CardDescription>
              </div>
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
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>View All</Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading complaints...
                </div>
              ) : recentComplaints.length === 0 ? (
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
                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-sm font-sans">
                      <thead className="bg-slate-50/80 text-[11px] font-semibold text-workspace-textMuted uppercase tracking-wider border-b border-slate-100">
                        <tr>
                          <th className="py-3.5 px-6">ID & Title</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Filed</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentComplaints.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                            <td className="py-4 px-6">
                              <div className="space-y-0.5">
                                <span className="font-mono text-xs font-semibold text-primary-700">#{item.id}</span>
                                <Link to={`/student/complaints/${item.id}`} className="block font-manrope font-semibold text-workspace-textPrimary group-hover:text-primary-600 transition-colors line-clamp-1">
                                  {item.title}
                                </Link>
                                <span className="text-[11px] text-workspace-textMuted block">{item.location}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs font-medium text-slate-600">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">{item.category}</span>
                            </td>
                            <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                            <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <Link to={`/student/complaints/${item.id}`}>
                                <Button variant="outline" size="sm" className="h-8 text-xs">Track</Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="sm:hidden divide-y divide-slate-100">
                    {recentComplaints.map((item) => (
                      <div key={item.id} className="p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-semibold text-primary-700">#{item.id}</span>
                          {getStatusBadge(item.status)}
                        </div>
                        <div>
                          <Link to={`/student/complaints/${item.id}`} className="font-manrope font-semibold text-sm text-workspace-textPrimary line-clamp-2">
                            {item.title}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5">{item.location} · {formatDate(item.createdAt)}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.category}</span>
                          <Link to={`/student/complaints/${item.id}`}>
                            <Button variant="outline" size="sm" className="h-7 text-xs">View Details</Button>
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

        {/* Right: Activity + Helpdesk */}
        <div className="space-y-6">
          <Card className="border-workspace-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Activity Timeline</CardTitle>
              <CardDescription>Updates on your active issues</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No activity history recorded yet.</p>
              ) : (
                <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {recentActivities.slice(0, 4).map((act, idx) => (
                    <div key={act.id || idx} className="relative text-xs">
                      <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary-600 ring-4 ring-white" />
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-workspace-textPrimary">{act.label}</span>
                          <span className="text-[10px] text-slate-400">{formatDate(act.timestamp)}</span>
                        </div>
                        <Link to={`/student/complaints/${act.complaintId}`} className="font-medium text-primary-600 hover:underline block line-clamp-1">
                          #{act.complaintId}: {act.complaintTitle}
                        </Link>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{act.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campus Helpdesk */}
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
