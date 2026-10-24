import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Reusable Select dropdown component adhering to Master Design System tokens.
 */
export const Select = React.forwardRef(({
  id,
  name,
  label,
  options = [],
  placeholder = 'Select an option',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const generatedId = React.useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const hasError = Boolean(error);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-[#172033] tracking-wide select-none flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[#E11D48] ml-1" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          className={`
            w-full appearance-none rounded-xl border bg-white text-sm text-[#172033]
            transition-all duration-150 ease-out
            h-10 pl-3.5 pr-10 cursor-pointer
            ${
              hasError
                ? 'border-[#E11D48] text-[#172033] focus:border-[#E11D48] focus:ring-4 focus:ring-[#E11D48]/10'
                : 'border-[#E5E9F2] focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 hover:border-[#D5DCE8]'
            }
            disabled:bg-[#F1F4FA] disabled:text-[#8993A5] disabled:border-[#E5E9F2] disabled:cursor-not-allowed
            focus:outline-none
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-[#8993A5]">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const isObj = typeof opt === 'object' && opt !== null;
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 flex items-center pointer-events-none text-[#8993A5]">
          {hasError ? (
            <AlertCircle className="w-4 h-4 text-[#E11D48]" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#8993A5]" aria-hidden="true" />
          )}
        </div>
      </div>

      {hasError ? (
        <p id={errorId} className="text-xs text-[#E11D48] font-medium flex items-center gap-1 mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[#596579] mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
