import React, { useState, useCallback } from 'react';
import { PlusCircle, MinusCircle, FolderPlus } from 'lucide-react';
import AddIncomeDialog from '@/components/dialogs/AddIncomeDialog';
import AddExpenseDialog from '@/components/dialogs/AddExpenseDialog';
import AddCategoryDialog from '@/components/dialogs/AddCategoryDialog';

export interface QuickActionsProps {
  onRefresh?: () => void;
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  onAddCategory?: () => void;
}

/**
 * QuickActions — Dashboard panel offering fast one-click access to Add Income, Add Expense,
 * and Add Category modal dialog workflows.
 */
export const QuickActions: React.FC<QuickActionsProps> = ({
  onRefresh,
  onAddIncome,
  onAddExpense,
  onAddCategory,
}) => {
  const [isIncomeOpen, setIsIncomeOpen] = useState<boolean>(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState<boolean>(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);

  const handleIncomeClick = () => {
    if (onAddIncome) {
      onAddIncome();
    } else {
      setIsIncomeOpen(true);
    }
  };

  const handleExpenseClick = () => {
    if (onAddExpense) {
      onAddExpense();
    } else {
      setIsExpenseOpen(true);
    }
  };

  const handleCategoryClick = () => {
    if (onAddCategory) {
      onAddCategory();
    } else {
      setIsCategoryOpen(true);
    }
  };

  const handleSuccess = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  return (
    <>
      <div className="bg-card border border-border/60 rounded-xl shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground tracking-tight">Quick Actions</h2>
          <span className="text-[11px] text-muted-foreground font-medium">Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            onClick={handleIncomeClick}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 transition-all font-medium text-xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <div className="flex items-center gap-2.5">
              <PlusCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Add Income</span>
            </div>
            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">New Entry</span>
          </button>

          <button
            type="button"
            onClick={handleExpenseClick}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-700 dark:text-rose-300 transition-all font-medium text-xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <div className="flex items-center gap-2.5">
              <MinusCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Add Expense</span>
            </div>
            <span className="text-[10px] text-rose-600/70 dark:text-rose-400/70">New Entry</span>
          </button>

          <button
            type="button"
            onClick={handleCategoryClick}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-foreground transition-all font-medium text-xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-2.5">
              <FolderPlus className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span>Add Category</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Manage</span>
          </button>
        </div>
      </div>

      {/* Modal Dialogs */}
      <AddIncomeDialog
        isOpen={isIncomeOpen}
        onClose={() => setIsIncomeOpen(false)}
        onSuccess={handleSuccess}
      />

      <AddExpenseDialog
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onSuccess={handleSuccess}
      />

      <AddCategoryDialog
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default QuickActions;
