import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable text input field with accessible labeling and Master Design System tokens.
 */
export const Input = React.forwardRef(({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  rightElement,
  className = '',
  ...props
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = Boolean(error);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#202B33] tracking-wide select-none flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[#E11D48] ml-1" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#87939A]">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          className={`
            w-full rounded-xl border bg-white text-sm text-[#202B33] placeholder:text-[#87939A]
            transition-all duration-150 ease-out
            h-10 px-3.5
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || rightElement || hasError ? 'pr-11' : ''}
            ${
              hasError
                ? 'border-[#E11D48] text-[#202B33] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10'
                : 'border-[#E3E8E6] focus:border-[#48677A] focus:ring-4 focus:ring-[#48677A]/10 hover:border-[#D2DAD6]'
            }
            disabled:bg-[#EEF1EF] disabled:text-[#87939A] disabled:border-[#E3E8E6] disabled:cursor-not-allowed
            focus:outline-none
          `}
          {...props}
        />

        {hasError ? (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#E11D48]">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
          </div>
        ) : rightElement ? (
          <div className="absolute right-2.5 flex items-center">
            {rightElement}
          </div>
        ) : (
          rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-[#87939A]">
              {rightIcon}
            </div>
          )
        )}
      </div>

      {hasError ? (
        <p id={errorId} className="text-xs text-[#E11D48] font-medium flex items-center gap-1 mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[#5D6B73] mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
