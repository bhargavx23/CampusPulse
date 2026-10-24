import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  User,
  MapPin,
  Tag,
  Paperclip,
  Send,
  Shield,
  FileText,
} from 'lucide-react';
import { Button, Input, Select, Badge } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';

const DEPARTMENT_OPTIONS = [
  { value: 'Campus Electrical Services (Unit 2)', label: 'Campus Electrical Services (Unit 2)' },
  { value: 'Residential Maintenance & Plumbing', label: 'Residential Maintenance & Plumbing' },
  { value: 'Network Operations Center (NOC)', label: 'Network Operations Center (NOC)' },
  { value: 'Civil Infrastructure & Carpentry', label: 'Civil Infrastructure & Carpentry' },
  { value: 'Sanitation & Housekeeping Wing', label: 'Sanitation & Housekeeping Wing' },
  { value: 'AV & Multimedia Support', label: 'AV & Multimedia Support' },
  { value: 'Campus Security & Safety Desk', label: 'Campus Security & Safety Desk' },
  { value: 'General Administrative Triage', label: 'General Administrative Triage' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending (Under Review / Triage)' },
  { value: 'in-progress', label: 'In Progress (Technician Dispatched)' },
  { value: 'resolved', label: 'Resolved (Issue Remediated & Closed)' },
  { value: 'rejected', label: 'Rejected (Non-compliant / Invalid)' },
];

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low — Minor inconvenience' },
  { value: 'Medium', label: 'Medium — Impedes daily comfort' },
  { value: 'High', label: 'High — Disrupts academic activity' },
  { value: 'Urgent', label: 'Urgent — Safety hazard / Emergency' },
];

export function AdminComplaintModal({ complaint, isOpen, onClose, onUpdated }) {
  const { user } = useAuth();

  const [status, setStatus] = useState(complaint?.status || 'pending');
  const [assignedTo, setAssignedTo] = useState(
    complaint?.assignedTo && complaint?.assignedTo !== 'Awaiting Department Assignment'
      ? complaint.assignedTo
      : DEPARTMENT_OPTIONS[0].value
  );
  const [priority, setPriority] = useState(complaint?.priority || 'Medium');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sync state whenever complaint changes
  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'pending');
      setAssignedTo(
        complaint.assignedTo && complaint.assignedTo !== 'Awaiting Department Assignment'
          ? complaint.assignedTo
          : DEPARTMENT_OPTIONS[0].value
      );
      setPriority(complaint.priority || 'Medium');
      setNote('');
      setError('');
    }
  }, [complaint]);

  // Lock background scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await complaintService.adminUpdateComplaint(
        complaint.id,
        {
          status,
          assignedTo,
          priority,
          note: note.trim() || undefined,
          resolutionNote: status === 'resolved' ? (note.trim() || 'Remediation completed and verified.') : undefined,
        },
        user
      );

      if (res.success) {
        setIsSubmitting(false);
        if (onUpdated) onUpdated(res.complaint);
        onClose();
      } else {
        setError(res.error || 'Failed to update complaint.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred while updating the complaint.');
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-modal border border-[#E1E4EB] flex flex-col max-h-[90vh] overflow-hidden z-10 animate-modal-in"
      >
        {/* Header - Pinned at top */}
        <div className="shrink-0 px-6 py-4 border-b border-[#E1E4EB] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5] border border-indigo-200">
              {complaint.id}
            </span>
            <h2 id="modal-title" className="font-display text-base font-bold text-[#202638]">
              Administrative Grievance Triage
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#687084] hover:text-[#202638] hover:bg-[#E1E4EB]/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container wrapping scrollable body and pinned actions footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Complaint Summary Box */}
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E1E4EB] space-y-2">
              <h3 className="font-display text-sm font-bold text-[#202638]">
                {complaint.title}
              </h3>
              <p className="text-xs text-[#687084] leading-relaxed">
                {complaint.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#687084]">
                <span className="flex items-center gap-1 font-medium text-[#202638]">
                  <User className="w-3.5 h-3.5 text-[#4F46E5]" />
                  {complaint.studentName} ({complaint.studentId || complaint.studentEmail})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8B92A3]" />
                  {complaint.location}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#8B92A3]" />
                  {complaint.category}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Operational Update Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Selector */}
              <Select
                id="modal-status"
                name="status"
                label="Target Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={STATUS_OPTIONS}
                required
              />

              {/* Priority Selector */}
              <Select
                id="modal-priority"
                name="priority"
                label="Assessed Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                options={PRIORITY_OPTIONS}
                required
              />
            </div>

            {/* Department Assignment */}
            <Select
              id="modal-assigned"
              name="assignedTo"
              label="Assigned Maintenance Department / Team"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              options={DEPARTMENT_OPTIONS}
              required
            />

            {/* Administrative / Resolution Note */}
            <div>
              <label htmlFor="modal-note" className="text-xs font-semibold text-[#202638] block mb-1">
                {status === 'resolved'
                  ? 'Official Resolution Findings (Required for closing)'
                  : 'Administrative Action Note (Added to timeline & notified to student)'}
              </label>
              <textarea
                id="modal-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  status === 'resolved'
                    ? 'e.g. Capacitor replaced, breaker load recalibrated. Operational check verified with department lab in-charge.'
                    : 'e.g. Technician dispatched for on-site inspection. Parts scheduled for installation at 2:00 PM.'
                }
                className="w-full text-xs rounded-xl border border-[#E1E4EB] p-3 text-[#202638] placeholder-[#8B92A3] focus:outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-500/10 transition-all resize-y"
              />
            </div>
          </div>

          {/* Modal Actions - Pinned at bottom */}
          <div className="shrink-0 px-6 py-4 border-t border-[#E1E4EB] bg-[#FAF9F6] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              className="shadow-soft bg-[#4F46E5] hover:bg-[#4338CA] text-white"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm & Update Grievance
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}

export default AdminComplaintModal;
