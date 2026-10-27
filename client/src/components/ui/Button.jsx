import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with Master Design System tokens & tactile motion.
 *
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'navy'} variant - Visual style variant
 * @param {'sm' | 'md' | 'lg'} size - Button size
 * @param {boolean} isLoading - Loading state with spinner
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} leftIcon - Optional icon preceding label
 * @param {React.ReactNode} rightIcon - Optional icon following label
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium font-sans rounded-xl transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none active:scale-[0.985]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
  };

  const variantStyles = {
    primary: 'bg-[#48677A] text-white hover:bg-[#365363] active:bg-[#2F4855] shadow-soft focus-visible:ring-[#6D8998] disabled:bg-[#E3E8E6] disabled:text-[#87939A] disabled:shadow-none',
    secondary: 'bg-[#EEF1EF] text-[#202B33] hover:bg-[#E3E8E6] active:bg-[#D2DAD6] focus-visible:ring-[#48677A] disabled:bg-[#EEF1EF] disabled:text-[#87939A]',
    outline: 'border border-[#E3E8E6] bg-white text-[#202B33] hover:bg-[#F6F7F5] hover:border-[#D2DAD6] active:bg-[#EEF1EF] focus-visible:ring-[#48677A] disabled:bg-white disabled:border-[#E3E8E6] disabled:text-[#87939A] shadow-soft',
    ghost: 'bg-transparent text-[#5D6B73] hover:bg-[#EEF1EF] hover:text-[#202B33] active:bg-[#E3E8E6] focus-visible:ring-[#48677A] disabled:text-[#87939A]',
    danger: 'bg-[#E11D48] text-white hover:bg-[#BE123C] active:bg-[#9F1239] shadow-soft focus-visible:ring-[#E11D48] disabled:bg-[#FECDD3] disabled:text-white',
    navy: 'bg-[#203540] text-white hover:bg-[#1E293B] active:bg-[#0F172A] shadow-soft focus-visible:ring-[#203540] disabled:bg-[#E3E8E6] disabled:text-[#87939A]',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${isDisabled ? 'opacity-60' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
