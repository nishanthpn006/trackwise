import React from 'react';
import { useNavigate } from 'react-router';
import { PlusCircle, ArrowUpRight } from 'lucide-react';

/**
 * DashboardEmptyState — Clean, contextual empty state shown when no financial records exist yet.
 * Left-aligned with clear actionable next steps.
 */
export const DashboardEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 sm:p-8 bg-card border border-dashed border-border/80 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="space-y-1.5 max-w-lg text-left">
        <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
          No financial activity recorded yet
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your dashboard metrics and analytics will automatically populate once you record income or log an expense.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all duration-150 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Transaction</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/import-export')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
        >
          <span>Import CSV</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default DashboardEmptyState;

