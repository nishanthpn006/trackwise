import React from 'react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   Input — TrackWise canonical input primitive.

   States:
     Default:  Subtle border, muted background.
     Hover:    Border color increases.
     Focus:    Primary ring + border, white bg.
     Error:    Destructive ring + border.
     Disabled: Reduced opacity, not-allowed cursor.

   Props:
     label       - Optional floating label above the input.
     helperText  - Optional supporting text below the input.
     error       - Error message (replaces helperText, applies error state).
───────────────────────────────────────────── */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visual label rendered above the input */
  label?: string;
  /** Supporting text rendered below the input */
  helperText?: string;
  /** Error message — applies destructive styling and replaces helperText */
  error?: string;
  /** Optional left-side icon element */
  leftIcon?: React.ReactNode;
  /** Optional right-side icon or element */
  rightIcon?: React.ReactNode;
}

/**
 * Input — Canonical TrackWise text input component.
 * Always prefer this over bare <input> elements.
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * <Input label="Amount" error="Must be a positive number" />
 * <Input label="Search" leftIcon={<Search className="h-4 w-4" />} />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate a stable ID if not provided, for label association
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-xs font-semibold',
              hasError ? 'text-destructive' : 'text-foreground',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-muted-foreground pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError ? 'true' : undefined}
            aria-describedby={
              error ? (inputId + '-error')
                : helperText ? (inputId + '-helper')
                : undefined
            }
            className={cn(
              // Base
              'w-full h-9 text-xs rounded-xl',
              'bg-muted/40 text-foreground placeholder:text-muted-foreground/60',
              'border border-border',
              'transition-all duration-150 ease-out',
              // Hover
              'hover:border-border/80 hover:bg-muted/50',
              // Focus
              'focus:outline-none focus:bg-background',
              'focus:border-ring focus:ring-2 focus:ring-ring/40',
              // Error
              hasError && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
              // Disabled
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
              // Padding adjustments for icons
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 text-muted-foreground pointer-events-none flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {(error || helperText) && (
          <p
            id={error ? (inputId + '-error') : (inputId + '-helper')}
            className={cn(
              'text-[11px] leading-snug',
              hasError ? 'text-destructive font-medium' : 'text-muted-foreground'
            )}
            role={hasError ? 'alert' : undefined}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
