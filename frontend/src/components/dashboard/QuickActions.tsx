import React from 'react';
import { useNavigate } from 'react-router';
import { PlusCircle, MinusCircle, FolderPlus } from 'lucide-react';

export interface QuickActionsProps {
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  onAddCategory?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddIncome,
  onAddExpense,
  onAddCategory,
}) => {
  const navigate = useNavigate();

  const handleIncome = () => {
    if (onAddIncome) {
      onAddIncome();
    } else {
      navigate('/transactions?type=INCOME');
    }
  };

  const handleExpense = () => {
    if (onAddExpense) {
      onAddExpense();
    } else {
      navigate('/transactions?type=EXPENSE');
    }
  };

  const handleCategory = () => {
    if (onAddCategory) {
      onAddCategory();
    } else {
      navigate('/transactions?tab=categories');
    }
  };

  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground tracking-tight">Quick Actions</h2>
        <span className="text-[11px] text-muted-foreground font-medium">Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        <button
          type="button"
          onClick={handleIncome}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 transition-all font-medium text-xs group"
        >
          <div className="flex items-center gap-2.5">
            <PlusCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Add Income</span>
          </div>
          <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">New Entry</span>
        </button>

        <button
          type="button"
          onClick={handleExpense}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-700 dark:text-rose-300 transition-all font-medium text-xs group"
        >
          <div className="flex items-center gap-2.5">
            <MinusCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Add Expense</span>
          </div>
          <span className="text-[10px] text-rose-600/70 dark:text-rose-400/70">New Entry</span>
        </button>

        <button
          type="button"
          onClick={handleCategory}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-foreground transition-all font-medium text-xs group"
        >
          <div className="flex items-center gap-2.5">
            <FolderPlus className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Add Category</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Manage</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
