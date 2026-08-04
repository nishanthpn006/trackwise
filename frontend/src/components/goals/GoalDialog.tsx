import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@/components/ui/Dialog';
import type { SavingsGoal, SavingsGoalRequest } from '@/types/goal';
import { goalSchema, type GoalFormData } from '@/utils/validation';
import { Loader2 } from 'lucide-react';
import { renderGoalIcon } from '@/utils/goalUtils';

interface GoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SavingsGoalRequest) => Promise<void>;
  goal?: SavingsGoal | null;
  isSubmitting?: boolean;
}

const ICON_OPTIONS = [
  'Target',
  'Shield',
  'Plane',
  'Car',
  'Home',
  'Laptop',
  'Gift',
  'Heart',
  'Briefcase',
  'GraduationCap',
  'DollarSign',
  'Wallet',
];

const COLOR_PRESETS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
  '#6366F1',
];

export const GoalDialog: React.FC<GoalDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
  isSubmitting = false,
}) => {
  const isEdit = Boolean(goal);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      targetAmount: 1000,
      currentAmount: 0,
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: '',
      icon: 'Target',
      color: '#3B82F6',
      description: '',
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  useEffect(() => {
    if (isOpen) {
      if (goal) {
        reset({
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
          category: goal.category || '',
          icon: goal.icon || 'Target',
          color: goal.color || '#3B82F6',
          description: goal.description || '',
        });
      } else {
        reset({
          name: '',
          targetAmount: 1000,
          currentAmount: 0,
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: '',
          icon: 'Target',
          color: '#3B82F6',
          description: '',
        });
      }
    }
  }, [isOpen, goal, reset]);

  const handleFormSubmit = async (data: GoalFormData) => {
    await onSubmit({
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      targetDate: data.targetDate,
      category: data.category || undefined,
      icon: data.icon,
      color: data.color,
      description: data.description || undefined,
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Savings Goal' : 'Create New Savings Goal'}
      description={
        isEdit
          ? 'Modify your goal details, target amount, or timeline.'
          : 'Set a new financial target with deadline and budget tracking.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Goal Name */}
        <div className="space-y-1">
          <label htmlFor="goal-name" className="block text-xs font-bold text-foreground">
            Goal Name <span className="text-destructive">*</span>
          </label>
          <input
            id="goal-name"
            placeholder="e.g. Emergency Cushion, New Car, Summer Vacation"
            {...register('name')}
            className={`w-full px-3 py-2 rounded-xl bg-background border ${
              errors.name ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
            } text-foreground text-xs focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
        </div>

        {/* Target & Current Amounts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="target-amount" className="block text-xs font-bold text-foreground">
              Target Amount ($) <span className="text-destructive">*</span>
            </label>
            <input
              id="target-amount"
              type="number"
              step="0.01"
              placeholder="5000"
              {...register('targetAmount', { valueAsNumber: true })}
              className={`w-full px-3 py-2 rounded-xl bg-background border ${
                errors.targetAmount ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
              } text-foreground text-xs focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.targetAmount && (
              <p className="text-[11px] text-destructive">{errors.targetAmount.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="current-amount" className="block text-xs font-bold text-foreground">
              Current Saved ($)
            </label>
            <input
              id="current-amount"
              type="number"
              step="0.01"
              placeholder="0"
              {...register('currentAmount', { valueAsNumber: true })}
              className={`w-full px-3 py-2 rounded-xl bg-background border ${
                errors.currentAmount ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
              } text-foreground text-xs focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.currentAmount && (
              <p className="text-[11px] text-destructive">{errors.currentAmount.message}</p>
            )}
          </div>
        </div>

        {/* Target Date & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="target-date" className="block text-xs font-bold text-foreground">
              Target Date <span className="text-destructive">*</span>
            </label>
            <input
              id="target-date"
              type="date"
              {...register('targetDate')}
              className={`w-full px-3 py-2 rounded-xl bg-background border ${
                errors.targetDate ? 'border-destructive focus:ring-destructive' : 'border-border/80 focus:ring-primary'
              } text-foreground text-xs focus:outline-none focus:ring-2 transition-all`}
            />
            {errors.targetDate && (
              <p className="text-[11px] text-destructive">{errors.targetDate.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="goal-category" className="block text-xs font-bold text-foreground">
              Category (Optional)
            </label>
            <input
              id="goal-category"
              placeholder="e.g. Travel, Savings, Tech"
              {...register('category')}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Icon Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-foreground">Goal Icon</label>
          <div className="grid grid-cols-6 gap-2 pt-1">
            {ICON_OPTIONS.map((iconName) => (
              <button
                key={iconName}
                type="button"
                onClick={() => setValue('icon', iconName)}
                className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  selectedIcon === iconName
                    ? 'border-primary bg-primary/10 text-primary shadow-xs'
                    : 'border-border/80 hover:bg-muted/60 text-muted-foreground'
                }`}
                aria-label={`Select icon ${iconName}`}
              >
                {renderGoalIcon(iconName, 'h-4 w-4')}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Color Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-foreground">Goal Theme Color</label>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {COLOR_PRESETS.map((colorHex) => (
              <button
                key={colorHex}
                type="button"
                onClick={() => setValue('color', colorHex)}
                className={`h-7 w-7 rounded-full border-2 transition-transform cursor-pointer ${
                  selectedColor === colorHex ? 'scale-110 border-foreground shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: colorHex }}
                aria-label={`Select color ${colorHex}`}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label htmlFor="goal-description" className="block text-xs font-bold text-foreground">
            Description / Notes
          </label>
          <input
            id="goal-description"
            placeholder="Why are you saving for this goal?"
            {...register('description')}
            className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Footer actions */}
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
                <span>Saving...</span>
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Create Goal'
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default GoalDialog;
