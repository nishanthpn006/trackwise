import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer — standard page wrapper with consistent padding and max-width.
 * Wrap every page component with this for layout consistency.
 */
const PageContainer = ({ children, className = '' }: PageContainerProps) => (
  <main className={`container mx-auto px-4 py-6 ${className}`}>
    {children}
  </main>
);

export default PageContainer;
