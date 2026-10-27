import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Palette, 
  Type, 
  ShieldCheck,
  LayoutTemplate
} from 'lucide-react';
import { PageContainer, PageHeading, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '../components/ui';

export function HomePage() {
  return (
    <PageContainer>
      {/* Page Heading */}
      <PageHeading
        badge="Phase 1 Foundation"
        title="CampusPulse Project Foundation & Design System"
        description="A modern, high-precision frontend architecture engineered for campus issue management. Built with React, Vite, Tailwind CSS, and a specialized 4-tier typography system."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/design-system">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Components
              </Button>
            </Link>
          </div>
        }
      />

      {/* Core Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card hoverEffect>
          <CardContent className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
              <Palette className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-manrope text-lg font-semibold text-slate-900">
              Refined Color System
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Strictly light, professional, and accessible. Built with steel blue (#48677A) accents, soft neutral backgrounds (#F6F7F5), and subtle borders (#E3E8E6).
            </p>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
              <Type className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-manrope text-lg font-semibold text-slate-900">
              4-Font Typography Scale
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              A harmonic font stack featuring Space Grotesk for highlights, Sora for prominent titles, Manrope for section headings, and DM Sans for body clarity.
            </p>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <LayoutTemplate className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-manrope text-lg font-semibold text-slate-900">
              Reusable UI Toolkit
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Ten battle-tested, accessible building blocks including Buttons, Inputs, Selects, Cards, Status Badges, and Alert states ready for future phases.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technical Specifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Foundation Status */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Phase 1 Implementation Deliverables</CardTitle>
              <CardDescription>Verified foundation components active in current build</CardDescription>
            </div>
            <Badge variant="resolved" showDot>
              Complete
            </Badge>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { title: 'Project Structure & Tooling', desc: 'Vite 6, React 18, React Router v6, Tailwind CSS' },
                { title: 'Typography System', desc: 'Google Fonts: Space Grotesk, Sora, Manrope, DM Sans with fallbacks' },
                { title: 'Design Tokens & Light Palette', desc: 'Steel blue #48677A, soft neutral surfaces, crisp borders' },
                { title: '10 Core Reusable UI Components', desc: 'Button, Input, Select, Card, Badge, PageContainer, Loader, EmptyState, ErrorMessage, PageHeading' },
                { title: 'Application Shell & Responsive Nav', desc: 'Header, brand icon, mobile toggle, semantic layout, StackMitra footer' },
                { title: 'Independent Backend Scaffolding', desc: 'Directory structure prepared for future Node/Express/MongoDB' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-slate-800">{item.title}: </span>
                    <span className="text-slate-500">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Phase Roadmap Overview */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>System Architecture & Roadmap</CardTitle>
              <CardDescription>Multi-phase planning for CampusPulse lifecycle</CardDescription>
            </div>
            <Badge variant="in-progress" showDot>
              Phased
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-xl border border-primary-100 bg-primary-50/50 flex items-start gap-3">
              <span className="font-display font-bold text-lg text-primary-700 shrink-0">
                01
              </span>
              <div>
                <h4 className="font-manrope font-semibold text-sm text-slate-900">
                  Phase 1: Project Foundation & Design System (Current)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Design tokens, layout shell, typography system, component primitives, and client routing.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
              <span className="font-display font-bold text-lg text-slate-400 shrink-0">
                02
              </span>
              <div>
                <h4 className="font-manrope font-semibold text-sm text-slate-700">
                  Phase 2: Authentication & Student Dashboard (Upcoming)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Student registration, complaint submission flow, tracking views, and category classifications.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
              <span className="font-display font-bold text-lg text-slate-400 shrink-0">
                03
              </span>
              <div>
                <h4 className="font-manrope font-semibold text-sm text-slate-700">
                  Phase 3: Administrator Console & Resolutions (Future)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Status dispatch, department routing, escalation management, and audit resolution timeline.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Direct Quick Links Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-sora text-lg sm:text-xl font-bold text-slate-900">
            Inspect the Interactive Component Library
          </h3>
          <p className="text-sm text-slate-500 font-sans">
            Verify button variants, inputs with validation states, badges, empty states, and cards.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/design-system">
            <Button variant="primary" leftIcon={<Layers className="w-4 h-4" />}>
              Open Component Gallery
            </Button>
          </Link>
          <Link to="/architecture">
            <Button variant="outline" leftIcon={<Layers className="w-4 h-4" />}>
              Directory Structure
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default HomePage;
