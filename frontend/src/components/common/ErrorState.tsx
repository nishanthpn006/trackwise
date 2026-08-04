import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

/**
 * ErrorState — Reusable card component for displaying failed request errors with retry button.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
  isRetrying = false,
  className = '',
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center space-y-3 ${className}`}
    >
      <div className="inline-flex items-center justify-center p-3 bg-destructive/15 rounded-full text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-destructive-foreground bg-destructive rounded-lg shadow-xs hover:bg-destructive/90 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
