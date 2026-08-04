import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@/components/ui/Dialog';
import type { Category, CategoryRequest } from '@/types/transaction';
import { categorySchema, type CategoryFormData } from '@/utils/validation';
import IconPicker from './IconPicker';
import ColorPicker from './ColorPicker';
import { Loader2 } from 'lucide-react';

export interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryRequest) => Promise<void>;
  categoryToEdit?: Category | null;
  existingCategories?: Category[];
  isSubmitting?: boolean;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryToEdit = null,
  existingCategories = [],
  isSubmitting = false,
}) => {
  const isEditing = Boolean(categoryToEdit);
  const titleText = isEditing ? 'Edit Category' : 'Create New Category';
  const descriptionText = isEditing
    ? 'Modify category properties and styling accents.'
    : 'Add a custom category label for grouping transactions.';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      color: '#3B82F6',
      icon: 'tag',
      description: '',
    },
  });

  const selectedType = watch('type');
  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  // Pre-fill on open
  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        reset({
          name: categoryToEdit.name,
          type: categoryToEdit.type,
          color: categoryToEdit.color || '#3B82F6',
          icon: categoryToEdit.icon || 'tag',
          description: categoryToEdit.description || '',
        });
      } else {
        reset({
          name: '',
          type: 'EXPENSE',
          color: '#3B82F6',
          icon: 'tag',
          description: '',
        });
      }
    }
  }, [isOpen, categoryToEdit, reset]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    const trimmedName = data.name.trim();

    // Client-side unique name validation
    const duplicate = existingCategories.find(
      (c) =>
        c.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!categoryToEdit || c.id !== categoryToEdit.id)
    );

    if (duplicate) {
      setError('name', {
        type: 'manual',
        message: `Category with name '${trimmedName}' already exists`,
      });
      return;
    }

    const payload: CategoryRequest = {
      name: trimmedName,
      type: data.type,
      color: data.color,
      icon: data.icon,
      description: data.description?.trim() || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={titleText} description={descriptionText} maxWidth="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs sm:text-sm">
        {/* Category Type Toggle */}
        <div className="space-y-1">
          <label className="block font-bold text-foreground text-xs uppercase tracking-wider">
            Category Type <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => setValue('type', 'EXPENSE', { shouldValidate: true })}
              className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                selectedType === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Expense Category
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'INCOME', { shouldValidate: true })}
              className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                selectedType === 'INCOME'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Income Category
            </button>
          </div>
          {errors.type && <p className="text-[11px] font-semibold text-destructive mt-1">{errors.type.message}</p>}
        </div>

        {/* Name Field */}
        <div className="space-y-1">
          <label htmlFor="cat-dialog-name" className="block font-bold text-foreground text-xs">
            Category Name <span className="text-destructive">*</span>
          </label>
          <input
            id="cat-dialog-name"
            type="text"
            disabled={isSubmitting}
            placeholder="e.g. Subscriptions, Groceries, Freelance"
            className={`w-full px-3 py-2 rounded-xl bg-background border ${
              errors.name ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
            } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all disabled:opacity-50 text-xs sm:text-sm`}
            {...register('name')}
          />
          {errors.name && <p className="text-[11px] font-semibold text-destructive">{errors.name.message}</p>}
        </div>

        {/* Icon & Color Selection Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Icon Selector */}
          <div className="space-y-1">
            <label className="block font-bold text-foreground text-xs">
              Icon <span className="text-destructive">*</span>
            </label>
            <IconPicker
              value={selectedIcon}
              onChange={(iconName) => setValue('icon', iconName, { shouldValidate: true })}
              color={selectedColor}
              disabled={isSubmitting}
            />
            {errors.icon && <p className="text-[11px] font-semibold text-destructive">{errors.icon.message}</p>}
          </div>

          {/* Color Palette */}
          <div className="space-y-1">
            <label className="block font-bold text-foreground text-xs">
              Color Accent <span className="text-destructive">*</span>
            </label>
            <ColorPicker
              value={selectedColor}
              onChange={(colorHex) => setValue('color', colorHex, { shouldValidate: true })}
              disabled={isSubmitting}
            />
            {errors.color && <p className="text-[11px] font-semibold text-destructive">{errors.color.message}</p>}
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-1">
          <label htmlFor="cat-dialog-desc" className="block font-bold text-foreground text-xs">
            Description <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <textarea
            id="cat-dialog-desc"
            rows={2}
            disabled={isSubmitting}
            placeholder="Add brief details about what this category covers..."
            className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 resize-none text-xs sm:text-sm"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-[11px] font-semibold text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Dialog Actions */}
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
              <span>{isEditing ? 'Update Category' : 'Create Category'}</span>
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;
