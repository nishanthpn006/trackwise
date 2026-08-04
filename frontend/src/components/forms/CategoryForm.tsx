import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Check } from 'lucide-react';

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  type: z.enum(['INCOME', 'EXPENSE']),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

const PRESET_ICONS = [
  'wallet',
  'shopping-bag',
  'car',
  'home',
  'utensils',
  'briefcase',
  'heart',
  'tv',
  'dollar-sign',
  'tag',
];

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#64748B', // Slate
];

/**
 * CategoryForm — Form component for creating new categories with type selector, preset icon picker, and color picker.
 */
export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      icon: 'tag',
      color: '#10B981',
    },
  });

  const selectedType = watch('type');
  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
      {serverError && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20">
          {serverError}
        </div>
      )}

      {/* Category Name Field */}
      <div className="space-y-1">
        <label htmlFor="cat-name" className="font-bold text-foreground">
          Category Name <span className="text-destructive">*</span>
        </label>
        <input
          id="cat-name"
          type="text"
          disabled={isSubmitting}
          placeholder="e.g. Groceries, Subscriptions, Salary"
          className={`w-full px-3 py-2 rounded-xl bg-background border ${
            errors.name ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
          } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50`}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-[11px] font-semibold text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Category Type Field (Income vs Expense) */}
      <div className="space-y-1">
        <label className="font-bold text-foreground">Category Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setValue('type', 'EXPENSE')}
            className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
              selectedType === 'EXPENSE'
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300'
                : 'bg-background border-border/80 text-muted-foreground hover:bg-muted'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setValue('type', 'INCOME')}
            className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
              selectedType === 'INCOME'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-background border-border/80 text-muted-foreground hover:bg-muted'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Icon Selector */}
      <div className="space-y-1">
        <label className="font-bold text-foreground">Icon</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {PRESET_ICONS.map((iconName) => {
            const isSelected = selectedIcon === iconName;
            return (
              <button
                key={iconName}
                type="button"
                disabled={isSubmitting}
                onClick={() => setValue('icon', iconName)}
                className={`p-2 rounded-xl border text-[11px] font-medium transition-all capitalize ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary shadow-xs font-bold'
                    : 'bg-background border-border/60 text-muted-foreground hover:bg-muted'
                }`}
              >
                {iconName.replace('-', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selector */}
      <div className="space-y-1">
        <label className="font-bold text-foreground">Theme Color</label>
        <div className="flex items-center gap-2 pt-1">
          {PRESET_COLORS.map((hex) => {
            const isSelected = selectedColor === hex;
            return (
              <button
                key={hex}
                type="button"
                disabled={isSubmitting}
                onClick={() => setValue('color', hex)}
                style={{ backgroundColor: hex }}
                className={`h-7 w-7 rounded-full transition-transform flex items-center justify-center text-white ${
                  isSelected ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-105'
                }`}
                aria-label={`Select color ${hex}`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
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
          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <span>Create Category</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
