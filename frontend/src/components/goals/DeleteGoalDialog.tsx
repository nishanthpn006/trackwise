import React from 'react';
import type { SavingsGoal } from '@/types/goal';
import Dialog from '@/components/ui/Dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  goal?: SavingsGoal | null;
  isDeleting?: boolean;
}

export const DeleteGoalDialog: React.FC<DeleteGoalDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  goal,
  isDeleting = false,
}) => {
  if (!goal) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Goal?"
      description="This action cannot be undone and will permanently remove this savings goal."
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            Are you sure you want to delete <strong className="text-foreground">"{goal.name}"</strong>?
          </span>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteGoalDialog;
