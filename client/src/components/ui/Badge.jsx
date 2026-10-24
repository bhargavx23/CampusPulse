import React from 'react';

/**
 * Status Badge component with Master Design System tokens.
 *
 * @param {'pending' | 'in-progress' | 'resolved' | 'rejected' | 'urgent' | 'neutral' | 'info'} variant - Status style variant
 * @param {'sm' | 'md'} size - Size variant
 * @param {boolean} showDot - Shows status pulse/dot indicator
 */
export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  className = '',
  ...props
}) {
  const variantStyles = {
    pending: {
      badge: 'bg-[#FFF4DB] text-[#D97706] border-[#FDE68A]',
      dot: 'bg-[#D97706]',
    },
    'in-progress': {
      badge: 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]',
      dot: 'bg-[#4F46E5]',
    },
    resolved: {
      badge: 'bg-[#E6F7F3] text-[#0F9D8A] border-[#A7F3D0]',
      dot: 'bg-[#0F9D8A]',
    },
    rejected: {
      badge: 'bg-[#FFF0F3] text-[#E11D48] border-[#FECDD3]',
      dot: 'bg-[#E11D48]',
    },
    urgent: {
      badge: 'bg-[#FFF0F3] text-[#E11D48] border-[#FECDD3] font-bold',
      dot: 'bg-[#E11D48]',
    },
    neutral: {
      badge: 'bg-[#F1F4FA] text-[#596579] border-[#E5E9F2]',
      dot: 'bg-[#8993A5]',
    },
    info: {
      badge: 'bg-[#EAF2FF] text-[#3B82F6] border-[#BFDBFE]',
      dot: 'bg-[#3B82F6]',
    },
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
  };

  const selectedVariant = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`
        inline-flex items-center rounded-full border
        tracking-wide transition-colors
        ${sizeStyles[size] || sizeStyles.md}
        ${selectedVariant.badge}
        ${className}
      `}
      {...props}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedVariant.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
