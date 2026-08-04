import type React from 'react';
import logoSrc from '@/assets/logo/trackwise-logo.png';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────

/** Controls which combination of mark + wordmark to render. */
export type LogoVariant =
  | 'icon-only'       // just the mark (square)
  | 'horizontal'      // mark + "TrackWise" text side by side
  | 'stacked'         // mark centred above "TrackWise" text
  | 'navbar'          // horizontal, smaller — for mobile navbar
  | 'sidebar'         // horizontal, medium — for sidebar header
  | 'auth'            // stacked, large — for login/register pages
  | 'footer';         // horizontal, small — for footer

export interface LogoProps {
  /** Visual variant (controls layout and default sizing). Default: 'horizontal'. */
  variant?: LogoVariant;
  /**
   * Override the rendered image size in pixels.
   * The mark always maintains its 1:1 aspect ratio.
   */
  size?: number;
  /** Show the "TrackWise" wordmark next to / below the mark. */
  showText?: boolean;
  /** Additional classes applied to the root wrapper element. */
  className?: string;
}

// ── Size presets per variant ──────────────────────────────────────────────────

const VARIANT_DEFAULTS: Record<LogoVariant, { size: number; showText: boolean; stacked: boolean }> = {
  'icon-only':  { size: 32,  showText: false, stacked: false },
  'horizontal': { size: 32,  showText: true,  stacked: false },
  'stacked':    { size: 48,  showText: true,  stacked: true  },
  'navbar':     { size: 28,  showText: true,  stacked: false },
  'sidebar':    { size: 34,  showText: true,  stacked: false },
  'auth':       { size: 64,  showText: true,  stacked: true  },
  'footer':     { size: 24,  showText: true,  stacked: false },
};

// ── Text size classes derived from mark pixel size ────────────────────────────

function textSizeClass(size: number): string {
  if (size >= 56) return 'text-2xl font-extrabold tracking-tight';
  if (size >= 40) return 'text-lg  font-extrabold tracking-tight';
  if (size >= 30) return 'text-sm  font-bold    tracking-tight';
  return                  'text-xs  font-bold    tracking-tight';
}

function subtitleSizeClass(size: number): string {
  if (size >= 56) return 'text-sm';
  return                  'text-[10px]';
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Logo — Official TrackWise brand identity component.
 *
 * Renders the logo mark (PNG) with an optional wordmark, in any of the
 * pre-defined layout variants. A single import, no duplicated asset paths.
 *
 * @example
 * // Sidebar header (expanded)
 * <Logo variant="sidebar" />
 *
 * // Auth page
 * <Logo variant="auth" />
 *
 * // Icon only (collapsed sidebar)
 * <Logo variant="icon-only" size={36} />
 */
const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size: sizeProp,
  showText: showTextProp,
  className,
}) => {
  const defaults = VARIANT_DEFAULTS[variant];
  const size     = sizeProp     ?? defaults.size;
  const showText = showTextProp ?? defaults.showText;
  const stacked  = defaults.stacked;

  const mark = (
    <img
      src={logoSrc}
      alt="TrackWise Logo"
      width={size}
      height={size}
      draggable={false}
      className="shrink-0 object-contain select-none"
      style={{ width: size, height: size }}
    />
  );

  const wordmark = showText ? (
    <div className={cn('flex flex-col', stacked ? 'items-center' : 'min-w-0')}>
      <span className={cn(textSizeClass(size), 'text-foreground leading-none')}>
        TrackWise
      </span>
      {stacked && (
        <span className={cn(subtitleSizeClass(size), 'text-muted-foreground font-medium mt-0.5')}>
          Personal Expense Tracker
        </span>
      )}
    </div>
  ) : null;

  return (
    <div
      className={cn(
        'flex items-center',
        stacked ? 'flex-col gap-3' : 'flex-row gap-2.5',
        className,
      )}
      role="img"
      aria-label="TrackWise"
    >
      {mark}
      {wordmark}
    </div>
  );
};

export default Logo;
