import React from 'react';
import { useNavigate } from 'react-router';
import { PlusCircle, WalletCards } from 'lucide-react';

/**
 * DashboardEmptyState — Friendly banner component shown when the user has zero financial records,
 * providing a direct primary CTA button navigating to the Transactions page.
 */
export const DashboardEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-card border border-dashed border-border/80 rounded-2xl shadow-2xs flex flex-col items-center justify-center text-center space-y-3 bg-muted/20">
      <div className="p-3 rounded-2xl bg-primary/10 text-primary">
        <WalletCards className="h-8 w-8" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm font-bold text-foreground">No financial data available yet</h3>
        <p className="text-xs text-muted-foreground">
          Start tracking your personal finances by creating your very first income or expense transaction.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/transactions')}
        className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Add Your First Transaction</span>
      </button>
    </div>
  );
};

export default DashboardEmptyState;
