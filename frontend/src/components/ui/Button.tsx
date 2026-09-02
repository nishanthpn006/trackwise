import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   Button — TrackWise canonical button primitive.

   Variants:
     primary     Blue filled. Use for the one primary action per view.
     secondary   Subtle filled. Secondary actions.
     outline     Border + transparent fill. Alternative secondary.
     ghost       No border/fill. Tertiary, nav-adjacent actions.
     destructive Red filled. Irreversible/dangerous actions only.

   Sizes:
     sm    Compact — inline actions, table rows.
     md    Default — forms, dialogs.
     lg    Prominent — main page CTAs.
     icon  Square — icon-only buttons (must have aria-label).

   States:
     Hover, active (scale-97), focus-visible ring,
     disabled (opacity + no-pointer), loading (spinner).
───────────────────────────────────────────── */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-semibold text-xs rounded-xl',
    'transition-all duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'active:scale-[0.97]',
    'select-none cursor-pointer',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          'shadow-sm',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80',
        ],
        outline: [
          'border border-border bg-transparent text-foreground',
          'hover:bg-muted/60 hover:border-border/80',
        ],
        ghost: [
          'bg-transparent text-muted-foreground',
          'hover:bg-muted/60 hover:text-foreground',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90',
          'shadow-sm',
        ],
      },
      size: {
        sm:   'h-7 px-2.5 text-[11px]',
        md:   'h-9 px-3.5',
        lg:   'h-10 px-5 text-sm',
        icon: 'h-9 w-9 p-0 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Button — Canonical TrackWise button component.
 * Always prefer this over bare <button> elements.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          children
        )}
        {isLoading && (
          <span className="sr-only">
            {loadingText ? loadingText : 'Loading, please wait'}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
