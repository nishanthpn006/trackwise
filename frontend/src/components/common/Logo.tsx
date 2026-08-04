import type React from 'react';
import logoPng from '@/assets/logo/trackwise-logo.png';
import logoSvg from '@/assets/logo/trackwise-logo.svg';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────

/** Controls which combination of mark + wordmark to render. */
export type LogoVariant =
  | 'icon-only'       // just the mark (square)
  | 'horizontal'      // mark + "TrackWise" text side by side
  | 'stacked'         // mark centred above "TrackWise" text
  | 'navbar'          // horizontal, 36px icon — for mobile navbar
  | 'sidebar'         // horizontal, 36px icon — for sidebar header
  | 'auth'            // stacked, 60px icon — for login/register pages
  | 'footer';         // horizontal, 28px icon — for footer

export interface LogoProps {
  /** Visual variant (controls layout and default sizing). Default: 'horizontal'. */
  variant?: LogoVariant;
  /**
   * Override the rendered icon mark size in pixels.
   * Default is ~36px for navbar/sidebar/horizontal.
   */
  size?: number;
  /** Show the "TrackWise" wordmark next to / below the mark. */
  showText?: boolean;
  /** Additional classes applied to the root wrapper element. */
  className?: string;
  /** Prefer vector SVG for Retina display sharpness. Default: true. */
  useSvg?: boolean;
}

// ── Size presets per variant (approx 36px for main navigation) ───────────────

const VARIANT_DEFAULTS: Record<LogoVariant, { size: number; showText: boolean; stacked: boolean }> = {
  'icon-only':  { size: 36,  showText: false, stacked: false },
  'horizontal': { size: 36,  showText: true,  stacked: false },
  'stacked':    { size: 56,  showText: true,  stacked: true  },
  'navbar':     { size: 36,  showText: true,  stacked: false },
  'sidebar':    { size: 36,  showText: true,  stacked: false },
  'auth':       { size: 60,  showText: true,  stacked: true  },
  'footer':     { size: 28,  showText: true,  stacked: false },
};

// ── Text size classes derived from mark pixel size ────────────────────────────

function textSizeClass(size: number): string {
  if (size >= 56) return 'text-2xl font-extrabold tracking-tight';
  if (size >= 40) return 'text-xl  font-extrabold tracking-tight';
  if (size >= 32) return 'text-base font-bold    tracking-tight';
  return                  'text-sm  font-bold    tracking-tight';
}

function subtitleSizeClass(size: number): string {
  if (size >= 56) return 'text-sm font-medium';
  return                  'text-[11px] font-medium';
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Logo — Official TrackWise brand identity component.
 *
 * Features:
 * - Transparent background (no white box)
 * - 36px icon size default for crisp, readable navigation branding
 * - Perfect vertical centering (`flex items-center`)
 * - Exact 12px spacing between icon and text (`gap-3`)
 * - High-DPI / Retina display crisp vector SVG output
 * - Aspect ratio preserved (`object-contain aspect-square`)
 */
const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size: sizeProp,
  showText: showTextProp,
  className,
  useSvg = true,
}) => {
  const defaults = VARIANT_DEFAULTS[variant];
  const size     = sizeProp     ?? defaults.size;
  const showText = showTextProp ?? defaults.showText;
  const stacked  = defaults.stacked;

  const markSrc = useSvg ? logoSvg : logoPng;

  const mark = (
    <img
      src={markSrc}
      alt="TrackWise Logo"
      width={size}
      height={size}
      draggable={false}
      className="shrink-0 object-contain aspect-square select-none"
      style={{ width: size, height: size }}
    />
  );

  const wordmark = showText ? (
    <div className={cn('flex flex-col justify-center', stacked ? 'items-center text-center' : 'min-w-0')}>
      <span className={cn(textSizeClass(size), 'text-foreground leading-none')}>
        TrackWise
      </span>
      {stacked && (
        <span className={cn(subtitleSizeClass(size), 'text-muted-foreground mt-1')}>
          Personal Expense Tracker
        </span>
      )}
    </div>
  ) : null;

  return (
    <div
      className={cn(
        'flex items-center justify-start shrink-0',
        stacked ? 'flex-col gap-3 justify-center' : 'flex-row gap-3',
        className,
      )}
      role="img"
      aria-label="TrackWise Logo"
    >
      {mark}
      {wordmark}
    </div>
  );
};

export default Logo;
