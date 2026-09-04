import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@/components/ui/Dialog';
import type { Category, Transaction, TransactionRequest } from '@/types/transaction';
import type { Account } from '@/types/account';
import { transactionSchema, type TransactionFormData } from '@/utils/validation';
import { Loader2 } from 'lucide-react';

export interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionRequest) => Promise<void>;
  transactionToEdit?: Transaction | null;
  categories: Category[];
  accounts?: Account[];
  isSubmitting?: boolean;
  onOpenCreateCategory?: () => void;
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transactionToEdit = null,
  categories,
  accounts = [],
  isSubmitting = false,
  onOpenCreateCategory,
}) => {
  const isEditing = Boolean(transactionToEdit);
  const titleText = isEditing ? 'Edit Transaction' : 'Add New Transaction';
  const descriptionText = isEditing
    ? 'Update transaction parameters and saved details.'
    : 'Record an income or expense entry into your account.';

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: 0,
      type: 'EXPENSE',
      categoryId: '',
      accountId: '',
      date: todayStr,
      description: '',
    },
  });

  const selectedType = watch('type');

  // Pre-fill form when editing or resetting on open
  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        reset({
          title: transactionToEdit.title,
          amount: transactionToEdit.amount,
          type: transactionToEdit.type,
          categoryId: transactionToEdit.category?.id || '',
          accountId: transactionToEdit.account?.id || '',
          date: transactionToEdit.date,
          description: transactionToEdit.description || '',
        });
      } else {
        const initialType = 'EXPENSE';
        const typeCats = categories.filter((c) => c.type === initialType);
        const firstCategory = typeCats.length > 0 ? typeCats[0].id : '';
        const firstAccount = accounts.length > 0 ? accounts[0].id : '';
        reset({
          title: '',
          amount: undefined as unknown as number, // Let user type clean number
          type: initialType,
          categoryId: firstCategory,
          accountId: firstAccount,
          date: todayStr,
          description: '',
        });
      }
    }
  }, [isOpen, transactionToEdit, categories, accounts, todayStr, reset]);

  const handleTypeSelect = (newType: 'EXPENSE' | 'INCOME') => {
    setValue('type', newType, { shouldValidate: true });
    const availableForType = categories.filter((c) => c.type === newType);
    setValue('categoryId', availableForType.length > 0 ? availableForType[0].id : '', { shouldValidate: true });
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    const payload: TransactionRequest = {
      title: data.title.trim(),
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      accountId: data.accountId || undefined,
      date: data.date,
      description: data.description?.trim() || undefined,
    };
    await onSubmit(payload);
  };

  // Strictly filter available categories matching selected type
  const matchingCategories = categories.filter(
    (cat) => cat.type === selectedType
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={titleText} description={descriptionText} maxWidth="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs sm:text-sm">
        {/* Transaction Type Segmented Toggle */}
        <div className="space-y-1">
          <label className="block font-bold text-foreground text-xs uppercase tracking-wider">
            Transaction Type <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => handleTypeSelect('EXPENSE')}
              className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                selectedType === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeSelect('INCOME')}
              className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                selectedType === 'INCOME'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Income
            </button>
          </div>
          {errors.type && <p className="text-[11px] font-semibold text-destructive mt-1">{errors.type.message}</p>}
        </div>

        {/* Title Field */}
        <div className="space-y-1">
          <label htmlFor="dialog-tx-title" className="block font-bold text-foreground text-xs">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            id="dialog-tx-title"
            type="text"
            disabled={isSubmitting}
            placeholder={selectedType === 'INCOME' ? 'e.g. Monthly Salary, Freelance Gig' : 'e.g. Supermarket, Electricity Bill'}
            className={`w-full px-3 py-2 rounded-xl bg-background border ${
              errors.title ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
            } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 text-xs sm:text-sm`}
            {...register('title')}
          />
          {errors.title && <p className="text-[11px] font-semibold text-destructive">{errors.title.message}</p>}
        </div>

        {/* Amount & Date Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Amount Field */}
          <div className="space-y-1">
            <label htmlFor="dialog-tx-amount" className="block font-bold text-foreground text-xs">
              Amount (₹) <span className="text-destructive">*</span>
            </label>
            <input
              id="dialog-tx-amount"
              type="number"
              step="0.01"
              disabled={isSubmitting}
              placeholder="0.00"
              className={`w-full px-3 py-2 rounded-xl bg-background border ${
                errors.amount ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
              } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 text-xs sm:text-sm`}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-[11px] font-semibold text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Date Field */}
          <div className="space-y-1">
            <label htmlFor="dialog-tx-date" className="block font-bold text-foreground text-xs">
              Date <span className="text-destructive">*</span>
            </label>
            <input
              id="dialog-tx-date"
              type="date"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-xl bg-background border ${
                errors.date ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
              } text-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 text-xs sm:text-sm`}
              {...register('date')}
            />
            {errors.date && <p className="text-[11px] font-semibold text-destructive">{errors.date.message}</p>}
          </div>
        </div>

        {/* Category & Account Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="dialog-tx-category" className="block font-bold text-foreground text-xs">
                Category <span className="text-destructive">*</span>
              </label>
              {onOpenCreateCategory && (
                <button
                  type="button"
                  onClick={onOpenCreateCategory}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  + Add Category
                </button>
              )}
            </div>
            <select
              id="dialog-tx-category"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded-xl bg-background border ${
                errors.categoryId ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
              } text-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 text-xs sm:text-sm`}
              {...register('categoryId')}
            >
              <option value="">Select category...</option>
              {matchingCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {matchingCategories.length === 0 ? (
              <p className="text-[11px] text-amber-500 mt-1 flex items-center justify-between">
                <span>No {selectedType.toLowerCase()} categories found.</span>
                {onOpenCreateCategory && (
                  <button
                    type="button"
                    onClick={onOpenCreateCategory}
                    className="font-bold underline text-primary hover:text-primary/80"
                  >
                    Create one
                  </button>
                )}
              </p>
            ) : errors.categoryId ? (
              <p className="text-[11px] font-semibold text-destructive">{errors.categoryId.message}</p>
            ) : null}
          </div>

          {/* Account Field */}
          <div className="space-y-1">
            <label htmlFor="dialog-tx-account" className="block font-bold text-foreground text-xs">
              Account <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <select
              id="dialog-tx-account"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 text-xs sm:text-sm"
              {...register('accountId')}
            >
              <option value="">None (Unassigned)</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.type})
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Notes / Description Field */}
        <div className="space-y-1">
          <label htmlFor="dialog-tx-description" className="block font-bold text-foreground text-xs">
            Notes / Description <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <textarea
            id="dialog-tx-description"
            rows={2}
            disabled={isSubmitting}
            placeholder="Add relevant notes or memo..."
            className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 resize-none text-xs sm:text-sm"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-[11px] font-semibold text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Dialog Action Buttons */}
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
              <span>{isEditing ? 'Update Transaction' : 'Save Transaction'}</span>
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default TransactionDialog;
