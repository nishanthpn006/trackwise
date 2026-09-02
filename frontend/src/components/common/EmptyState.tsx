import React from 'react';
import { Link } from 'react-router';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="h-10 w-10 text-muted-foreground/60" />,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-card/50 ${className}`}>
      <div className="p-3 bg-muted/50 rounded-full mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
      {action && (
        action.href ? (
          <Link
            to={action.href}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary rounded-xl shadow-xs hover:bg-primary/90 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary rounded-xl shadow-xs hover:bg-primary/90 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
