import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * PBKDF2 Password Hashing & Verification
 * 100,000 iterations with SHA-512 and cryptographic 16-byte salt
 */
export function hashPassword(password) {
  if (!password) return '';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

export const VALID_BRANCHES = [
  'CSE — Computer Science and Engineering',
  'CSE (AI & ML)',
  'CSE (Data Science)',
  'IT — Information Technology',
  'ECE — Electronics and Communication Engineering',
  'EEE — Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other',
];

export const VALID_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
      index: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      index: true,
    },
    branch: {
      type: String,
      default: '',
    },
    yearOfStudy: {
      type: String,
      default: '',
    },
    section: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    rollNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
      index: true,
    },
    studentId: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    hostelBlock: {
      type: String,
      trim: true,
      default: 'Residential Block',
    },
    roomNumber: {
      type: String,
      trim: true,
      default: 'N/A',
    },
    emergencyContact: {
      type: String,
      default: 'Campus Emergency Services (+1 555-HELP)',
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    passwordResetTokenHash: {
      type: String,
      select: false,
      default: null,
      index: true,
    },
    passwordResetExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
    passwordResetOtpHash: {
      type: String,
      select: false,
      default: null,
    },
    passwordResetOtpExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
    passwordResetOtpAttempts: {
      type: Number,
      select: false,
      default: 0,
    },
    passwordResetOtpResendAfter: {
      type: Date,
      select: false,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify candidate password
userSchema.methods.comparePassword = function (candidatePassword) {
  return verifyPassword(candidatePassword, this.passwordHash);
};

// Transform to clean JSON representation (stripping sensitive hashes, OTPs, tokens, and __v)
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.passwordResetTokenHash;
    delete ret.passwordResetExpiresAt;
    delete ret.passwordResetOtpHash;
    delete ret.passwordResetOtpExpiresAt;
    delete ret.passwordResetOtpAttempts;
    delete ret.passwordResetOtpResendAfter;
    delete ret.__v;
    ret.id = ret._id.toString();
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
