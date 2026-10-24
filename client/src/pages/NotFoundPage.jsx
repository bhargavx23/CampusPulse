import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { PageContainer, Button } from '../components/ui';

export function NotFoundPage() {
  return (
    <PageContainer size="sm" className="flex-1 flex items-center justify-center py-16 sm:py-24">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        {/* 404 Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-primary-600 shadow-soft">
          <Compass className="w-8 h-8" strokeWidth={2} aria-hidden="true" />
        </div>

        {/* Space Grotesk 404 numerical tag */}
        <div className="font-display text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-sora text-xl sm:text-2xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="font-sans text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page you requested could not be located on CampusPulse. It may have moved or the route is not configured in this phase.
          </p>
        </div>

        {/* Action button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Return to Overview
            </Button>
          </Link>
          <Link to="/design-system">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              View Design System
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default NotFoundPage;
