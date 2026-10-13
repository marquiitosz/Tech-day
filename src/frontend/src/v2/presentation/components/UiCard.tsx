import React from 'react';

export interface UiCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: React.ReactNode;
}

export const UiCard: React.FC<UiCardProps> = ({
  children,
  className = '',
  title,
  badge,
}) => {
  return (
    <div className={`ui-card ${className}`}>
      {(title || badge) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
          {badge && <div>{badge}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
