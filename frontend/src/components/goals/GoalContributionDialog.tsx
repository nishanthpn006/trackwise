import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@/components/ui/Dialog';
import type { SavingsGoal, GoalContributionRequest } from '@/types/goal';
import { goalContributionSchema, type GoalContributionFormData } from '@/utils/validation';
import { Loader2, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface GoalContributionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalId: string, data: GoalContributionRequest) => Promise<void>;
  goal?: SavingsGoal | null;
  isSubmitting?: boolean;
}

export const GoalContributionDialog: React.FC<GoalContributionDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalContributionFormData>({
    resolver: zodResolver(goalContributionSchema),
    defaultValues: {
      amount: 100,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        amount: 100,
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [isOpen, reset]);

  if (!goal) return null;

  const handleFormSubmit = async (data: GoalContributionFormData) => {
    await onSubmit(goal.id, {
      amount: data.amount,
      date: data.date,
      notes: data.notes || undefined,
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Savings Deposit"
      description={`Contribute funds toward ${goal.name}`}
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Goal Overview Card */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1.5">
          <div className="flex justify-between font-medium">
            <span className="text-muted-foreground">Current Saved:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {formatCurrency(goal.currentAmount)}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-muted-foreground">Target Amount:</span>
            <span className="text-foreground">{formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="flex justify-between font-medium pt-1 border-t border-border/40">
            <span className="text-muted-foreground">Remaining Needed:</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              {formatCurrency(goal.remainingAmount)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Deposit Amount */}
          <div className="space-y-1">
            <label htmlFor="deposit-amount" className="block text-xs font-bold text-foreground">
              Deposit Amount (₹) <span className="text-destructive">*</span>
            </label>
            <input
              id="deposit-amount"
              type="number"
              step="0.01"
              placeholder="100.00"
              {...register('amount', { valueAsNumber: true })}
              className={`w-full px-3 py-2 rounded-xl bg-background border ${
                errors.amount ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
              } text-foreground text-xs focus:outline-none focus:ring-2 transition-all`}
              autoFocus
            />
            {errors.amount && <p className="text-[11px] text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Deposit Date */}
          <div className="space-y-1">
            <label htmlFor="deposit-date" className="block text-xs font-bold text-foreground">
              Deposit Date
            </label>
            <input
              id="deposit-date"
              type="date"
              {...register('date')}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Deposit Notes */}
          <div className="space-y-1">
            <label htmlFor="deposit-notes" className="block text-xs font-bold text-foreground">
              Notes (Optional)
            </label>
            <input
              id="deposit-notes"
              placeholder="e.g. Monthly transfer, bonus deposit"
              {...register('notes')}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-border/40">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <PiggyBank className="h-3.5 w-3.5 mr-1" />
                  <span>Add Savings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default GoalContributionDialog;
