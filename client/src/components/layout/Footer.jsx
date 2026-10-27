import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-[#E3E8E6] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Purpose */}
          <div className="space-y-3.5 md:col-span-2">
            <Logo size="md" />
            <p className="font-sans text-xs sm:text-sm text-[#5D6B73] max-w-md leading-relaxed">
              Smart Campus Issue Management. An intuitive platform engineered for seamless student problem reporting and administrative resolution tracking.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F7F3] text-[#0F9D8A] border border-[#A7F3D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D8A]" aria-hidden="true" />
                Operational System Active
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="font-manrope text-xs font-bold text-[#202B33] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-sans">
              <li>
                <Link to="/" className="text-[#5D6B73] hover:text-[#48677A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-[#5D6B73] hover:text-[#48677A] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-[#5D6B73] hover:text-[#48677A] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#roles" className="text-[#5D6B73] hover:text-[#48677A] transition-colors">
                  User Roles
                </a>
              </li>
            </ul>
          </div>

          {/* Account & Access */}
          <div className="space-y-3">
            <h4 className="font-manrope text-xs font-bold text-[#202B33] uppercase tracking-wider">
              Account & Access
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-sans">
              <li>
                <Link to="/login" className="text-[#5D6B73] hover:text-[#48677A] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-[#5D6B73] hover:text-[#48677A] transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="text-[#5D6B73] hover:text-[#48677A] transition-colors">
                  Password Assistance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* StackMitra Parent Attribution & Copyright */}
        <div className="mt-10 pt-6 border-t border-[#E3E8E6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#87939A]">
          <p>© {currentYear} CampusPulse. All rights reserved.</p>

          <div className="flex items-center gap-1.5 text-[#5D6B73]">
            <span>By</span>
            <span className="font-semibold text-[#202B33]">StackMitra</span>
            <span className="text-[#D2DAD6]">|</span>
            <span className="italic text-[#5D6B73]">Projects Made Simple.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
