import React from 'react';

export interface UiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  isLoading?: boolean;
}

export const UiButton: React.FC<UiButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...rest
}) => {
  const variantClass = `ui-btn-${variant}`;

  return (
    <button
      className={`ui-btn ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Carregando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
