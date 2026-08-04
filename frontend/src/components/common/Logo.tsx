import type React from 'react';
import logoPng from '@/assets/logo/trackwise-logo.png';
import logoSvg from '@/assets/logo/trackwise-logo.svg';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────

export type LogoVariant =
  | 'icon-only'       // mark only (square)
  | 'horizontal'      // mark + "TrackWise" text side by side
  | 'stacked'         // mark centred above "TrackWise" text
  | 'navbar'          // 32px icon, responsive wordmark — for navbar
  | 'sidebar'         // 32px icon, responsive wordmark — for sidebar
  | 'auth'            // 80px icon, stacked — for login/register pages
  | 'footer';         // 28px icon, horizontal — for footer

export interface LogoProps {
  /** Visual variant (controls layout and default sizing). Default: 'horizontal'. */
  variant?: LogoVariant;
  /**
   * Override the rendered icon mark size in pixels.
   * Default is 32px for navbar/sidebar/horizontal.
   */
  size?: number;
  /** Show the "TrackWise" wordmark next to / below the mark. */
  showText?: boolean;
  /** Optional custom subtitle for stacked auth variant. */
  subtitle?: string;
  /** Additional classes applied to the root wrapper element. */
  className?: string;
  /** Prefer vector SVG for Retina display sharpness. Default: true. */
  useSvg?: boolean;
}

// ── Size presets per variant ──────────────────────────────────────────────────

const VARIANT_DEFAULTS: Record<LogoVariant, { size: number; showText: boolean; stacked: boolean }> = {
  'icon-only':  { size: 32,  showText: false, stacked: false },
  'horizontal': { size: 32,  showText: true,  stacked: false },
  'stacked':    { size: 80,  showText: true,  stacked: true  },
  'navbar':     { size: 32,  showText: true,  stacked: false },
  'sidebar':    { size: 32,  showText: true,  stacked: false },
  'auth':       { size: 80,  showText: true,  stacked: true  },
  'footer':     { size: 28,  showText: true,  stacked: false },
};

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Logo — Official TrackWise brand identity component.
 *
 * Features:
 * - 32px icon size default for navbar & sidebar
 * - Responsive 20px / 22px / 24px wordmark with font-weight 700 & -0.02em letter spacing
 * - Perfect vertical centering (`flex items-center`)
 * - Exact 12px spacing between icon and text (`gap-3`)
 * - Transparent background vector SVG output for Retina display sharpness
 * - Preserved 1:1 aspect ratio without stretching
 */
const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size: sizeProp,
  showText: showTextProp,
  subtitle,
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
      <span
        className={cn(
          'font-bold text-foreground leading-none tracking-[-0.02em]',
          stacked
            ? 'text-2xl sm:text-3xl'
            : 'text-[20px] sm:text-[22px] md:text-[24px]'
        )}
      >
        TrackWise
      </span>
      {stacked && (
        <span className="text-xs sm:text-sm font-medium text-muted-foreground mt-1.5 tracking-tight">
          {subtitle || 'Personal Expense Tracker • Take control of your finances.'}
        </span>
      )}
    </div>
  ) : null;

  return (
    <div
      className={cn(
        'flex items-center justify-start shrink-0',
        stacked ? 'flex-col gap-4 justify-center' : 'flex-row gap-3',
        className
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
