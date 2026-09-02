import React, { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * ToastContainer — Renders active toast notifications in a fixed bottom-right viewport stack.
 */
export const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext);
  if (!context || context.toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-[var(--z-toast)] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {context.toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg tw-animate-slide-up-fade ${
              isSuccess
                ? 'bg-card border-emerald-500/30 text-emerald-900 dark:text-emerald-100'
                : isError
                  ? 'bg-card border-rose-500/30 text-rose-900 dark:text-rose-100'
                  : isWarning
                    ? 'bg-card border-amber-500/30 text-amber-900 dark:text-amber-100'
                    : 'bg-card border-border/80 text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
              {isError && <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />}
              {isWarning && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
              {!isSuccess && !isError && !isWarning && <Info className="h-5 w-5 text-primary shrink-0" />}
              <span className="text-xs font-semibold truncate">{toast.message}</span>
            </div>


            <button
              type="button"
              onClick={() => context.removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-muted/80 text-muted-foreground transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
