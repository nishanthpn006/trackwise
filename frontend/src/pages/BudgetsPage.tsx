import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import { PiggyBank } from 'lucide-react';

export const BudgetsPage = () => (
  <PageContainer title="Monthly Budgets" description="Set spending limits and manage budget goals">
    <div className="py-12">
      <EmptyState
        icon={<PiggyBank className="h-10 w-10 text-muted-foreground/60" />}
        title="No budgets created yet"
        description="Budgeting tools will allow you to track monthly spending limits across categories."
        action={{
          label: "Back to Dashboard",
          href: "/dashboard",
        }}
      />
    </div>
  </PageContainer>
);

export default BudgetsPage;
