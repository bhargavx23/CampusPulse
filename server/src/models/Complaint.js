import mongoose from 'mongoose';

export const COMPLAINT_CATEGORIES = [
  'Electricity',
  'Water Supply',
  'Classroom',
  'Hostel',
  'Internet & Wi-Fi',
  'Library',
  'Security',
  'Other',
];

export const COMPLAINT_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const COMPLAINT_STATUSES = ['pending', 'in-progress', 'resolved', 'rejected'];

const timelineItemSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => `tl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` },
    status: { type: String, required: true },
    label: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    actor: { type: String, required: true },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    size: { type: String, default: '' },
    type: { type: String, default: 'application/octet-stream' },
    url: { type: String, default: '' },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    studentId: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      minlength: 4,
      maxlength: 150,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: COMPLAINT_CATEGORIES,
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: COMPLAINT_PRIORITIES,
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: COMPLAINT_STATUSES,
      default: 'pending',
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: 10,
    },
    assignedTo: {
      type: String,
      default: 'Facilities Management Desk',
      trim: true,
    },
    resolutionNote: {
      type: String,
      default: '',
      trim: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    attachments: [attachmentSchema],
    timeline: [timelineItemSchema],
  },
  {
    timestamps: true,
  }
);

complaintSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret.trackingId; // Map trackingId as primary id for frontend compatibility
    ret._dbId = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
export default Complaint;
