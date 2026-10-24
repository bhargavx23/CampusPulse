import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, Logo } from '../components/ui';

export function ResetPasswordPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the secure OTP-based password recovery flow
    const timer = setTimeout(() => {
      navigate('/forgot-password', { replace: true });
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-main">
      <div className="w-full max-w-md space-y-6 text-center animate-fade-in-up">
        <Logo size="lg" />

        <Card className="shadow-card border-border bg-surface-card">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-soft text-brand-indigo border border-brand-indigo/20 flex items-center justify-center mx-auto shadow-soft">
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-content-primary">
                OTP Password Recovery
              </h2>
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                CampusPulse uses direct 6-digit email OTP verification for password resets. Redirecting you to the recovery portal...
              </p>
            </div>

            <div className="pt-2">
              <Link to="/forgot-password" replace>
                <Button variant="primary" size="md" className="w-full shadow-soft" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to OTP Recovery
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
