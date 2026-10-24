import React from 'react';

/**
 * Reusable PageContainer ensuring consistent layout width, padding, and responsive bounds.
 *
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'full'} size - Max width constraint
 */
export function PageContainer({
  children,
  size = 'lg',
  className = '',
  ...props
}) {
  const sizeMap = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`
        w-full mx-auto px-4 sm:px-6 lg:px-8
        py-6 sm:py-8 lg:py-10
        ${sizeMap[size] || sizeMap.lg}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default PageContainer;
