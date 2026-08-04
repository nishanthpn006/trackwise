import React from 'react';
import Dialog from '@/components/ui/Dialog';
import type { CategoryWithStats } from '@/types/category';
import { AlertTriangle, ArrowRight, Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';

export interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  category: CategoryWithStats | null;
  isDeleting?: boolean;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  category,
  isDeleting = false,
}) => {
  const navigate = useNavigate();

  if (!category) return null;

  const isUsedByTransactions = category.transactionCount > 0;

  const handleGoToTransactions = () => {
    onClose();
    navigate(`/transactions?categoryId=${category.id}`);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isUsedByTransactions ? 'Category Cannot Be Deleted' : 'Delete Category?'}
      description={
        isUsedByTransactions
          ? 'Deletion Protection Alert'
          : 'This action cannot be undone.'
      }
      maxWidth="sm"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {isUsedByTransactions ? (
          /* Protected Deletion Warning State */
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
              <Lock className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Deletion Protection Active</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This category <span className="font-semibold text-foreground">&quot;{category.name}&quot;</span> is currently used by{' '}
                  <span className="font-bold text-foreground">{category.transactionCount}</span> existing transaction
                  {category.transactionCount === 1 ? '' : 's'} and cannot be deleted.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              To delete this category, please first delete or reassign its associated transactions on the Transactions page.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 text-foreground hover:bg-muted font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGoToTransactions}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-xs transition-all"
              >
                <span>Go to Transactions</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Normal Deletion Confirmation State */
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Are you sure?</p>
                <p className="text-xs text-muted-foreground">
                  Category <span className="font-semibold text-foreground">&quot;{category.name}&quot;</span> will be permanently deleted.
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
                onClick={onConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90 shadow-xs transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Category</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
