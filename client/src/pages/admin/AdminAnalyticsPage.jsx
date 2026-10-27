import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '../../components/ui';
import { complaintService } from '../../services/complaintService';

export function AdminAnalyticsPage() {
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

  useEffect(() => {
    const fetchStats = async () => {
      const data = await complaintService.getAdminAnalytics();
      setAnalytics(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8E6]">
        <div>
          <h1 className="font-sora text-2xl font-bold text-[#202B33]">
            Campus Redressal Intelligence & Analytics
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#5D6B73] mt-0.5">
            Operational performance indicators, department resolution timelines, and category volume metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/complaints">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Open Operations Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resolution Rate */}
        <div className="rounded-2xl bg-white border border-[#E3E8E6] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#287C78]">
              Resolution Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F5EC] text-[#287C78] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-3xl font-bold text-[#287C78]">
            {analytics.resolutionRate}%
          </div>
          <p className="text-[11px] text-[#5D6B73] mt-1">
            {analytics.resolved} of {analytics.total} grievances closed
          </p>
        </div>

        {/* Avg Resolution Speed */}
        <div className="rounded-2xl bg-white border border-[#E3E8E6] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#48677A]">
              Avg. Turnaround
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF1F4] text-[#48677A] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-3xl font-bold text-[#48677A]">
            ~18.5 hrs
          </div>
          <p className="text-[11px] text-[#5D6B73] mt-1">
            From submission to resolution
          </p>
        </div>

        {/* Active Backlog */}
        <div className="rounded-2xl bg-white border border-[#E3E8E6] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B7791F]">
              Active Backlog
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF3D8] text-[#B7791F] flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-3xl font-bold text-[#B7791F]">
            {analytics.pending + analytics.inProgress}
          </div>
          <p className="text-[11px] text-[#5D6B73] mt-1">
            {analytics.pending} pending • {analytics.inProgress} in progress
          </p>
        </div>

        {/* Urgent Critical Attention */}
        <div className="rounded-2xl bg-white border border-[#E3E8E6] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Urgent Safety Flags
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FCEAEA] text-[#DC2626] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-3xl font-bold text-[#DC2626]">
            {analytics.urgent}
          </div>
          <p className="text-[11px] text-red-700/80 mt-1">
            Requires priority remediation
          </p>
        </div>
      </div>

      {/* 2. Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department / Category Breakdown */}
        <Card className="border-[#E3E8E6] shadow-xs bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#202B33]">
              Departmental Issue Volume
            </CardTitle>
            <CardDescription>
              Volume share across university facility divisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(analytics?.categoryStats || []).length === 0 ? (
              <p className="text-xs text-[#87939A]">No complaints registered yet.</p>
            ) : (
              (analytics?.categoryStats || []).map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#202B33]">{cat.category}</span>
                    <span className="font-mono text-[#5D6B73]">
                      {cat.count} issues ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EEF1EF] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#48677A] transition-all duration-500 ease-out"
                      style={{ width: `${Math.max(cat.percentage, 3)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Maintenance Dispatch Distribution */}
        <Card className="border-[#E3E8E6] shadow-xs bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#202B33]">
              Active Departmental Dispatch Assignments
            </CardTitle>
            <CardDescription>
              Technician team allocation across unresolved and completed work orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(analytics?.departmentMap || {}).length === 0 ? (
              <p className="text-xs text-[#87939A]">No assigned departments recorded.</p>
            ) : (
              Object.entries(analytics?.departmentMap || {}).map(([dept, count]) => (
                <div
                  key={dept}
                  className="p-3.5 rounded-xl bg-[#EEF1EF] border border-[#E3E8E6] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-[#48677A]" />
                    <span className="font-semibold text-[#202B33]">{dept}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#48677A] bg-white px-2.5 py-1 rounded-lg border border-[#E3E8E6] shadow-xs">
                    {count} tickets
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;
