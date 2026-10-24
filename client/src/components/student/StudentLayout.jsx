import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';

export function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-workspace-mist text-workspace-textPrimary selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar (Desktop persistent + Mobile drawer) */}
      <StudentSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in" id="student-main">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
