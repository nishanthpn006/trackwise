import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TransactionType } from '@/types/transaction';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

const transactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  amount: z
    .number({ message: 'Amount must be a valid number' })
    .positive('Amount must be greater than 0'),
  categoryId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  description: z
    .string()
    .max(255, 'Notes cannot exceed 255 characters')
    .optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export interface TransactionFormProps {
  type: TransactionType;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * TransactionForm — Reusable Zod-validated form component for adding Income or Expense entries.
 */
export const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { categories, isLoading: isLoadingCategories } = useCategories(type);

  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      date: today,
      description: '',
    },
  });

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
      {/* Title Field */}
      <div className="space-y-1">
        <label htmlFor="tx-title" className="font-bold text-foreground">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="tx-title"
          type="text"
          disabled={isSubmitting}
          placeholder={type === 'INCOME' ? 'e.g. Monthly Salary, Freelance Payment' : 'e.g. Grocery Shopping, Electric Bill'}
          className={`w-full px-3 py-2 rounded-xl bg-background border ${
            errors.title ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
          } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50`}
          {...register('title')}
        />
        {errors.title && (
          <p className="text-[11px] font-semibold text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Amount & Date Fields Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Amount Field */}
        <div className="space-y-1">
          <label htmlFor="tx-amount" className="font-bold text-foreground">
            Amount ($) <span className="text-destructive">*</span>
          </label>
          <input
            id="tx-amount"
            type="number"
            step="0.01"
            disabled={isSubmitting}
            placeholder="0.00"
            className={`w-full px-3 py-2 rounded-xl bg-background border ${
              errors.amount ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
            } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50`}
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && (
            <p className="text-[11px] font-semibold text-destructive">{errors.amount.message}</p>
          )}
        </div>

        {/* Date Field */}
        <div className="space-y-1">
          <label htmlFor="tx-date" className="font-bold text-foreground">
            Date <span className="text-destructive">*</span>
          </label>
          <input
            id="tx-date"
            type="date"
            disabled={isSubmitting}
            className={`w-full px-3 py-2 rounded-xl bg-background border ${
              errors.date ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
            } text-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50`}
            {...register('date')}
          />
          {errors.date && (
            <p className="text-[11px] font-semibold text-destructive">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Category Selection Field */}
      <div className="space-y-1">
        <label htmlFor="tx-category" className="font-bold text-foreground">
          Category
        </label>
        <select
          id="tx-category"
          disabled={isSubmitting || isLoadingCategories}
          className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
          {...register('categoryId')}
        >
          <option value="">Select a category (Optional)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description / Notes Field */}
      <div className="space-y-1">
        <label htmlFor="tx-description" className="font-bold text-foreground">
          Notes <span className="text-muted-foreground font-normal">(Optional)</span>
        </label>
        <textarea
          id="tx-description"
          rows={2}
          disabled={isSubmitting}
          placeholder="Add additional details or tags..."
          className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 resize-none"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-[11px] font-semibold text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Dialog Footer Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/40">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-border/80 text-foreground hover:bg-muted font-bold text-xs transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            type === 'INCOME'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save {type === 'INCOME' ? 'Income' : 'Expense'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
