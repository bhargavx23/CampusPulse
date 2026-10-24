import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building2,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  User,
  Paperclip,
  ShieldCheck,
  Send,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  ErrorMessage,
  EmptyState,
} from '../../components/ui';

export function ComplaintDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && user?.email) {
      loadComplaint();
    }
  }, [id, user]);

  const loadComplaint = async () => {
    setIsLoading(true);
    setNotFound(false);
    setIsUnauthorized(false);

    try {
      const item = await complaintService.getComplaintById(id);

      if (!item) {
        setNotFound(true);
        return;
      }

      if (item.unauthorized) {
        setIsUnauthorized(true);
        return;
      }

      // Check student ownership (case-insensitive) if user is a student
      if (user?.role === 'student' && item.studentEmail && user.email) {
        if (item.studentEmail.toLowerCase() !== user.email.toLowerCase()) {
          setIsUnauthorized(true);
          return;
        }
      }

      setComplaint(item);
    } catch (err) {
      if (
        err.message &&
        (err.message.includes('403') ||
          err.message.toLowerCase().includes('unauthorized') ||
          err.message.toLowerCase().includes('forbidden'))
      ) {
        setIsUnauthorized(true);
      } else {
        setNotFound(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') return <Badge variant="resolved" showDot>Resolved</Badge>;
    if (s === 'in-progress') return <Badge variant="in-progress" showDot>In Progress</Badge>;
    if (s === 'rejected') return <Badge variant="rejected" showDot>Rejected</Badge>;
    return <Badge variant="pending" showDot>Pending Review</Badge>;
  };

  // Ownership error state
  if (isUnauthorized) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-fade-in">
        <ErrorMessage
          severity="error"
          title="Access Restricted"
          message="This complaint was filed by another student. To protect student privacy, complaint records are strictly restricted to the registered owner."
          action={
            <Link to="/student/complaints">
              <Button variant="outline" size="sm" className="mt-3" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to My Complaints
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // Not found error state
  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-fade-in">
        <EmptyState
          icon={<FileText className="w-8 h-8 text-slate-400" />}
          title="Complaint Record Not Found"
          description={`No active grievance record was found matching tracking ID #${id}.`}
          action={
            <Link to="/student/complaints">
              <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to My Complaints
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (isLoading || !complaint) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-xs text-slate-400">
        Loading complaint record...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-workspace-border">
        <div className="flex items-center gap-3">
          <Link to="/student/complaints">
            <Button variant="ghost" size="sm" className="h-9 px-2 text-slate-500" aria-label="Back to complaints">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary-700 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded">
                #{complaint.id}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-600">
                {complaint.category}
              </span>
            </div>
            <h2 className="font-sora text-xl sm:text-2xl font-bold text-workspace-textPrimary mt-0.5">
              {complaint.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {getStatusBadge(complaint.status)}
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Priority: {complaint.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaint Details & Attachments (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Description Card */}
          <Card className="border-workspace-border shadow-soft">
            <CardHeader>
              <div>
                <CardTitle className="text-base font-semibold">Grievance Description</CardTitle>
                <CardDescription>Submitted details and physical location markers</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 font-sans text-sm leading-relaxed text-slate-700">
              <p className="whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
                {complaint.description}
              </p>

              {/* Location & Meta info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                    Campus Location
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                    <span>{complaint.location}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                    Submission Timestamp
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                    <span>{formatDate(complaint.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Attachments Card (if any) */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <Card className="border-workspace-border shadow-soft">
              <CardHeader>
                <div>
                  <CardTitle className="text-base font-semibold">Attached Evidence</CardTitle>
                  <CardDescription>Files submitted with this complaint</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {complaint.attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-blue-50 text-primary-600">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{file.name}</p>
                          <p className="text-[11px] text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-primary-600 px-2.5 py-1 rounded bg-slate-50 border border-slate-200">
                        Attached
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resolution Remarks (when resolved) */}
          {complaint.resolutionNote && (
            <Card className="border-emerald-200 bg-emerald-50/40 shadow-soft">
              <CardHeader className="border-b border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Resolution Findings & Actions Taken</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-sans text-emerald-900 leading-relaxed">
                  {complaint.resolutionNote}
                </p>
                <p className="text-xs text-emerald-700/80 mt-2">
                  Verified by: {complaint.assignedTo}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Refined Vertical Status Timeline (1 Col) */}
        <div className="space-y-6">
          <Card className="border-workspace-border shadow-soft">
            <CardHeader>
              <div>
                <CardTitle className="text-base font-semibold">Progress Timeline</CardTitle>
                <CardDescription>Live dispatch audit log</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {Array.isArray(complaint.timeline) && complaint.timeline.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {complaint.timeline.map((event, index) => {
                    const isLatest = index === complaint.timeline.length - 1;
                    const isResolved = (event.status || '').toLowerCase() === 'resolved';
                    const isInProgress = (event.status || '').toLowerCase() === 'in-progress';

                    return (
                      <div key={event.id || index} className="relative text-xs space-y-1">
                        {/* Timeline status dot */}
                        <span
                          className={`absolute -left-6 top-1 w-3 h-3 rounded-full ring-4 ring-white ${
                            isResolved
                              ? 'bg-emerald-600'
                              : isInProgress
                              ? 'bg-blue-600'
                              : 'bg-primary-600'
                          }`}
                        />

                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                            {event.label}
                          </span>
                          {isLatest && (
                            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                              Latest
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400 block">
                          {formatDate(event.timestamp)}
                        </span>

                        <p className="text-slate-600 text-xs pt-1 leading-relaxed font-sans">
                          {event.note}
                        </p>

                        <div className="pt-1 text-[11px] font-medium text-slate-400">
                          By: <span className="text-slate-600 font-semibold">{event.actor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No timeline events recorded yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Department Handler Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-2 text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block">
              Handling Authority
            </span>
            <p className="font-semibold text-slate-800 text-sm">
              {complaint.assignedTo || 'Central Facilities Dispatch'}
            </p>
            <p className="text-slate-500 text-[11px]">
              Institutional complaints are managed according to the CampusPulse campus escalation policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetailsPage;
