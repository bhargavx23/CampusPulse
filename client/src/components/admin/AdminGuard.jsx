import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

/**
 * AdminGuard enforces strict role-based access control.
 * Only authenticated users with role === 'admin' are permitted into the /admin workspace.
 * Students attempting to access administrator paths are securely redirected to /student/dashboard.
 */
export function AdminGuard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F4F0]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#48677A] border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-[#5D6B73]">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    // Non-admin user attempting to access admin route
    return <Navigate to="/student/dashboard" replace state={{ unauthorizedAdminAttempt: true }} />;
  }

  return <Outlet />;
}

export default AdminGuard;
