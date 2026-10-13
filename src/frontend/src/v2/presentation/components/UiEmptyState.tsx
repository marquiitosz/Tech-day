import React from 'react';
import { UiButton } from './UiButton';

export interface UiEmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const UiEmptyState: React.FC<UiEmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="ui-empty-state">
      <svg
        className="ui-empty-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
      <h4 className="ui-empty-title">{title}</h4>
      <p className="ui-empty-desc">{description}</p>
      {actionText && onAction && (
        <UiButton variant="primary" onClick={onAction}>
          {actionText}
        </UiButton>
      )}
    </div>
  );
};
