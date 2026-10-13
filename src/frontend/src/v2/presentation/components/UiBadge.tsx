import React from 'react';

export interface UiBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const UiBadge: React.FC<UiBadgeProps> = ({
  children,
  variant = 'info',
  className = '',
}) => {
  return (
    <span className={`ui-badge ui-badge-${variant} ${className}`}>
      {children}
    </span>
  );
};
