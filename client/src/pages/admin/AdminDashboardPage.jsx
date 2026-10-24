import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  User,
  Filter,
  BarChart3,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import AdminComplaintModal from '../../components/admin/AdminComplaintModal';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    urgent: 0,
    resolutionRate: 0,
    categoryCounts: {},
    categoryStats: [],
    priorityMap: { Urgent: 0, High: 0, Medium: 0, Low: 0 },
    departmentMap: {},
    averageResolutionHours: 18.5,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await complaintService.getAdminAnalytics();
    setAnalytics(data);

    // Get 6 most recent complaints across the university
    const list = await complaintService.fetchComplaints();
    setRecentComplaints(list.slice(0, 6));
  };

  const handleOpenTriage = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleComplaintUpdated = () => {
    loadData();
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 1. Operational Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-navy to-brand-deep p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 border border-brand-navy">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-xs font-semibold text-brand-soft backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-bright" />
            <span>Campus Grievance & Redressal Command Hub</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome, Administrator {user?.name?.split(' ')[0] || 'Bhargav'}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time institutional oversight across student grievance filings, facility dispatch queues, and maintenance timelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/complaints?status=pending">
            <Button
              variant="primary"
              size="sm"
              className="bg-brand-indigo hover:bg-brand-deep shadow-soft text-xs font-semibold px-4"
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Review Pending Triage ({analytics.pending})
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold"
              leftIcon={<BarChart3 className="w-4 h-4" />}
            >
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Grievances */}
        <div className="rounded-2xl bg-surface-card border border-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 animate-fade-in-stagger-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-content-secondary">
              Total Filed
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-secondary text-content-primary flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-content-primary">
            {analytics.total}
          </div>
          <p className="text-[11px] text-content-muted mt-1">
            Registered campus tickets
          </p>
        </div>

        {/* Pending Review */}
        <div className="rounded-2xl bg-surface-card border border-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 animate-fade-in-stagger-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-amber">
              Pending Triage
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent-amberSoft text-accent-amber flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-accent-amber">
            {analytics.pending}
          </div>
          <p className="text-[11px] text-accent-amber/80 mt-1">
            Awaiting inspection assignment
          </p>
        </div>

        {/* Active Dispatches */}
        <div className="rounded-2xl bg-surface-card border border-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 animate-fade-in-stagger-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand-indigo flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-brand-indigo">
            {analytics.inProgress}
          </div>
          <p className="text-[11px] text-brand-indigo/80 mt-1">
            Technicians on-site / active
          </p>
        </div>

        {/* Resolved Total */}
        <div className="rounded-2xl bg-surface-card border border-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 animate-fade-in-stagger-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-teal">
              Resolved
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent-tealSoft text-accent-teal flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-accent-teal">
            {analytics.resolved}
          </div>
          <p className="text-[11px] text-accent-teal/80 mt-1">
            {analytics.resolutionRate}% resolution efficiency
          </p>
        </div>

        {/* Urgent Attention */}
        <div className="rounded-2xl bg-surface-card border border-border p-5 shadow-soft transition-all duration-200 hover:shadow-card hover:-translate-y-0.5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-rose">
              Urgent Flagged
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent-roseSoft text-accent-rose flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-accent-rose">
            {analytics.urgent}
          </div>
          <p className="text-[11px] text-accent-rose/80 mt-1">
            High priority / critical
          </p>
        </div>
      </div>

      {/* 3. Operational Visualizations: Category Volume & Resolution Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 Cols) */}
        <Card className="lg:col-span-2 border-border shadow-soft bg-surface-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-content-primary">
                Grievance Volume by Campus Category
              </CardTitle>
              <CardDescription>
                Live distribution of reported issues across institutional departments
              </CardDescription>
            </div>
            <Link
              to="/admin/complaints"
              className="text-xs font-semibold text-brand-indigo hover:text-brand-deep flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {(analytics?.categoryStats || []).length === 0 ? (
              <p className="text-xs text-content-muted">No complaints registered yet.</p>
            ) : (
              (analytics?.categoryStats || []).map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-content-primary">{item.category}</span>
                    <span className="text-content-secondary font-mono">
                      {item.count} tickets ({item.percentage}%)
                    </span>
                  </div>
                  {/* Visual Bar */}
                  <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-indigo transition-all duration-500 ease-out"
                      style={{ width: `${Math.max(item.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Priority Status Breakdown (1 Col) */}
        <Card className="border-border shadow-soft bg-surface-card flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-content-primary">
              Severity & Urgency Index
            </CardTitle>
            <CardDescription>
              Triage priority distribution across complaints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="p-3 rounded-xl bg-accent-roseSoft border border-rose-200 flex items-center justify-between">
              <span className="text-xs font-bold text-accent-rose">Urgent Severity</span>
              <span className="text-sm font-bold text-accent-rose font-mono">
                {analytics?.priorityMap?.Urgent ?? 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-accent-amberSoft border border-amber-200 flex items-center justify-between">
              <span className="text-xs font-bold text-accent-amber">High Priority</span>
              <span className="text-sm font-bold text-accent-amber font-mono">
                {analytics?.priorityMap?.High ?? 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-accent-blueSoft border border-blue-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-accent-blue">Medium Priority</span>
              <span className="text-sm font-bold text-accent-blue font-mono">
                {analytics?.priorityMap?.Medium ?? 0}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-content-secondary">Low Priority</span>
              <span className="text-sm font-bold text-content-secondary font-mono">
                {analytics?.priorityMap?.Low ?? 0}
              </span>
            </div>

            <div className="pt-3 border-t border-border text-center">
              <span className="text-xs font-semibold text-accent-teal bg-accent-tealSoft px-3 py-1 rounded-full">
                {analytics.resolutionRate}% Institutional Resolution Rate
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Recent Campus Complaints Queue & Quick Triage Table */}
      <Card className="border-border shadow-card bg-surface-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-content-primary">
              Recent Campus Grievances Queue
            </CardTitle>
            <CardDescription>
              Latest issue submissions awaiting operational triage and department dispatch
            </CardDescription>
          </div>
          <Link to="/admin/complaints">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Full Management Table
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs text-content-primary">
            <thead className="bg-surface-secondary/70 border-y border-border text-[11px] font-bold uppercase tracking-wider text-content-secondary">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Ticket ID</th>
                <th className="py-3.5 px-4">Headline & Location</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-content-muted">
                    No campus complaints registered yet.
                  </td>
                </tr>
              ) : (
                recentComplaints.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-surface-secondary/60 transition-colors duration-150"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-brand-indigo">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-content-primary truncate">{c.title}</p>
                      <p className="text-[11px] text-content-secondary truncate">{c.location}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-content-primary">{c.studentName}</p>
                      <p className="text-[10px] text-content-muted font-mono">{c.studentId || c.studentEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-secondary text-content-primary border border-border">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={c.status} showDot>
                        {c.status === 'in-progress'
                          ? 'In Progress'
                          : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={c.priority}>{c.priority}</Badge>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() => handleOpenTriage(c)}
                        className="bg-surface-card hover:bg-surface-secondary text-xs font-semibold shadow-soft"
                      >
                        Triage Issue
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Interactive Triage & Dispatch Modal */}
      <AdminComplaintModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedComplaint(null);
        }}
        onUpdated={handleComplaintUpdated}
      />
    </div>
  );
}

export default AdminDashboardPage;
