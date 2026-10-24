import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Reusable Application Layout Shell providing consistent page header, main content wrapper, and footer.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-page text-mainText selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1 w-full flex flex-col focus:outline-none" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
