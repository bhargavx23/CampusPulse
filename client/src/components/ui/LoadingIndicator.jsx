import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading spinner indicator with accessible ARIA live attributes.
 *
 * @param {'sm' | 'md' | 'lg'} size - Indicator size
 * @param {string} label - Optional text label
 * @param {boolean} centered - Whether to center the loader in a padded container
 */
export function LoadingIndicator({
  size = 'md',
  label,
  centered = false,
  className = '',
  ...props
}) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const content = (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2.5 text-primary-600 font-sans ${className}`}
      {...props}
    >
      <Loader2
        className={`animate-spin ${sizeMap[size] || sizeMap.md} shrink-0`}
        aria-hidden="true"
      />
      {label ? (
        <span className="text-xs sm:text-sm font-medium text-slate-600">
          {label}
        </span>
      ) : (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Skeleton placeholder for loading state UI elements.
 */
export function Skeleton({ className = '', ...props }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
      {...props}
    />
  );
}

export default LoadingIndicator;
