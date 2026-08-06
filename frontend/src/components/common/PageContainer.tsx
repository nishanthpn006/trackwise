import type { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * PageContainer — Standard page wrapper with consistent padding, max-width, header titles, and spacing.
 */
const PageContainer = ({ children, title, description, className = '' }: PageContainerProps) => (
  <div className={`flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out ${className}`}>
    {(title || description) && (
      <div className="space-y-1">
        {title && <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>}
        {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
      </div>
    )}
    {children}
  </div>
);

export default PageContainer;
