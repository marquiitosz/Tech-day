import React, { useId } from 'react';

export interface UiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const UiInput: React.FC<UiInputProps> = ({
  label,
  error,
  className = '',
  id,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="ui-form-group">
      {label && (
        <label htmlFor={inputId} className="ui-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`ui-input ${error ? 'ui-input-error' : ''} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <span id={errorId} className="ui-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
