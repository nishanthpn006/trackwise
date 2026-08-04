import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import { Target } from 'lucide-react';

export const GoalsPage = () => (
  <PageContainer title="Savings Goals" description="Track financial milestones and long-term savings goals">
    <div className="py-12">
      <EmptyState
        icon={<Target className="h-10 w-10 text-muted-foreground/60" />}
        title="No savings goals created yet"
        description="Set target savings milestones for emergency funds, vacations, or major purchases."
        action={{
          label: "Back to Dashboard",
          href: "/dashboard",
        }}
      />
    </div>
  </PageContainer>
);

export default GoalsPage;
