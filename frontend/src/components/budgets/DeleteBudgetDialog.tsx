import React from 'react';
import type { Budget } from '@/types/budget';
import Dialog from '@/components/ui/Dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

export interface DeleteBudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  budget: Budget | null;
  isDeleting?: boolean;
}

export const DeleteBudgetDialog: React.FC<DeleteBudgetDialogProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  budget,
  isDeleting = false,
}) => {
  if (!budget) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Budget"
      description="This action is permanent and cannot be undone."
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Warning box */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/8 border border-rose-500/20">
          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-foreground">
              Are you sure you want to delete{' '}
              <span className="text-rose-600 dark:text-rose-400">&ldquo;{budget.name}&rdquo;</span>?
            </p>
            <p className="text-[11px] text-muted-foreground">
              This budget ({formatCurrency(budget.amount)} / {budget.period.toLowerCase()}) will be permanently removed.
              Your transactions will not be affected.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-border/80 text-foreground hover:bg-muted font-semibold text-xs transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-xs transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Budget</span>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteBudgetDialog;
