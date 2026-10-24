import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  RotateCw,
  ArrowRight,
} from 'lucide-react';
import { Button, Input, Card, CardContent, ErrorMessage, Logo } from '../components/ui';
import { userService } from '../services/userService';

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Multi-step flow: 1 = Email, 2 = Verify OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading, cooldown, and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(undefined);
  const [successInfo, setSuccessInfo] = useState('');

  // Refs for OTP input auto-focus
  const otpInputRefs = useRef([]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first OTP box when entering Step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [step]);

  // --- Step 1: Request OTP ---
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setError(undefined);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Please enter your registered campus email address.');
      return;
    }
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid institutional email address (e.g. user@campus.edu).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await userService.forgotPassword(cleanEmail);
      if (res.success) {
        setCooldown(res.cooldownSeconds || 60);
        setStep(2);
        setSuccessInfo(res.message || 'If an account exists, a 6-digit OTP has been sent to your email.');
      } else {
        setError(res.error || 'Unable to send OTP. Please verify your email and try again.');
      }
    } catch (err) {
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Resend OTP ---
  const handleResendOtp = async () => {
    if (cooldown > 0 || isResending) return;
    setError(undefined);
    setIsResending(true);

    try {
      const res = await userService.resendOtp(email.trim());
      if (res.success) {
        setCooldown(res.cooldownSeconds || 60);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessInfo('A new 6-digit verification code has been dispatched to your email.');
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      } else {
        setError(res.error || 'Failed to resend code. Please wait before trying again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // --- Step 2: Handle OTP input changes ---
  const handleOtpDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');

    // Handle multi-character paste (e.g. "123456")
    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 6).split('');
      const updated = [...otpDigits];
      pasted.forEach((ch, i) => {
        if (i < 6) updated[i] = ch;
      });
      setOtpDigits(updated);
      const nextIndex = Math.min(pasted.length, 5);
      if (otpInputRefs.current[nextIndex]) {
        otpInputRefs.current[nextIndex].focus();
      }
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleanVal;
    setOtpDigits(updated);

    if (error) setError(undefined);

    // Auto-advance to next box if digit typed
    if (cleanVal && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Backspace: clear current and focus previous
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  // --- Step 2: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError(undefined);

    const fullOtp = otpDigits.join('').trim();
    if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await userService.verifyOtp({
        email: email.trim(),
        otp: fullOtp,
      });

      if (res.success && res.resetToken) {
        setResetToken(res.resetToken);
        setStep(3);
        setSuccessInfo('Verification code confirmed. You may now set your new password.');
      } else {
        setError(res.error || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step 3: Reset Password ---
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setError(undefined);

    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await userService.resetPassword({
        email: email.trim(),
        resetToken,
        password,
        confirmPassword,
      });

      if (res.success) {
        setStep(4);
      } else {
        setError(res.error || 'Failed to reset password. Authorization may have expired.');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-main">
      <div className="w-full max-w-md space-y-6 animate-fade-in-up">
        {/* Top Header / Branding */}
        <div className="text-center space-y-2">
          <Logo size="lg" />

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-content-primary tracking-tight pt-2">
            {step === 1 && 'Forgot your password?'}
            {step === 2 && 'Verify Account OTP'}
            {step === 3 && 'Create New Password'}
            {step === 4 && 'Password Reset Complete'}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-content-secondary max-w-sm mx-auto">
            {step === 1 && 'Enter your registered campus email address and we will send a 6-digit verification code.'}
            {step === 2 && `Enter the 6-digit code sent to ${email}.`}
            {step === 3 && 'Your verification code was confirmed. Choose a strong new password.'}
            {step === 4 && 'Your password has been successfully updated.'}
          </p>
        </div>

        {/* Step Progress Pills */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-brand-indigo' : 'w-4 bg-brand-indigo/40'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-brand-indigo' : step > 2 ? 'w-4 bg-brand-indigo/40' : 'w-4 bg-[#E1E4EB]'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? 'w-8 bg-brand-indigo' : 'w-4 bg-[#E1E4EB]'}`} />
          </div>
        )}

        {/* Card */}
        <Card className="shadow-card border-border bg-surface-card">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Global Error Banner */}
            {error && (
              <ErrorMessage
                severity="error"
                message={error}
                onDismiss={() => setError(undefined)}
              />
            )}

            {/* ================= STEP 1: ENTER EMAIL ================= */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp} noValidate className="space-y-5">
                <Input
                  id="forgot-email"
                  name="email"
                  type="email"
                  label="Registered Campus Email"
                  placeholder="student@campus.edu or admin email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(undefined);
                  }}
                  error={error}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  autoComplete="email"
                  helperText="A single-use 6-digit OTP code will be delivered to this inbox."
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-medium shadow-soft"
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Sending Verification Code...' : 'Send Verification Code'}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-brand-indigo transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </form>
            )}

            {/* ================= STEP 2: VERIFY OTP ================= */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} noValidate className="space-y-5">
                <div className="p-3.5 rounded-xl bg-surface-secondary border border-border flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <span className="text-content-secondary block text-[11px]">Verification sent to:</span>
                    <span className="font-semibold text-content-primary truncate">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError(undefined);
                      setOtpDigits(['', '', '', '', '', '']);
                    }}
                    className="text-brand-indigo hover:underline text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>

                {/* 6-Box OTP Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-content-primary text-center">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                          digit
                            ? 'border-brand-indigo bg-brand-soft/40 text-brand-indigo shadow-xs'
                            : 'border-[#E1E4EB] bg-[#FAF9F6] text-content-primary focus:border-brand-indigo focus:bg-white focus:ring-4 focus:ring-indigo-500/10'
                        }`}
                        aria-label={`Digit ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-content-secondary text-center pt-1">
                    Code expires in <strong>5 minutes</strong>. Single use only.
                  </p>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-medium shadow-soft"
                  isLoading={isSubmitting}
                  rightIcon={<KeyRound className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Verifying Code...' : 'Verify Code & Proceed'}
                </Button>

                {/* Resend Cooldown Section */}
                <div className="pt-2 text-center space-y-2">
                  {cooldown > 0 ? (
                    <p className="text-xs text-content-secondary">
                      Resend code available in{' '}
                      <span className="font-mono font-bold text-brand-indigo">{cooldown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-indigo hover:text-brand-deep transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                      <span>{isResending ? 'Resending Code...' : 'Resend Verification Code'}</span>
                    </button>
                  )}

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError(undefined);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back to start</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ================= STEP 3: RESET PASSWORD ================= */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} noValidate className="space-y-5">
                <div className="p-3.5 rounded-xl bg-accent-tealSoft border border-teal-200 text-xs text-accent-teal flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>OTP verified successfully for <strong>{email}</strong></span>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <Input
                    id="reset-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(undefined);
                    }}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-content-muted hover:text-content-primary focus:outline-none rounded transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                    autoComplete="new-password"
                    helperText="Must be at least 6 characters long."
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Input
                    id="reset-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm New Password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError(undefined);
                    }}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1 text-content-muted hover:text-content-primary focus:outline-none rounded transition-colors cursor-pointer"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                    autoComplete="new-password"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-medium shadow-soft"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Resetting Password...' : 'Save New Password & Sign In'}
                </Button>
              </form>
            )}

            {/* ================= STEP 4: SUCCESS STATE ================= */}
            {step === 4 && (
              <div className="space-y-6 text-center animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-accent-tealSoft text-accent-teal border border-accent-teal/20 flex items-center justify-center mx-auto shadow-soft">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-content-primary">
                    Password Reset Complete
                  </h3>
                  <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                    Your password has been changed successfully. You can now log in using your updated credentials.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-xs text-content-secondary text-left space-y-1">
                  <p className="font-semibold text-content-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-indigo" />
                    Session Invalidation
                  </p>
                  <p className="text-[11px] text-content-secondary">
                    All prior active sessions and tokens have been revoked. Please sign in with your new password.
                  </p>
                </div>

                <div className="pt-2">
                  <Link to="/login" className="block">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full shadow-soft"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Sign In Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Support Notice */}
        <div className="text-center text-xs text-content-muted">
          Need assistance? Contact{' '}
          <span className="font-semibold text-content-secondary">Campus IT Support Desk</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
