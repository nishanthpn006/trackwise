import React from 'react';
import { formatCurrency } from '@/utils/currency';

export type SummaryCardVariant =
  | 'balance'
  | 'income'
  | 'expense'
  | 'savings'
  | 'category'
  | 'percentage'
  | 'avgSpend'
  | 'txCount';

export interface SummaryCardProps {
  title: string;
  /** Primary numeric amount or text string to display */
  value?: number | string | null;
  /** Backward compatibility numeric amount */
  amount?: number;
  icon: React.ReactNode;
  variant?: SummaryCardVariant;
  subtitle?: string;
  /** Force formatting as currency if true */
  isCurrency?: boolean;
  /** Force formatting as percentage if true */
  isPercentage?: boolean;
}

/**
 * SummaryCard — Reusable, accessible, color-coded metric card component for the dashboard.
 * Supports currency, percentage, text string, and raw counter formatting with hover animations.
 */
export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  amount,
  icon,
  variant = 'balance',
  subtitle,
  isCurrency = false,
  isPercentage = false,
}) => {
  // Format numeric values cleanly
  const formatValue = (): string => {
    const rawVal = value !== undefined ? value : amount;
    if (rawVal === null || rawVal === undefined) return 'None';

    if (typeof rawVal === 'string') return rawVal;

    if (isPercentage || variant === 'percentage') {
      return `${rawVal.toFixed(1)}%`;
    }

    if (isCurrency || variant === 'balance' || variant === 'income' || variant === 'expense' || variant === 'savings' || variant === 'avgSpend') {
      return formatCurrency(rawVal);
    }

    return rawVal.toLocaleString();
  };

  const variantStyles: Record<
    SummaryCardVariant,
    { accent: string; iconBg: string; amountColor: string }
  > = {
    balance: {
      accent: 'border-l-4 border-l-primary',
      iconBg: 'bg-primary/10 text-primary',
      amountColor: 'text-foreground',
    },
    income: {
      accent: 'border-l-4 border-l-emerald-500',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      amountColor: 'text-emerald-600 dark:text-emerald-400',
    },
    expense: {
      accent: 'border-l-4 border-l-rose-500',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      amountColor: 'text-rose-600 dark:text-rose-400',
    },
    savings: {
      accent: 'border-l-4 border-l-blue-500',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      amountColor: 'text-blue-600 dark:text-blue-400',
    },
    category: {
      accent: 'border-l-4 border-l-amber-500',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      amountColor: 'text-amber-600 dark:text-amber-400',
    },
    percentage: {
      accent: 'border-l-4 border-l-indigo-500',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      amountColor: 'text-indigo-600 dark:text-indigo-400',
    },
    avgSpend: {
      accent: 'border-l-4 border-l-pink-500',
      iconBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
      amountColor: 'text-pink-600 dark:text-pink-400',
    },
    txCount: {
      accent: 'border-l-4 border-l-teal-500',
      iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      amountColor: 'text-teal-600 dark:text-teal-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`p-5 bg-card border border-border/60 rounded-xl shadow-2xs hover:shadow-md transition-all duration-200 ${style.accent} flex flex-col justify-between h-full select-none`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${style.iconBg} shadow-2xs shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className={`text-xl sm:text-2xl font-extrabold tracking-tight truncate ${style.amountColor}`}>
          {formatValue()}
        </p>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground leading-tight truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(SummaryCard);
