import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState component for views with no data or pending future items.
 *
 * @param {React.ReactNode} icon - Optional custom icon
 * @param {string} title - Main heading
 * @param {string} description - Explanatory message
 * @param {React.ReactNode} action - Optional action button or link
 */
export function EmptyState({
  icon,
  title = 'No items found',
  description = 'There are no items to display at this moment.',
  action,
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        w-full p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200
        bg-slate-50/50 flex flex-col items-center justify-center
        ${className}
      `}
      {...props}
    >
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-400 mb-4">
        {icon || <Inbox className="w-6 h-6 text-slate-400" aria-hidden="true" />}
      </div>

      <h3 className="font-manrope text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="font-sans text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="inline-flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
