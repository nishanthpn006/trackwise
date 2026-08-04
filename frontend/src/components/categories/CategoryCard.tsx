import React from 'react';
import type { CategoryWithStats } from '@/types/category';
import CategoryIcon from './CategoryIcon';
import { Edit2, Trash2, Calendar, Receipt, DollarSign } from 'lucide-react';

export interface CategoryCardProps {
  category: CategoryWithStats;
  onEdit: (category: CategoryWithStats) => void;
  onDelete: (category: CategoryWithStats) => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val || 0);
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const isIncome = category.type === 'INCOME';
  const color = category.color || (isIncome ? '#10B981' : '#F43F5E');

  return (
    <div
      className="group relative bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 overflow-hidden"
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      {/* Top Header: Icon, Name, Description, and Type Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${color}18`,
                color: color,
              }}
            >
              <CategoryIcon name={category.icon} className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground tracking-tight line-clamp-1">
                {category.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    isIncome
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {category.type}
                </span>
                {category.usedThisMonth && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Active This Month
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {category.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/20 p-2.5 rounded-xl border border-border/40">
            {category.description}
          </p>
        )}
      </div>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
        <div className="bg-muted/30 p-2.5 rounded-xl border border-border/30 space-y-0.5">
          <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <Receipt className="h-3 w-3" />
            <span>Transactions</span>
          </div>
          <p className="font-bold text-sm text-foreground">
            {category.transactionCount} {category.transactionCount === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        <div className="bg-muted/30 p-2.5 rounded-xl border border-border/30 space-y-0.5">
          <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <DollarSign className="h-3 w-3" />
            <span>Total Volume</span>
          </div>
          <p className={`font-bold text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(category.totalAmount)}
          </p>
        </div>
      </div>

      {/* Card Footer: Created Date & Action Buttons */}
      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border/30">
        <span className="flex items-center gap-1 text-[11px]">
          <Calendar className="h-3 w-3" />
          {formatDate(category.createdAt)}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(category)}
            aria-label={`Edit ${category.name}`}
            title="Edit Category"
            className="p-1.5 rounded-lg border border-border/60 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(category)}
            aria-label={`Delete ${category.name}`}
            title="Delete Category"
            className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
