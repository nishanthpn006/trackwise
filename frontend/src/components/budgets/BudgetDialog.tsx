import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@/components/ui/Dialog';
import type { Budget, BudgetRequest } from '@/types/budget';
import type { Category } from '@/types/category';
import { budgetSchema, type BudgetFormData } from '@/utils/validation';
import { Loader2 } from 'lucide-react';

export interface BudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetRequest) => Promise<void>;
  budgetToEdit?: Budget | null;
  existingBudgets?: Budget[];
  expenseCategories?: Category[];
  isSubmitting?: boolean;
}

const inputClass = (hasError: boolean) =>
  `w-full px-3 py-2 rounded-xl bg-background border ${
    hasError ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
  } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 text-xs sm:text-sm`;

const labelClass = 'block font-bold text-foreground text-xs';

/** Returns today's date in YYYY-MM-DD format. */
const today = () => new Date().toISOString().substring(0, 10);

/** Returns the last day of the current month in YYYY-MM-DD format. */
const endOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().substring(0, 10);
};

export const BudgetDialog: React.FC<BudgetDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budgetToEdit = null,
  existingBudgets = [],
  expenseCategories = [],
  isSubmitting = false,
}) => {
  const isEditing = Boolean(budgetToEdit);
  const titleText = isEditing ? 'Edit Budget' : 'Create New Budget';
  const descriptionText = isEditing
    ? 'Update the spending limit, period, and linked category for this budget.'
    : 'Set a spending limit for a period, optionally scoped to a single category.';

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: '',
      amount: undefined,
      period: 'MONTHLY',
      startDate: today(),
      endDate: endOfMonth(),
      categoryId: '',
    },
  });

  // Pre-fill on open / reset on close
  useEffect(() => {
    if (isOpen) {
      if (budgetToEdit) {
        reset({
          name: budgetToEdit.name,
          amount: budgetToEdit.amount,
          period: budgetToEdit.period,
          startDate: budgetToEdit.startDate?.substring(0, 10) ?? today(),
          endDate: budgetToEdit.endDate?.substring(0, 10) ?? endOfMonth(),
          categoryId: budgetToEdit.categoryId ?? '',
        });
      } else {
        reset({
          name: '',
          amount: undefined,
          period: 'MONTHLY',
          startDate: today(),
          endDate: endOfMonth(),
          categoryId: '',
        });
      }
    }
  }, [isOpen, budgetToEdit, reset]);

  const handleFormSubmit = async (data: BudgetFormData) => {
    const trimmedName = data.name.trim();

    // Client-side duplicate name check
    const duplicate = existingBudgets.find(
      (b) =>
        b.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!budgetToEdit || b.id !== budgetToEdit.id)
    );

    if (duplicate) {
      setError('name', {
        type: 'manual',
        message: `Budget with name '${trimmedName}' already exists`,
      });
      return;
    }

    const payload: BudgetRequest = {
      name: trimmedName,
      amount: data.amount,
      period: data.period,
      startDate: data.startDate,
      endDate: data.endDate,
      categoryId: data.categoryId && data.categoryId.trim() !== '' ? data.categoryId : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={titleText} description={descriptionText} maxWidth="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs sm:text-sm">
        {/* Budget Name */}
        <div className="space-y-1">
          <label htmlFor="budget-dialog-name" className={labelClass}>
            Budget Name <span className="text-destructive">*</span>
          </label>
          <input
            id="budget-dialog-name"
            type="text"
            disabled={isSubmitting}
            placeholder="e.g. Monthly Groceries, Q1 Travel"
            className={inputClass(Boolean(errors.name))}
            {...register('name')}
          />
          {errors.name && <p className="text-[11px] font-semibold text-destructive">{errors.name.message}</p>}
        </div>

        {/* Amount + Period row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Amount */}
          <div className="space-y-1">
            <label htmlFor="budget-dialog-amount" className={labelClass}>
              Limit Amount <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none">$</span>
              <input
                id="budget-dialog-amount"
                type="number"
                min="0.01"
                step="0.01"
                disabled={isSubmitting}
                placeholder="0.00"
                className={`${inputClass(Boolean(errors.amount))} pl-6`}
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && <p className="text-[11px] font-semibold text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Period */}
          <div className="space-y-1">
            <label htmlFor="budget-dialog-period" className={labelClass}>
              Period <span className="text-destructive">*</span>
            </label>
            <select
              id="budget-dialog-period"
              disabled={isSubmitting}
              className={`${inputClass(Boolean(errors.period))} appearance-none cursor-pointer`}
              {...register('period')}
            >
              <option value="MONTHLY">Monthly</option>
              <option value="WEEKLY">Weekly</option>
              <option value="YEARLY">Yearly</option>
            </select>
            {errors.period && <p className="text-[11px] font-semibold text-destructive">{errors.period.message}</p>}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          {/* Start Date */}
          <div className="space-y-1">
            <label htmlFor="budget-dialog-start" className={labelClass}>
              Start Date <span className="text-destructive">*</span>
            </label>
            <input
              id="budget-dialog-start"
              type="date"
              disabled={isSubmitting}
              className={inputClass(Boolean(errors.startDate))}
              {...register('startDate')}
            />
            {errors.startDate && <p className="text-[11px] font-semibold text-destructive">{errors.startDate.message}</p>}
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label htmlFor="budget-dialog-end" className={labelClass}>
              End Date <span className="text-destructive">*</span>
            </label>
            <input
              id="budget-dialog-end"
              type="date"
              disabled={isSubmitting}
              className={inputClass(Boolean(errors.endDate))}
              {...register('endDate')}
            />
            {errors.endDate && <p className="text-[11px] font-semibold text-destructive">{errors.endDate.message}</p>}
          </div>
        </div>

        {/* Category (optional) */}
        <div className="space-y-1">
          <label htmlFor="budget-dialog-category" className={labelClass}>
            Category{' '}
            <span className="text-muted-foreground font-normal">(Optional — tracks all expenses if blank)</span>
          </label>
          <select
            id="budget-dialog-category"
            disabled={isSubmitting}
            className={`${inputClass(false)} appearance-none cursor-pointer`}
            {...register('categoryId')}
          >
            <option value="">All Expenses (no category filter)</option>
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-border/80 text-foreground hover:bg-muted font-semibold text-xs transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-xs transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditing ? 'Update Budget' : 'Create Budget'}</span>
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default BudgetDialog;
