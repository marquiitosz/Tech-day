import React, { useId } from 'react';

export interface UiSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const UiSelect: React.FC<UiSelectProps> = ({
  label,
  error,
  children,
  className = '',
  id,
  ...rest
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="ui-form-group">
      {label && (
        <label htmlFor={selectId} className="ui-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`ui-select ${className}`}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="ui-error-text">{error}</span>}
    </div>
  );
};
