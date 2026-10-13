import React, { useEffect } from 'react';

export interface UiModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const UiModal: React.FC<UiModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="ui-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="ui-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Fechar janela"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
