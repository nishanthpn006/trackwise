import React from 'react';
import Dialog from '@/components/ui/Dialog';
import type { Transaction } from '@/types/transaction';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

export interface DeleteTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  transaction: Transaction | null;
  isDeleting?: boolean;
}

export const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  isDeleting = false,
}) => {
  if (!transaction) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Transaction?"
      description="This action cannot be undone."
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Are you sure?</p>
            <p className="text-muted-foreground text-xs">
              Transaction <span className="font-semibold text-foreground">&quot;{transaction.title}&quot;</span> ({formatCurrency(transaction.amount)}) will be permanently deleted from your records.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/40">
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
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90 shadow-xs transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteTransactionDialog;
