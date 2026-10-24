import React from 'react';
import { 
  FolderTree, 
  Server, 
  Layers, 
  Database, 
  Terminal, 
  CheckCircle2, 
  Code2, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { 
  PageContainer, 
  PageHeading, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge 
} from '../components/ui';

export function ArchitecturePage() {
  return (
    <PageContainer>
      <PageHeading
        badge="System Architecture"
        title="Project Structure & Future Roadmap"
        description="Comprehensive technical overview of Phase 1 workspace layout and decoupled backend preparation for upcoming phases."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Frontend Architecture Tree */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-primary-600 rounded-xl">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Frontend Directory Structure</CardTitle>
                <CardDescription>Implemented in Phase 1 (React + Vite + Tailwind)</CardDescription>
              </div>
            </div>
            <Badge variant="resolved">Active</Badge>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
{`src/
├── assets/          # Static brand graphics & icons
├── components/
│   ├── layout/      # AppLayout, Navbar, Footer
│   └── ui/          # 10 Reusable Design System Components
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Card.jsx
│       ├── Badge.jsx
│       ├── PageContainer.jsx
│       ├── LoadingIndicator.jsx
│       ├── EmptyState.jsx
│       ├── ErrorMessage.jsx
│       └── PageHeading.jsx
├── pages/           # HomePage, DesignSystemPage, ArchitecturePage, NotFoundPage
├── routes/          # Centralized route definitions
├── styles/          # globals.css with 4-tier font variables
├── utils/           # Helper utilities and formatters
├── App.jsx          # Route provider setup
└── main.jsx         # React DOM mount point`}
            </pre>
          </CardContent>
        </Card>

        {/* Prepared Backend Scaffolding */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Future Backend Scaffolding</CardTitle>
                <CardDescription>Prepared directory for Phase 2+ (Node.js + Express + Mongo)</CardDescription>
              </div>
            </div>
            <Badge variant="pending">Prepared</Badge>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
{`server/
├── src/
│   ├── config/      # Database & JWT configurations
│   ├── controllers/ # Complaint, Auth, and Admin handlers
│   ├── middleware/  # Auth guard, error handler, validation
│   ├── models/      # Mongoose schemas (User, Complaint)
│   ├── routes/      # Express API route endpoints
│   ├── utils/       # Token helpers, response formatters
│   ├── app.js       # Express application configuration
│   └── server.js    # HTTP listener entrypoint
├── .env.example     # Environment template
└── package.json     # Decoupled backend dependencies`}
            </pre>
            <p className="text-xs text-slate-500 mt-3 font-sans leading-relaxed">
              * Note: Backend APIs and MongoDB connections remain deliberately uninstantiated during Phase 1 in strict compliance with the scope rules.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tech Stack Summary */}
      <Card className="mb-10">
        <CardHeader>
          <div>
            <CardTitle>Technology Standards & Quality Assurances</CardTitle>
            <CardDescription>Core libraries and strict visual constraints enforced in Phase 1</CardDescription>
          </div>
          <Badge variant="info">Standard</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-manrope font-semibold text-sm">
                <Cpu className="w-4 h-4 text-primary-600" />
                Frontend Core
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                React 18.3 with Vite 6.0 fast HMR, standard ECMAScript modules, functional components with hooks, and zero legacy classes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-manrope font-semibold text-sm">
                <Code2 className="w-4 h-4 text-primary-600" />
                Routing & Navigation
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                React Router DOM v6 with nested layout routes, responsive header navigation, mobile drawer toggle, and catch-all 404 handler.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-manrope font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                Strict Visual Restraints
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Light mode only. Zero dark-mode stylesheets, zero glowing neon elements, restrained transitions, and 14px border radii.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default ArchitecturePage;
