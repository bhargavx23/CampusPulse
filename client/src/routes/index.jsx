import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AuthGuard from '../components/student/AuthGuard';
import StudentLayout from '../components/student/StudentLayout';

// Administrator Components
import AdminGuard from '../components/admin/AdminGuard';
import AdminLayout from '../components/admin/AdminLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import DesignSystemPage from '../pages/DesignSystemPage';
import ArchitecturePage from '../pages/ArchitecturePage';
import NotFoundPage from '../pages/NotFoundPage';

// Student Workspace Pages
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentComplaintsPage from '../pages/student/StudentComplaintsPage';
import SubmitComplaintPage from '../pages/student/SubmitComplaintPage';
import ComplaintDetailsPage from '../pages/student/ComplaintDetailsPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import StudentNotificationsPage from '../pages/student/StudentNotificationsPage';

// Administrator Workspace Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminComplaintsPage from '../pages/admin/AdminComplaintsPage';
import AdminStudentsPage from '../pages/admin/AdminStudentsPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages wrapped in Public AppLayout (Navbar + Footer) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Preserved system routes */}
        <Route path="/foundation" element={<HomePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
      </Route>

      {/* Protected Student Workspace */}
      <Route element={<AuthGuard />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="complaints" element={<StudentComplaintsPage />} />
          <Route path="complaints/new" element={<SubmitComplaintPage />} />
          <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="notifications" element={<StudentNotificationsPage />} />
        </Route>
      </Route>

      {/* Protected Administrator Workspace */}
      <Route element={<AdminGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="complaints" element={<AdminComplaintsPage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Route>

      {/* 404 Not Found Catch-All */}
      <Route element={<AppLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
