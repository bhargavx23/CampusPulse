import React from 'react';

/**
 * Reusable PageHeading component establishing clear page hierarchy and action placement.
 *
 * @param {string} title - Main page title (rendered in Sora)
 * @param {string} description - Subtitle / description (rendered in DM Sans)
 * @param {string | React.ReactNode} badge - Optional eyebrow badge or category pill
 * @param {React.ReactNode} actions - Optional right-aligned actions (e.g., buttons, tabs)
 */
export function PageHeading({
  title,
  description,
  badge,
  actions,
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-4 pb-6 border-b border-slate-200/80 mb-8
        ${className}
      `}
      {...props}
    >
      <div className="space-y-1.5 max-w-2xl">
        {badge && (
          <div className="inline-block mb-1">
            {typeof badge === 'string' ? (
              <span className="text-xs font-semibold tracking-wider uppercase text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                {badge}
              </span>
            ) : (
              badge
            )}
          </div>
        )}

        <h1 className="font-sora text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="font-sans text-sm sm:text-base text-slate-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeading;
