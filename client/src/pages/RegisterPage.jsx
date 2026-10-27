import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Hash,
  Layers,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Card, CardContent, ErrorMessage, Logo } from '../components/ui';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [section, setSection] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors & submission state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Engineering branches options
  const branchOptions = [
    { value: 'CSE — Computer Science and Engineering', label: 'CSE — Computer Science and Engineering' },
    { value: 'CSE (AI & ML)', label: 'CSE (AI & ML)' },
    { value: 'CSE (Data Science)', label: 'CSE (Data Science)' },
    { value: 'IT — Information Technology', label: 'IT — Information Technology' },
    { value: 'ECE — Electronics and Communication Engineering', label: 'ECE — Electronics and Communication Engineering' },
    { value: 'EEE — Electrical and Electronics Engineering', label: 'EEE — Electrical and Electronics Engineering' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'Civil Engineering', label: 'Civil Engineering' },
    { value: 'Other', label: 'Other Department' },
  ];

  // Year of study options
  const yearOptions = [
    { value: '1st Year', label: '1st Year (Freshman)' },
    { value: '2nd Year', label: '2nd Year (Sophomore)' },
    { value: '3rd Year', label: '3rd Year (Junior)' },
    { value: '4th Year', label: '4th Year (Senior)' },
  ];

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Full Name
    if (!fullName.trim()) {
      errs.fullName = 'Full name is required.';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }

    // 2. Email Address
    if (!email.trim()) {
      errs.email = 'Campus email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid institutional email (e.g. student@campus.edu).';
    }

    // 3. Password
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long.';
    }

    // 4. Confirm Password
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    // 5. Branch
    if (!branch) {
      errs.branch = 'Please select your academic branch.';
    }

    // 6. Year of Study
    if (!yearOfStudy) {
      errs.yearOfStudy = 'Please select your current year of study.';
    }

    // 7. Section
    if (!section.trim()) {
      errs.section = 'Section is required (e.g. A, B, or C).';
    } else if (section.trim().length > 4) {
      errs.section = 'Section code should be 1–3 characters.';
    }

    // 8. Roll Number
    if (!rollNumber.trim()) {
      errs.rollNumber = 'College roll number is required.';
    } else if (rollNumber.trim().length < 3) {
      errs.rollNumber = 'Roll number must be at least 3 characters.';
    }

    // Terms
    if (!agreeTerms) {
      errs.agreeTerms = 'You must acknowledge the campus guidelines to register.';
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
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        branch,
        yearOfStudy,
        section: section.trim().toUpperCase(),
        rollNumber: rollNumber.trim().toUpperCase(),
      });

      // Redirect to student dashboard upon successful registration
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setErrors({ global: err.message || 'Registration failed. Please check your information.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-main">
      <div className="w-full max-w-xl space-y-6 animate-fade-in-up">
        {/* Top Header / Branding */}
        <div className="text-center space-y-2">
          <Logo size="lg" />

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-content-primary tracking-tight pt-1">
            Student Registration
          </h1>
          <p className="font-sans text-sm text-content-secondary">
            Create your verified student profile to file and track campus issues.
          </p>
        </div>

        {/* Main Register Card */}
        <Card className="shadow-card border-border bg-surface-card">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {errors.global && (
              <ErrorMessage
                severity="error"
                message={errors.global}
                onDismiss={() => setErrors((p) => ({ ...p, global: undefined }))}
              />
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* SECTION 1: Personal & Account Credentials */}
              <div className="space-y-4">
                <div className="pb-1 border-b border-border">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-content-secondary">
                    1. Account Credentials
                  </h2>
                </div>

                {/* Full Name */}
                <Input
                  id="register-fullname"
                  name="fullName"
                  type="text"
                  label="Full Name"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  error={errors.fullName}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                  autoComplete="name"
                />

                {/* Campus Email */}
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  label="Campus Email Address"
                  placeholder="alex.morgan@campus.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  error={errors.email}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  autoComplete="email"
                  helperText="Use your institutional student email for official correspondence."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    error={errors.password}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-[#87939A] hover:text-[#202B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48677A] rounded transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    }
                    required
                    autoComplete="new-password"
                  />

                  {/* Confirm Password */}
                  <Input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    error={errors.confirmPassword}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1 text-[#87939A] hover:text-[#202B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48677A] rounded transition-colors"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    }
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* SECTION 2: Academic Details */}
              <div className="space-y-4 pt-2">
                <div className="pb-1 border-b border-border">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-content-secondary">
                    2. Academic Information
                  </h2>
                </div>

                {/* Branch Dropdown */}
                <Select
                  id="register-branch"
                  name="branch"
                  label="Branch / Department"
                  placeholder="Select your engineering branch"
                  value={branch}
                  onChange={(e) => {
                    setBranch(e.target.value);
                    if (errors.branch) setErrors((prev) => ({ ...prev, branch: undefined }));
                  }}
                  options={branchOptions}
                  error={errors.branch}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Year of Study Dropdown */}
                  <Select
                    id="register-year"
                    name="yearOfStudy"
                    label="Year of Study"
                    placeholder="Select year"
                    value={yearOfStudy}
                    onChange={(e) => {
                      setYearOfStudy(e.target.value);
                      if (errors.yearOfStudy) setErrors((prev) => ({ ...prev, yearOfStudy: undefined }));
                    }}
                    options={yearOptions}
                    error={errors.yearOfStudy}
                    required
                  />

                  {/* Section */}
                  <Input
                    id="register-section"
                    name="section"
                    type="text"
                    label="Section"
                    placeholder="e.g. A, B, or C"
                    value={section}
                    onChange={(e) => {
                      setSection(e.target.value);
                      if (errors.section) setErrors((prev) => ({ ...prev, section: undefined }));
                    }}
                    error={errors.section}
                    required
                    helperText="Classroom cohort section"
                  />
                </div>

                {/* Roll Number */}
                <Input
                  id="register-roll"
                  name="rollNumber"
                  type="text"
                  label="College Roll Number"
                  placeholder="e.g. 21CS042 or STU-2024-8842"
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value);
                    if (errors.rollNumber) setErrors((prev) => ({ ...prev, rollNumber: undefined }));
                  }}
                  error={errors.rollNumber}
                  leftIcon={<Hash className="w-4 h-4" />}
                  required
                  helperText="Your official college registration / hall ticket number."
                />
              </div>

              {/* Account Role Notice */}
              <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-xs text-content-secondary flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-brand-indigo shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-content-primary">Role: Student Portal (Default)</span>
                  <p className="text-[11px] text-content-secondary">
                    Student registration provisions an authenticated student workspace. Administrator credentials are provisioned exclusively by institution authorities.
                  </p>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-content-secondary">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
                    }}
                    className="w-4 h-4 rounded border-border-strong text-brand-indigo focus:ring-brand-indigo focus:ring-offset-0 mt-0.5 cursor-pointer"
                  />
                  <span>
                    I confirm that the academic details entered are accurate and agree to follow the campus grievance reporting guidelines.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-accent-rose font-medium mt-1">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-medium shadow-soft"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Verifying & Creating Profile...' : 'Complete Registration & Enter Dashboard'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link to Login */}
        <div className="text-center text-xs sm:text-sm text-content-secondary">
          <span>Already have a student account? </span>
          <Link
            to="/login"
            className="font-semibold text-brand-indigo hover:text-brand-deep transition-colors"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
