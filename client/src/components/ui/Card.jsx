import React from 'react';

/**
 * Reusable Card component adhering to Master Design System tokens & tactile hover motion.
 */
export function Card({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) {
  return (
    <div
      className={`
        bg-white/95 rounded-[20px] border border-[#E5E9E6] shadow-soft
        transition-all duration-300 ease-out
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-elevated hover:border-[#CFD9D5]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={`px-6 py-5 border-b border-[#E3E8E6] flex items-start justify-between gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) {
  return (
    <Component
      className={`font-manrope text-base sm:text-lg font-semibold text-[#202B33] tracking-tight leading-snug ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className = '',
  ...props
}) {
  return (
    <p
      className={`text-xs sm:text-sm text-[#5D6B73] font-sans mt-1 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={`px-6 py-4 bg-[#F6F7F5] rounded-b-2xl border-t border-[#E3E8E6] flex items-center justify-between text-xs sm:text-sm text-[#5D6B73] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
