import type React from 'react';
import Logo from './Logo';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * Loading — Official TrackWise loading screen component with pulsed logo mark and status text.
 */
export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  className = '',
}) => {
  const pixelSizes = {
    sm: 32,
    md: 48,
    lg: 64,
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 p-6 text-muted-foreground ${className}`}
    >
      <div className="animate-pulse">
        <Logo variant="icon-only" size={pixelSizes} />
      </div>
      {text && <span className="text-xs font-semibold tracking-wide text-foreground">{text}</span>}
      <span className="sr-only">Loading content, please wait</span>
    </div>
  );
};

export default Loading;
