import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * Loading — Reusable spinner component with accessibility aria-live status.
 */
export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground ${className}`}
    >
      <Loader2 className={`${sizeClasses} animate-spin text-primary`} />
      {text && <span className="text-xs font-medium tracking-wide">{text}</span>}
      <span className="sr-only">Loading content, please wait</span>
    </div>
  );
};

export default Loading;
