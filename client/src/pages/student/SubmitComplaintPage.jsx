import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Upload,
  X,
  CheckCircle2,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { api } from '../../services/apiClient';
import {
  Card,
  CardContent,
  Button,
  Input,
  Select,
  ErrorMessage,
} from '../../components/ui';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

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

export function SubmitComplaintPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');

  // Image evidence state
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(''); // 'uploading' | 'done' | ''
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Validate selected image file
  const validateImage = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please select a JPEG, PNG, or WebP image.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `Image is too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handleImageSelect = useCallback((file) => {
    if (!file) return;
    const err = validateImage(file);
    if (err) {
      setImageError(err);
      return;
    }
    setImageError('');
    setEvidenceFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setEvidencePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
    // Reset input so same file can be reselected after removal
    e.target.value = '';
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);

  const removeEvidence = () => {
    setEvidenceFile(null);
    setEvidencePreview(null);
    setImageError('');
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Please provide a descriptive complaint title.';
    else if (title.trim().length < 6) errs.title = 'Title should be at least 6 characters.';
    if (!category) errs.category = 'Please select a relevant department category.';
    if (!location.trim()) errs.location = 'Specific campus location (building/room/block) is required.';
    if (!description.trim()) errs.description = 'Please describe the problem in detail.';
    else if (description.trim().length < 20) errs.description = 'Please provide more details (minimum 20 characters).';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // Step 1: Create complaint (text fields only)
      const created = await complaintService.createComplaint(
        { title, category, location, priority, description, attachments: [] },
        user
      );

      const complaintId = created.id || created.trackingId;

      // Step 2: If image selected, upload it to Cloudinary via backend
      if (evidenceFile && complaintId) {
        setUploadProgress('uploading');
        try {
          const formData = new FormData();
          formData.append('evidence', evidenceFile);

          const base = import.meta.env.VITE_API_BASE_URL || '';
          const token = localStorage.getItem('campuspulse_token');
          const uploadRes = await fetch(`${base}/api/complaints/${complaintId}/evidence`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          const uploadData = await uploadRes.json();

          if (!uploadRes.ok) {
            // Image upload failed — show warning but don't fail the complaint
            setErrors({ global: `Complaint submitted, but image upload failed: ${uploadData.error || 'Unknown error'}. You can retry from the complaint details page.` });
            setUploadProgress('');
            setSubmittedComplaint(created);
            return;
          }
          setUploadProgress('done');
          // Use updated complaint from response
          setSubmittedComplaint(uploadData.complaint || created);
        } catch (uploadErr) {
          console.error('Evidence upload error:', uploadErr);
          setErrors({ global: 'Complaint submitted, but image upload failed due to a network error. The complaint was saved.' });
          setUploadProgress('');
          setSubmittedComplaint(created);
          return;
        }
      } else {
        setSubmittedComplaint(created);
      }
    } catch (err) {
      console.error('Failed to register complaint', err);
      setErrors({ global: 'Failed to record complaint. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <Card className="border-workspace-border shadow-card text-center p-8 sm:p-10 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-soft">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              #{submittedComplaint.id || submittedComplaint.trackingId}
            </span>
            <h2 className="font-sora text-2xl font-bold text-workspace-textPrimary">
              Complaint Registered Successfully
            </h2>
            <p className="font-sans text-sm text-workspace-textSecondary max-w-md mx-auto leading-relaxed">
              Your grievance has been safely saved and queued for department assignment.
              {evidenceFile && uploadProgress === 'done' && ' Evidence image attached successfully.'}
            </p>

            {errors.global && (
              <div className="mt-2 text-left">
                <ErrorMessage severity="warning" message={errors.global} />
              </div>
            )}
          </div>

          {/* Evidence preview in success card */}
          {evidencePreview && uploadProgress === 'done' && (
            <div className="rounded-xl overflow-hidden border border-slate-200 mx-auto max-w-xs">
              <img src={evidencePreview} alt="Submitted evidence" className="w-full h-36 object-cover" />
              <p className="text-[11px] text-slate-400 py-1.5 bg-slate-50 text-center">Evidence submitted</p>
            </div>
          )}

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
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-amber-700">Pending Review</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={`/student/complaints/${submittedComplaint.id || submittedComplaint.trackingId}`}>
              <Button variant="primary" size="md">Track This Complaint</Button>
            </Link>
            <Link to="/student/dashboard">
              <Button variant="outline" size="md">Return to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-workspace-border">
        <Link to="/student/dashboard">
          <Button variant="ghost" size="sm" className="h-9 px-2 text-slate-500" aria-label="Back to dashboard">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="font-sora text-2xl font-bold text-workspace-textPrimary">File a Campus Complaint</h2>
          <p className="font-sans text-sm text-workspace-textSecondary mt-0.5">
            Submit a campus issue directly to facilities, residential, or IT administration.
          </p>
        </div>
      </div>

      {errors.global && <ErrorMessage severity="error" message={errors.global} />}

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
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: undefined })); }}
              error={errors.title}
              required
              helperText="Be specific about the equipment or physical asset affected."
            />

            {/* Category & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                id="complaint-category"
                name="category"
                label="Department Category"
                placeholder="Choose campus department..."
                value={category}
                onChange={(e) => { setCategory(e.target.value); if (errors.category) setErrors((p) => ({ ...p, category: undefined })); }}
                options={categories}
                error={errors.category}
                required
                helperText="Enables automatic dispatch to correct technicians."
              />
              <Input
                id="complaint-location"
                name="location"
                label="Specific Campus Location"
                placeholder="e.g., Hostel Block 4, Floor 3, Room 312"
                value={location}
                onChange={(e) => { setLocation(e.target.value); if (errors.location) setErrors((p) => ({ ...p, location: undefined })); }}
                error={errors.location}
                required
                helperText="Building name, floor, room number, or lab code."
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label htmlFor="complaint-priority" className="text-xs font-semibold text-slate-700 tracking-wide select-none block">
                Urgency / Priority Level
              </label>
              <select
                id="complaint-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-workspace-border bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <label htmlFor="complaint-description">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-normal text-slate-400">{description.length} characters</span>
              </div>
              <textarea
                id="complaint-description"
                rows={4}
                placeholder="Explain the problem in detail. Include safety warnings, when the issue began, or accessible inspection times..."
                value={description}
                onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors((p) => ({ ...p, description: undefined })); }}
                className={`w-full rounded-xl border p-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition-all ${
                  errors.description
                    ? 'border-red-400 focus:ring-4 focus:ring-red-500/10'
                    : 'border-workspace-border focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10'
                }`}
              />
              {errors.description && <p className="text-xs text-red-600 font-medium mt-0.5">{errors.description}</p>}
            </div>

            {/* Evidence Image Upload */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 tracking-wide block">
                  Attach Photo Evidence <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Upload a photo showing the issue to help administration understand the problem.
                </p>
              </div>

              {!evidenceFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? 'border-primary-400 bg-primary-50/50'
                      : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  aria-label="Upload evidence image"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <Upload className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-600">Drag and drop an image here, or browse files</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, or WebP — maximum {MAX_SIZE_MB} MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Image Preview */
                <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
                  <div className="relative">
                    <img
                      src={evidencePreview}
                      alt="Selected evidence preview"
                      className="w-full max-h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white transition-colors shadow-sm"
                        aria-label="Replace image"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={removeEvidence}
                        className="bg-white/90 backdrop-blur-sm border border-red-200 rounded-lg p-1 text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileInputChange}
                      className="hidden"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="px-4 py-2.5 border-t border-slate-100 flex items-center gap-2 text-xs">
                    <ImageIcon className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">{evidenceFile.name}</span>
                    <span className="text-slate-400 shrink-0">({(evidenceFile.size / 1024).toFixed(0)} KB)</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-auto" />
                  </div>
                </div>
              )}

              {imageError && (
                <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {imageError}
                </div>
              )}
            </div>

            {/* Upload progress indicator */}
            {isSubmitting && evidenceFile && uploadProgress === 'uploading' && (
              <div className="flex items-center gap-2 text-xs text-primary-600 font-medium">
                <div className="w-3.5 h-3.5 border-2 border-primary-400 border-t-primary-700 rounded-full animate-spin shrink-0" />
                Uploading evidence image to secure storage...
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <Link to="/student/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto">Cancel</Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full sm:w-auto shadow-sm px-6"
                rightIcon={<Send className="w-4 h-4" />}
              >
                {isSubmitting
                  ? uploadProgress === 'uploading'
                    ? 'Uploading Evidence...'
                    : 'Submitting...'
                  : 'Submit Complaint'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SubmitComplaintPage;
