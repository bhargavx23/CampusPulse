import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Layers,
  RefreshCw,
  BarChart3,
  Filter,
  CheckCircle2,
  ArrowRight,
  Shield,
  GraduationCap,
  Activity,
  Search,
  AlertCircle,
  Building2,
  Zap,
  Droplets
} from 'lucide-react';
import { Button, Card, CardContent, Badge } from '../components/ui';

export function LandingPage() {
  return (
    <div className="w-full flex flex-col">
      {/* ========================================================= */}
      {/* SECTION B: HERO SECTION                                   */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 bg-page border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-primary-600" aria-hidden="true" strokeWidth={2.5} />
              <span>Smart Campus Issue Management</span>
            </div>

            {/* Main Headline in Space Grotesk */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15]">
              Campus Issues. <br className="hidden sm:inline" />
              <span className="text-primary-600">Clear Solutions.</span>
            </h1>

            {/* Supporting Subtitle in DM Sans */}
            <p className="font-sans text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Report campus problems, track progress, and stay informed as your institution works toward resolving them.
            </p>

            {/* Call To Action Button Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-7 shadow-sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-7"
                >
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          {/* Product Preview — Example Complaint Tracking Interface */}
          <div className="mt-14 sm:mt-18 lg:mt-20 max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-2 sm:p-3 bg-white border border-slate-200 shadow-card">
              {/* Illustrative Notice Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100 rounded-t-xl text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[11px] text-slate-600 font-medium">campuspulse.internal/portal/tracking</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Interactive Grievance Resolution Workflow Preview</span>
                </div>
              </div>

              {/* Mockup Dashboard Body */}
              <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50/40 rounded-b-xl">
                {/* Search & Filter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center font-bold text-xs">
                      CP
                    </div>
                    <div>
                      <h3 className="font-manrope text-sm sm:text-base font-semibold text-slate-900">
                        Campus Grievance Log
                      </h3>
                      <p className="text-xs text-slate-500">
                        Academic Year 2026–2027 · Central Campus District
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      All Categories
                    </span>
                    <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg">
                      3 Active Records
                    </span>
                  </div>
                </div>

                {/* Demonstrative Issue Rows */}
                <div className="space-y-3">
                  {/* Row 1 */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0 mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-slate-400">#CP-1024</span>
                          <h4 className="font-manrope text-sm font-semibold text-slate-900">
                            Power Failure in Computer Lab 3 (North Wing)
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-sans">
                          Reported by Electrical Dept · Block B, 2nd Floor · Submitted 45 mins ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                      <Badge variant="in-progress" showDot>
                        In Progress
                      </Badge>
                      <span className="text-xs font-medium text-slate-400 hidden sm:inline">Assigned: Tech Team A</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-slate-400">#CP-1025</span>
                          <h4 className="font-manrope text-sm font-semibold text-slate-900">
                            Water Pressure Drop in Hostel Wing C Washrooms
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-sans">
                          Reported by Student Resident · Hostel 4 · Submitted 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                      <Badge variant="pending" showDot>
                        Pending Review
                      </Badge>
                      <span className="text-xs font-medium text-slate-400 hidden sm:inline">Priority: Normal</span>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-slate-400">#CP-1021</span>
                          <h4 className="font-manrope text-sm font-semibold text-slate-900">
                            Broken Projector Screen Replacement
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-sans">
                          Reported by Dept Coordinator · Lecture Hall 102 · Resolved yesterday
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                      <Badge variant="resolved" showDot>
                        Resolved
                      </Badge>
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] hidden sm:inline">Verified by Admin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C: FEATURES                                       */}
      {/* ========================================================= */}
      <section id="features" className="py-16 sm:py-24 bg-white border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Engineered for Campus Accountability
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-500 leading-relaxed">
              Everything students and campus administration need to report, route, resolve, and audit institutional grievances in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <Card hoverEffect>
              <CardContent className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center border border-blue-100">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-manrope text-base sm:text-lg font-semibold text-slate-900">
                  1. Easy Complaint Reporting
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Students can submit campus issues with structured descriptions, location markers, and relevant department categories.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card hoverEffect>
              <CardContent className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-manrope text-base sm:text-lg font-semibold text-slate-900">
                  2. Complaint Tracking
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Students can view the real-time status of their submitted complaints from initial logging to on-site resolution.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card hoverEffect>
              <CardContent className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                  <Layers className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-manrope text-base sm:text-lg font-semibold text-slate-900">
                  3. Centralized Management
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Administrators can review, assign, and manage reported issues across hostels, labs, and facilities from one central portal.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card hoverEffect>
              <CardContent className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <RefreshCw className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-manrope text-base sm:text-lg font-semibold text-slate-900">
                  4. Status Updates
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Complaints move transparently through appropriate workflow stages: Pending Review, In Progress, Resolved, or Closed.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card hoverEffect>
              <CardContent className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <BarChart3 className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-manrope text-base sm:text-lg font-semibold text-slate-900">
                  5. Dashboard Overview
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Administrators can review complaint statistics, resolution bottlenecks, and outstanding institutional tickets at a glance.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card hoverEffect>
              <CardContent className="space-y-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Filter className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-manrope text-base sm:text-lg font-semibold text-slate-900">
                  6. Organized Records
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Complaint records can be filtered by department, building, priority, and date range for efficient institutional oversight.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION D: HOW IT WORKS                                   */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-page border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Workflow Lifecycle
            </span>
            <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              How CampusPulse Works
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-500 leading-relaxed">
              A frictionless three-step process designed to eliminate red tape and expedite physical resolutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-bold text-primary-600">
                    01
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-manrope text-lg font-semibold text-slate-900">
                  Report an Issue
                </h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed">
                  Students describe the campus problem, select the appropriate category (hostel, lab, power, sanitation), and submit a ticket.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-400">
                Action: Student Submission
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-bold text-primary-600">
                    02
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-manrope text-lg font-semibold text-slate-900">
                  Review and Track
                </h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed">
                  Campus administrators review incoming tickets and dispatch technicians, while students follow the status in real time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-400">
                Action: Dispatch & Tracking
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-bold text-primary-600">
                    03
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-manrope text-lg font-semibold text-slate-900">
                  Resolve and Update
                </h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed">
                  Administrators mark the complaint as resolved with completion remarks, creating an auditable track record for campus authorities.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-400">
                Action: Verification & Closure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION E: USER ROLES                                     */}
      {/* ========================================================= */}
      <section id="roles" className="py-16 sm:py-24 bg-white border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Role Separation
            </span>
            <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Designed for Students & Campus Administrators
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-500 leading-relaxed">
              Clear permissions tailored specifically for institutional transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Role */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-8 shadow-soft flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-primary-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-sora text-xl font-bold text-slate-900">
                  Student Portal
                </h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed">
                  Empowering enrolled students with direct, transparent reporting without bureaucratic barriers.
                </p>

                <ul className="space-y-3 pt-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span><strong>Submit complaints:</strong> Report hostel, classroom, and utility issues promptly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span><strong>Review submitted complaints:</strong> Access historical records and logs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span><strong>Track status updates:</strong> Monitor resolution progress from submitted to verified.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200/80">
                <Link to="/register">
                  <Button variant="outline" size="sm" className="w-full bg-white">
                    Sign Up as Student
                  </Button>
                </Link>
              </div>
            </div>

            {/* Administrator Role */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-8 shadow-soft flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-sora text-xl font-bold text-slate-900">
                  Administrator Console
                </h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed">
                  Giving campus authorities and department heads complete operational control over complaints.
                </p>

                <ul className="space-y-3 pt-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Review incoming complaints:</strong> Triage and inspect complaints by department.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Manage complaint status:</strong> Transition tickets through active operational stages.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Monitor complaint activity:</strong> Analyze department resolution metrics and trends.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200/80">
                <Link to="/login">
                  <Button variant="primary" size="sm" className="w-full">
                    Admin Portal Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION F: CALL TO ACTION                                 */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto shadow-card space-y-6">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Get Started Today
            </span>

            <h2 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              Make Campus Problem Reporting Simpler.
            </h2>

            <p className="font-sans text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Bring campus issue reporting and tracking into one organized place. Create your account to start improving your campus today.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8"
                >
                  Sign In to Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
