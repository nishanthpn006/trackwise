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
    'inline-flex items-center justify-center font-semibold rounded-xl text-sm sm:text-base select-none transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer h-11 sm:h-12';

  const variantStyles = {
    number:
      'bg-card hover:bg-muted/70 text-foreground border border-border/60 hover:border-border active:bg-muted',
    operator:
      'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 active:bg-primary/30 font-bold',
    action:
      'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 font-bold',
    equals:
      'bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/25 active:bg-primary/95 text-base sm:text-lg',
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
