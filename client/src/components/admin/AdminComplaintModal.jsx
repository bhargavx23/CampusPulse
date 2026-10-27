import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle2,
  AlertCircle,
  User,
  MapPin,
  Tag,
  Send,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react';
import { Button, Select, Badge } from '../ui';
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
  const [evidenceLightbox, setEvidenceLightbox] = useState(false);

  // Get evidence image URL
  const evidenceImage = Array.isArray(complaint?.attachments)
    ? complaint.attachments.find((a) => a.url && a.type && a.type.startsWith('image/'))
    : null;

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

      {/* Evidence Lightbox */}
      {evidenceLightbox && evidenceImage && (
        <div
          className="fixed inset-0 z-[10000] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setEvidenceLightbox(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setEvidenceLightbox(false)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-1"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={evidenceImage.url}
              alt="Evidence full view"
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-modal border border-[#E3E8E6] flex flex-col max-h-[90vh] overflow-hidden z-10 animate-modal-in"
      >
        {/* Header - Pinned at top */}
        <div className="shrink-0 px-6 py-4 border-b border-[#E3E8E6] bg-[#F6F7F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EAF1F4] text-[#48677A] border border-primary-200">
              {complaint.id}
            </span>
            <h2 id="modal-title" className="font-display text-base font-bold text-[#202B33]">
              Administrative Grievance Triage
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5D6B73] hover:text-[#202B33] hover:bg-[#E3E8E6]/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
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
            <div className="p-4 rounded-xl bg-[#F6F7F5] border border-[#E3E8E6] space-y-2">
              <h3 className="font-display text-sm font-bold text-[#202B33]">
                {complaint.title}
              </h3>
              <p className="text-xs text-[#5D6B73] leading-relaxed">
                {complaint.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#5D6B73]">
                <span className="flex items-center gap-1 font-medium text-[#202B33]">
                  <User className="w-3.5 h-3.5 text-[#48677A]" />
                  {complaint.studentName} ({complaint.studentId || complaint.studentEmail})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#87939A]" />
                  {complaint.location}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#87939A]" />
                  {complaint.category}
                </span>
              </div>
            </div>

            {/* Evidence Image (if available) */}
            {evidenceImage && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#202B33]">Photo Evidence</p>
                <div
                  className="relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer group"
                  onClick={() => setEvidenceLightbox(true)}
                  role="button"
                  aria-label="View evidence image enlarged"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setEvidenceLightbox(true)}
                >
                  <img
                    src={evidenceImage.url}
                    alt="Complaint evidence photo"
                    className="w-full max-h-48 object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                    <span className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Enlarge
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ImageIcon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{evidenceImage.name}</span>
                  {evidenceImage.size && <span className="shrink-0">({evidenceImage.size})</span>}
                </div>
              </div>
            )}

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
              <label htmlFor="modal-note" className="text-xs font-semibold text-[#202B33] block mb-1">
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
                className="w-full text-xs rounded-xl border border-[#E3E8E6] p-3 text-[#202B33] placeholder-[#87939A] focus:outline-none focus:border-[#48677A] focus:ring-4 focus:ring-primary-500/10 transition-all resize-y"
              />
            </div>
          </div>

          {/* Modal Actions - Pinned at bottom */}
          <div className="shrink-0 px-6 py-4 border-t border-[#E3E8E6] bg-[#F6F7F5] flex items-center justify-end gap-3">
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
              className="shadow-soft bg-[#48677A] hover:bg-[#4338CA] text-white"
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
