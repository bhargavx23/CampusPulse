import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Upload,
  FileCheck,
  X,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  HelpCircle,
  Building,
  Tag,
  AlignLeft,
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
  Input,
  Select,
  ErrorMessage,
} from '../../components/ui';

export function SubmitComplaintPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  // Submission & Validation States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const categories = [
    { value: 'Infrastructure', label: 'Infrastructure & Civil Repairs' },
    { value: 'Electricity', label: 'Electricity & Power Systems' },
    { value: 'Water Supply', label: 'Water Supply & Plumbing' },
    { value: 'Internet', label: 'Campus Wi-Fi & Internet' },
    { value: 'Classroom', label: 'Classroom & Audio-Visual Labs' },
    { value: 'Hostel', label: 'Hostel & Residential Amenities' },
    { value: 'Cleanliness', label: 'Sanitation & Cleanliness' },
    { value: 'Other', label: 'General / Other Campus Grievances' },
  ];

  const priorities = [
    { value: 'Low', label: 'Low — Routine repair or non-critical improvement' },
    { value: 'Medium', label: 'Medium — Impedes daily comfort or standard activity' },
    { value: 'High', label: 'High — Disrupts active lecture, lab, or essential service' },
    { value: 'Urgent', label: 'Urgent — Safety hazard, gas leak, or flooding emergency' },
  ];

  // File upload simulation handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newAttachments = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'document',
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const validate = () => {
    const errs = {};

    if (!title.trim()) {
      errs.title = 'Please provide a descriptive complaint title.';
    } else if (title.trim().length < 6) {
      errs.title = 'Title should be at least 6 characters.';
    }

    if (!category) {
      errs.category = 'Please select a relevant department category.';
    }

    if (!location.trim()) {
      errs.location = 'Specific campus location (building/room/block) is required.';
    }

    if (!description.trim()) {
      errs.description = 'Please describe the problem in detail.';
    } else if (description.trim().length < 20) {
      errs.description = 'Please provide more details (minimum 20 characters) to help technicians diagnose the issue.';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate real processing latency
      await new Promise((r) => setTimeout(r, 600));

      const created = await complaintService.createComplaint(
        {
          title,
          category,
          location,
          priority,
          description,
          attachments,
        },
        user
      );

      setSubmittedComplaint(created);
    } catch (err) {
      console.error('Failed to register complaint', err);
      setErrors({ global: 'Failed to record complaint. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully submitted, display verification confirmation
  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <Card className="border-workspace-border shadow-card text-center p-8 sm:p-10 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-soft">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              #{submittedComplaint.id}
            </span>
            <h2 className="font-sora text-2xl font-bold text-workspace-textPrimary">
              Complaint Registered Successfully
            </h2>
            <p className="font-sans text-sm text-workspace-textSecondary max-w-md mx-auto leading-relaxed">
              Your grievance has been safely saved and queued for department assignment. You can track real-time technician dispatch and resolution updates anytime.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2 font-sans max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Summary:</span>
              <span className="font-semibold text-slate-800 line-clamp-1">{submittedComplaint.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-800">{submittedComplaint.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-800">{submittedComplaint.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Initial Status:</span>
              <span className="font-semibold text-amber-700">Pending Review</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={`/student/complaints/${submittedComplaint.id}`}>
              <Button variant="primary" size="md">
                Track This Complaint
              </Button>
            </Link>
            <Link to="/student/dashboard">
              <Button variant="outline" size="md">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header with Back button */}
      <div className="flex items-center gap-3 pb-4 border-b border-workspace-border">
        <Link to="/student/dashboard">
          <Button variant="ghost" size="sm" className="h-9 px-2 text-slate-500" aria-label="Back to dashboard">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="font-sora text-2xl font-bold text-workspace-textPrimary">
            File a Campus Complaint
          </h2>
          <p className="font-sans text-sm text-workspace-textSecondary mt-0.5">
            Submit a campus issue directly to facilities, residential, or IT administration.
          </p>
        </div>
      </div>

      {errors.global && (
        <ErrorMessage severity="error" message={errors.global} />
      )}

      {/* Complaint Submission Form Card */}
      <Card className="border-workspace-border shadow-soft">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Title */}
            <Input
              id="complaint-title"
              name="title"
              label="Issue Headline"
              placeholder="e.g., Water leakage in Room 204 washroom or Projector bulb burned out"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
              }}
              error={errors.title}
              required
              helperText="Be specific about the equipment or physical asset affected."
            />

            {/* Category & Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                id="complaint-category"
                name="category"
                label="Department Category"
                placeholder="Choose campus department..."
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors((p) => ({ ...p, category: undefined }));
                }}
                options={categories}
                error={errors.category}
                required
                helperText="Enables automatic dispatch to the correct facility technicians."
              />

              <Input
                id="complaint-location"
                name="location"
                label="Specific Campus Location"
                placeholder="e.g., Hostel Block 4, Floor 3, Room 312"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((p) => ({ ...p, location: undefined }));
                }}
                error={errors.location}
                required
                helperText="Building name, floor, room number, or lab code."
              />
            </div>

            {/* Priority Selection */}
            <div className="space-y-2">
              <label
                htmlFor="complaint-priority"
                className="text-xs font-semibold text-slate-700 tracking-wide select-none"
              >
                Urgency / Priority Level
              </label>
              <select
                id="complaint-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-workspace-border bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label htmlFor="complaint-description">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-normal text-slate-400">
                  {description.length} characters
                </span>
              </div>
              <textarea
                id="complaint-description"
                rows={4}
                placeholder="Explain the problem in detail. Include any safety warnings, when the issue began, or times when technicians can inspect the room..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((p) => ({ ...p, description: undefined }));
                }}
                className={`w-full rounded-xl border p-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition-all ${
                  errors.description
                    ? 'border-red-400 focus:ring-4 focus:ring-red-500/10'
                    : 'border-workspace-border focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 font-medium mt-0.5">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Attachments Upload (Photos / Documentation) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 tracking-wide block">
                Evidence Attachments (Optional Photos / Documents)
              </label>

              <div className="border border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="attachment-file-input"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label
                  htmlFor="attachment-file-input"
                  className="cursor-pointer inline-flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                    <Upload className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                    Click to attach photos or repair documents
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Supports PNG, JPG, or PDF (up to 10 MB each)
                  </span>
                </label>
              </div>

              {/* Uploaded Files Pills */}
              {attachments.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-600 block">
                    Attached Files ({attachments.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs shadow-soft"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800 max-w-[160px] truncate">
                          {file.name}
                        </span>
                        <span className="text-slate-400 text-[10px]">({file.size})</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-0.5 rounded"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <Link to="/student/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 shadow-sm px-6"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Complaint
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SubmitComplaintPage;
