import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, CardContent, ErrorMessage, Logo } from '../components/ui';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address (e.g., student@campus.edu).';
    }

    if (!password) {
      errs.password = 'Password is required.';
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
      const res = await login(email, password);
      let destination = location.state?.from?.pathname;
      if (!destination) {
        destination = res.user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      }
      navigate(destination, { replace: true });
    } catch (err) {
      setErrors({ global: err.message || 'Authentication failed. Please verify your email and password.' });
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
            Welcome back
          </h1>
          <p className="font-sans text-sm text-content-secondary">
            Sign in to manage and track campus issues.
          </p>
        </div>

        {/* Main Login Card */}
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
              {/* Email Address */}
              <Input
                id="login-email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="student@campus.edu or admin email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4" />}
                required
                autoComplete="email"
              />

              {/* Password */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-700 tracking-wide block">
                  Password <span className="text-red-500">*</span>
                </span>
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
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
                      className="p-1 text-[#8B92A3] hover:text-[#202638] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded transition-colors"
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
                  autoComplete="current-password"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-content-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border-strong text-brand-indigo focus:ring-brand-indigo focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
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
                Sign In to Account
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link to Register */}
        <div className="text-center text-xs sm:text-sm text-content-secondary">
          <span>Need a student account? </span>
          <Link
            to="/register"
            className="font-semibold text-brand-indigo hover:text-brand-deep transition-colors"
          >
            Register student profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
