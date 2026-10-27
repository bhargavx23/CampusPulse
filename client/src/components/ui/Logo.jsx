import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Professional CampusPulse Brand Logo Component
 * Combines an institutional campus emblem with the clean CampusPulse wordmark.
 * Consistent across navbar, authentication screens, dashboards, and footer.
 */
export function CampusEmblem({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Base container badge: Midnight Navy */}
      <rect width="36" height="36" rx="10" fill="#203540" />

      {/* Institutional Pediment (Roof triangle) */}
      <path
        d="M18 7.5L8.5 13H27.5L18 7.5Z"
        fill="#FFFFFF"
      />

      {/* Entablature beam */}
      <rect x="9.5" y="14" width="17" height="1.5" rx="0.5" fill="#FFFFFF" />

      {/* Classical Campus Columns (4 Pillars) */}
      <rect x="10.5" y="16.5" width="2" height="6.5" rx="0.5" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="15" y="16.5" width="2" height="6.5" rx="0.5" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="19" y="16.5" width="2" height="6.5" rx="0.5" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="23.5" y="16.5" width="2" height="6.5" rx="0.5" fill="#FFFFFF" fillOpacity="0.9" />

      {/* Podium base */}
      <rect x="8.5" y="24" width="19" height="1.8" rx="0.5" fill="#FFFFFF" />

      {/* Vital Pulse Accent (Royal Indigo / Bright Indigo dynamic line) */}
      <path
        d="M7 28H14.5L16.2 25.5L18 29.5L19.8 26.5L21.2 28H29"
        stroke="#5B7D90"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  to = '/',
  size = 'md',
  showSubtitle = false,
  subtitle = 'Issue Management',
  collapsed = false,
  isLight = false,
  className = '',
  onClick,
}) {
  // Size presets
  const sizeMap = {
    sm: { emblem: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { emblem: 34, text: 'text-lg', sub: 'text-[10px]' },
    lg: { emblem: 42, text: 'text-2xl', sub: 'text-xs' },
    xl: { emblem: 48, text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <CampusEmblem size={currentSize.emblem} className="transition-transform duration-150 group-hover:scale-105" />

      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-bold ${currentSize.text} tracking-tight ${isLight ? 'text-white' : 'text-[#202B33]'}`}>
            Campus<span className="text-[#48677A]">Pulse</span>
          </span>
          {showSubtitle && (
            <span className={`font-sans font-semibold tracking-wider uppercase mt-1 ${currentSize.sub} ${isLight ? 'text-slate-300' : 'text-[#87939A]'}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#48677A] rounded-xl p-0.5 inline-block"
        aria-label="CampusPulse Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
