import React from 'react';

export interface CalculatorButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'equals';
  className?: string;
  ariaLabel?: string;
  colSpan?: number;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  onClick,
  variant = 'number',
  className = '',
  ariaLabel,
  colSpan = 1,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl text-xs sm:text-sm select-none transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer h-9 sm:h-10';

  const variantStyles = {
    number:
      'bg-card hover:bg-muted/80 text-foreground border border-border/60 hover:border-border active:bg-muted font-medium',
    operator:
      'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 active:bg-primary/30 font-bold text-sm sm:text-base',
    action:
      'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 font-bold text-xs sm:text-sm',
    equals:
      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold shadow-md shadow-blue-500/25 active:from-blue-700 active:to-indigo-700 text-base sm:text-lg border-0',
  }[variant];

  const colSpanClass = colSpan > 1 ? `col-span-${colSpan}` : '';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
      className={`${baseStyles} ${variantStyles} ${colSpanClass} ${className}`}
    >
      {label}
    </button>
  );
};

export default React.memo(CalculatorButton);
