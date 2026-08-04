import React from 'react';

export interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  variant?: 'balance' | 'income' | 'expense' | 'savings';
  subtitle?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  icon,
  variant = 'balance',
  subtitle,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  const variantStyles = {
    balance: {
      accent: 'border-l-4 border-l-primary',
      iconBg: 'bg-primary/10 text-primary',
      amountColor: amount >= 0 ? 'text-foreground' : 'text-destructive',
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
  };

  const style = variantStyles[variant];

  return (
    <div className={`p-6 bg-card border border-border/60 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 ${style.accent} flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${style.iconBg} shadow-2xs`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className={`text-2xl font-extrabold tracking-tight ${style.amountColor}`}>
          {variant === 'income' ? '+' : variant === 'expense' ? '-' : ''}
          {formatCurrency(amount)}
        </p>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
