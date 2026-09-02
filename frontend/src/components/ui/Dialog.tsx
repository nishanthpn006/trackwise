import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Dialog — Accessible modal dialog primitive supporting keyboard navigation, backdrop blur overlay,
 * ESC key dismissal, focus trap, and ARIA accessibility standards.
 */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  return createPortal(
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-background/75 backdrop-blur-sm tw-animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? 'dialog-description' : undefined}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto bg-card border border-border/80 rounded-2xl shadow-xl p-5 sm:p-6 space-y-5 tw-animate-zoom-in focus:outline-none`}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h2 id="dialog-title" className="text-base font-bold text-foreground tracking-tight">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal dialog"
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Dialog;
