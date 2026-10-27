import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  FileText,
  Sliders
} from 'lucide-react';
import {
  PageContainer,
  PageHeading,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Select,
  Badge,
  LoadingIndicator,
  Skeleton,
  EmptyState,
  ErrorMessage,
} from '../components/ui';

export function DesignSystemPage() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputValue, setInputValue] = useState('hostel.maintenance@campus.edu');
  const [hasInputError, setHasInputError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDismissableAlert, setShowDismissableAlert] = useState(true);

  return (
    <PageContainer>
      <PageHeading
        badge="UI Toolkit"
        title="Design System & Component Library"
        description="A comprehensive gallery of all 10 reusable components, design tokens, color swatches, and typography rules established for CampusPulse."
        actions={
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => {
              setBtnLoading(true);
              setTimeout(() => setBtnLoading(false), 1200);
            }}
          >
            {btnLoading ? 'Testing Loader...' : 'Simulate Action'}
          </Button>
        }
      />

      {/* 1. BRAND COLORS & DESIGN TOKENS */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          1. Color Palette Tokens
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Purpose-driven, high-contrast light colors. Blue is applied intentionally for focused actions, alongside clean whites and neutral slate borders.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Primary Steel Blue', hex: '#48677A', bg: 'bg-[#48677A]', text: 'text-white', role: 'Main actions, brand identity' },
            { name: 'Deep Blue Gray', hex: '#365363', bg: 'bg-[#365363]', text: 'text-white', role: 'Header emphasis, deep contrast' },
            { name: 'Page Background', hex: '#F6F7F5', bg: 'bg-[#F6F7F5]', text: 'text-slate-800', border: 'border border-slate-200', role: 'Global application canvas' },
            { name: 'Card Background', hex: '#FFFFFF', bg: 'bg-[#FFFFFF]', text: 'text-slate-800', border: 'border border-slate-200', role: 'Surfaces, modules, containers' },
            { name: 'Main Text', hex: '#202B33', bg: 'bg-[#202B33]', text: 'text-white', role: 'Primary headings & titles' },
            { name: 'Secondary Text', hex: '#5D6B73', bg: 'bg-[#5D6B73]', text: 'text-white', role: 'Subtitles, meta, captions' },
            { name: 'Subtle Border', hex: '#E3E8E6', bg: 'bg-[#E3E8E6]', text: 'text-slate-800', border: 'border border-slate-300', role: 'Dividers and component borders' },
            { name: 'Success Green', hex: '#16A34A', bg: 'bg-[#16A34A]', text: 'text-white', role: 'Resolved complaints & positive alerts' },
            { name: 'Warning Amber', hex: '#D97706', bg: 'bg-[#D97706]', text: 'text-white', role: 'Pending status & advisory banners' },
            { name: 'Error Crimson', hex: '#DC2626', bg: 'bg-[#DC2626]', text: 'text-white', role: 'Input validation errors & alerts' },
          ].map((c) => (
            <div key={c.hex} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-soft">
              <div className={`w-full h-16 rounded-lg ${c.bg} ${c.border || ''} flex items-end p-2 mb-2.5`}>
                <span className={`text-[11px] font-mono font-semibold ${c.text}`}>{c.hex}</span>
              </div>
              <h4 className="font-manrope text-xs font-semibold text-slate-800">{c.name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{c.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. TYPOGRAPHY SYSTEM */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          2. Four-Tier Typography Hierarchy
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Four distinct font families combined harmoniously to give CampusPulse a distinct SaaS identity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="font-display">Space Grotesk</CardTitle>
                <CardDescription>Hero headlines & numerical data highlights</CardDescription>
              </div>
              <Badge variant="info">Display & Numerics</Badge>
            </CardHeader>
            <CardContent className="space-y-3 font-display">
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                99.8% System Uptime
              </div>
              <p className="text-sm text-slate-600">
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle className="font-sora">Sora</CardTitle>
                <CardDescription>Main page titles & major section headings</CardDescription>
              </div>
              <Badge variant="neutral">Page Headings</Badge>
            </CardHeader>
            <CardContent className="space-y-3 font-sora">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                CampusPulse Dashboard Title
              </div>
              <p className="text-sm text-slate-600">
                Designed for bold clarity and high editorial legibility.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle className="font-manrope">Manrope</CardTitle>
                <CardDescription>Dashboard sub-headers, cards, and modal titles</CardDescription>
              </div>
              <Badge variant="neutral">Card Titles</Badge>
            </CardHeader>
            <CardContent className="space-y-3 font-manrope">
              <div className="text-lg font-semibold text-slate-800">
                Electrical Infrastructure Incident #4082
              </div>
              <p className="text-sm text-slate-600">
                Balances compact structural density with clean character stems.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle className="font-sans">DM Sans</CardTitle>
                <CardDescription>Body copy, forms, inputs, tables, and navigation</CardDescription>
              </div>
              <Badge variant="neutral">Body & Forms</Badge>
            </CardHeader>
            <CardContent className="space-y-3 font-sans">
              <div className="text-sm font-medium text-slate-700 leading-relaxed">
                CampusPulse provides students, faculty, and administrative staff with a streamlined conduit to file campus grievances, monitor status updates in real-time, and guarantee accountability.
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                Regular 400 · Medium 500 · SemiBold 600 · Bold 700
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. BUTTONS */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          3. Button Components
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Primary, secondary, outline, ghost, danger, and state variations with keyboard focus rings.
        </p>

        <Card>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-3 tracking-wider">Style Variants</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-3 tracking-wider">With Icons & States</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}>
                  Send Report
                </Button>
                <Button variant="outline" rightIcon={<Search className="w-4 h-4" />}>
                  Search Records
                </Button>
                <Button variant="primary" isLoading={btnLoading}>
                  {btnLoading ? 'Saving...' : 'Interactive Loader'}
                </Button>
                <Button variant="primary" disabled>
                  Disabled Primary
                </Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-3 tracking-wider">Sizes (sm, md, lg)</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small (32px)</Button>
                <Button variant="primary" size="md">Medium (40px)</Button>
                <Button variant="primary" size="lg">Large (48px)</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. FORM INPUTS & SELECTS */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          4. Form Inputs & Select Controls
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Standardized text fields and dropdowns with label integration, error states, and helper hints.
        </p>

        <Card>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Standard Input"
                placeholder="Enter issue headline..."
                helperText="Keep titles concise and specific to the location."
              />

              <Input
                label="Input With Icon & Controlled State"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="name@campus.edu"
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Accessible email address input"
              />

              <div>
                <Input
                  label="Input with Error Validation State"
                  value="Invalid Room #"
                  onChange={() => {}}
                  error={hasInputError ? 'Room number must match campus block format (e.g. B3-204)' : undefined}
                  helperText={!hasInputError ? 'Click button below to toggle validation error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setHasInputError(!hasInputError)}
                  className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
                >
                  {hasInputError ? 'Clear Error State' : 'Simulate Validation Error'}
                </button>
              </div>

              <Input
                label="Disabled Input"
                value="Permanent Student Registration ID"
                disabled
                helperText="This field is locked and read-only."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Select Field (Issue Department)"
                placeholder="Choose campus department..."
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'hostel', label: 'Hostel & Residential Services' },
                  { value: 'electricity', label: 'Electrical & Power Infrastructure' },
                  { value: 'sanitation', label: 'Sanitation & Cleanliness' },
                  { value: 'academic', label: 'Classroom & Academic Labs' },
                  { value: 'cafeteria', label: 'Food & Cafeteria Hygiene' },
                ]}
                helperText="Select the relevant authority for prompt resolution."
              />

              <Select
                label="Disabled Select Field"
                placeholder="Department locked"
                disabled
                options={[{ value: 'none', label: 'Unavailable' }]}
                helperText="Administrative assignment locked."
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 5. STATUS BADGES */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          5. Status Badges
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Purpose-built status variants designed for future complaint lifecycle tracking.
        </p>

        <Card>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-3 tracking-wider">With Status Dots</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="pending" showDot>Pending Review</Badge>
                <Badge variant="in-progress" showDot>In Progress</Badge>
                <Badge variant="resolved" showDot>Resolved</Badge>
                <Badge variant="rejected" showDot>Rejected</Badge>
                <Badge variant="neutral" showDot>Under Assessment</Badge>
                <Badge variant="info" showDot>Escalated to Dean</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-3 tracking-wider">Size Options</h4>
              <div className="flex items-center gap-3">
                <Badge variant="resolved" size="sm">Small Badge</Badge>
                <Badge variant="resolved" size="md">Medium Badge</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. ALERTS & ERROR MESSAGES */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          6. Error Messages & Banner Alerts
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Informative, non-jarring feedback banners with accessible role="alert".
        </p>

        <div className="space-y-4">
          <ErrorMessage
            severity="error"
            title="Validation Error Occurred"
            message="Please provide a valid campus building code and descriptive statement before proceeding."
          />

          <ErrorMessage
            severity="warning"
            title="Scheduled Maintenance Notice"
            message="Campus network infrastructure maintenance is scheduled for Sunday 02:00 AM to 06:00 AM."
          />

          {showDismissableAlert ? (
            <ErrorMessage
              severity="info"
              title="Design System Verification"
              message="This banner includes an interactive dismiss trigger for verification."
              onDismiss={() => setShowDismissableAlert(false)}
            />
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowDismissableAlert(true)}>
              Restore Dismissed Banner
            </Button>
          )}
        </div>
      </section>

      {/* 7. LOADING INDICATORS & SKELETONS */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          7. Loading Indicators & Skeletons
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Accessible loading spinners and placeholder skeleton blocks for data fetching states.
        </p>

        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-8">
              <LoadingIndicator size="sm" label="Small spinner (16px)" />
              <LoadingIndicator size="md" label="Medium spinner (24px)" />
              <LoadingIndicator size="lg" label="Large spinner (32px)" />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs uppercase font-semibold text-slate-400 mb-3 tracking-wider">Skeleton Loading Placeholders</h4>
              <div className="space-y-2.5 max-w-md">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 w-24 rounded-xl" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 8. EMPTY STATE */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          8. Empty State Component
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Clean visual anchor for zero-data states, pending submissions, or empty filter results.
        </p>

        <EmptyState
          icon={<FileText className="w-6 h-6 text-slate-400" />}
          title="No Active Complaints"
          description="Your department queue is completely up to date. Future complaint tickets will be populated here."
          action={
            <Button variant="outline" size="sm">
              Refresh Queue
            </Button>
          }
        />
      </section>

      {/* 9. CARD VARIATIONS */}
      <section className="mb-12">
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          9. Card Containers & Structure
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          14px rounded borders, subtle 1px dividers, and soft shadows adhering to light UI guidelines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hoverEffect>
            <CardHeader>
              <div>
                <CardTitle>Card With Full Header & Footer</CardTitle>
                <CardDescription>Includes title, subtitle, content body, and footer bar</CardDescription>
              </div>
              <Badge variant="resolved" showDot>Active</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                Cards form the primary content surfaces across CampusPulse. They provide consistent padding, distinct contrast without hard dark borders, and smooth hover interactions.
              </p>
            </CardContent>
            <CardFooter>
              <span>Subcomponent: CardFooter</span>
              <Button variant="ghost" size="sm">Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardContent className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-manrope text-base font-semibold text-slate-900">
                Minimal Card (CardContent Only)
              </h3>
              <p className="text-sm text-slate-500 font-sans leading-relaxed">
                A simple surface useful for stats, highlights, and compact feature lists without explicit header/footer dividers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 10. PAGE HEADING SPECIFICATION */}
      <section>
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          10. Page Heading Component
        </h2>
        <p className="text-sm text-slate-500 mb-6 font-sans">
          Standardized header banner with Sora typography, category badges, and responsive action placement.
        </p>

        <div className="p-6 bg-slate-50/60 rounded-2xl border border-slate-200">
          <PageHeading
            className="mb-0 pb-0 border-b-0"
            badge="Example Eyebrow Tag"
            title="Section or Page Title"
            description="Clear supporting description displayed at regular reading width."
            actions={
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="primary" size="sm">Action</Button>
              </div>
            }
          />
        </div>
      </section>
    </PageContainer>
  );
}

export default DesignSystemPage;
