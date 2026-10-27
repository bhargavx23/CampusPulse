import React from 'react';
import { AlertTriangle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Reusable ErrorMessage / Alert component for inline errors and system notifications.
 *
 * @param {'error' | 'warning' | 'info'} severity - Alert severity level
 * @param {string} title - Optional title
 * @param {string | React.ReactNode} message - Error details or message
 * @param {Function} onDismiss - Optional dismiss callback
 * @param {React.ReactNode} action - Optional action button (e.g. Retry)
 */
export function ErrorMessage({
  severity = 'error',
  title,
  message,
  onDismiss,
  action,
  className = '',
  ...props
}) {
  const styles = {
    error: {
      container: 'bg-red-50/70 border-red-200 text-red-900',
      icon: <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />,
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
    },
    warning: {
      container: 'bg-amber-50/70 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />,
      titleColor: 'text-amber-900',
      textColor: 'text-amber-700',
    },
    info: {
      container: 'bg-primary-50/70 border-primary-200 text-primary-900',
      icon: <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" aria-hidden="true" />,
      titleColor: 'text-primary-900',
      textColor: 'text-primary-700',
    },
  };

  const current = styles[severity] || styles.error;

  return (
    <div
      role="alert"
      className={`
        w-full p-4 rounded-xl border flex items-start gap-3
        transition-all font-sans
        ${current.container}
        ${className}
      `}
      {...props}
    >
      {current.icon}

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`text-sm font-semibold mb-0.5 ${current.titleColor}`}>
            {title}
          </h4>
        )}
        <div className={`text-xs sm:text-sm leading-relaxed ${current.textColor}`}>
          {message}
        </div>

        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
