import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LogIn, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Logo } from '../ui';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleNavClick = (hash) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="site-navbar sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-[#E3E8E6]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo Treatment */}
          <Logo size="md" showSubtitle subtitle="Issue Management" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                location.pathname === '/' ? 'text-[#48677A] font-semibold bg-[#EAF1F4]' : 'text-[#5D6B73] hover:text-[#202B33] hover:bg-[#EEF1EF]'
              }`}
            >
              Home
            </Link>
            <button
              type="button"
              onClick={() => handleNavClick('#features')}
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5D6B73] hover:text-[#202B33] hover:bg-[#EEF1EF] transition-all duration-150"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#how-it-works')}
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5D6B73] hover:text-[#202B33] hover:bg-[#EEF1EF] transition-all duration-150"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#roles')}
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5D6B73] hover:text-[#202B33] hover:bg-[#EEF1EF] transition-all duration-150"
            >
              User Roles
            </button>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}>
                <Button
                  variant={user?.role === 'admin' ? 'navy' : 'primary'}
                  size="sm"
                  leftIcon={user?.role === 'admin' ? <Shield className="w-3.5 h-3.5 text-primary-300" /> : <LayoutDashboard className="w-3.5 h-3.5" />}
                >
                  {user?.role === 'admin' ? 'Administrator Console' : 'Student Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant={location.pathname === '/login' ? 'secondary' : 'ghost'}
                    size="sm"
                    leftIcon={<LogIn className="w-3.5 h-3.5" />}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#5D6B73] hover:text-[#202B33] hover:bg-[#EEF1EF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48677A] transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E3E8E6] bg-white px-4 pt-3 pb-5 space-y-2 shadow-modal animate-drawer-in">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                location.pathname === '/' ? 'bg-[#EAF1F4] text-[#48677A] font-semibold' : 'text-[#202B33] hover:bg-[#EEF1EF]'
              }`}
            >
              Home
            </Link>
            <button
              type="button"
              onClick={() => handleNavClick('#features')}
              className="w-full text-left block px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#202B33] hover:bg-[#EEF1EF]"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#how-it-works')}
              className="w-full text-left block px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#202B33] hover:bg-[#EEF1EF]"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#roles')}
              className="w-full text-left block px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#202B33] hover:bg-[#EEF1EF]"
            >
              User Roles
            </button>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="pt-3 border-t border-[#E3E8E6] flex flex-col gap-2">
            {isAuthenticated ? (
              <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button
                  variant={user?.role === 'admin' ? 'navy' : 'primary'}
                  size="md"
                  className="w-full"
                  leftIcon={user?.role === 'admin' ? <Shield className="w-4 h-4 text-primary-300" /> : <LayoutDashboard className="w-4 h-4" />}
                >
                  {user?.role === 'admin' ? 'Administrator Console' : 'Student Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" size="md" className="w-full" leftIcon={<LogIn className="w-4 h-4" />}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
