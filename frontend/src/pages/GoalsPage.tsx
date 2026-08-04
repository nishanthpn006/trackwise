import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { Plus, RefreshCw } from 'lucide-react';
import type { SavingsGoal, SavingsGoalRequest, GoalContributionRequest } from '@/types/goal';
import { useGoals } from '@/hooks/useGoals';
import {
  GoalSummary,
  GoalFilters,
  GoalGrid,
  GoalDialog,
  DeleteGoalDialog,
  GoalContributionDialog,
  GoalCharts,
} from '@/components/goals';

export const GoalsPage: React.FC = () => {
  const {
    filteredGoals,
    summary,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    resetFilters,
    refetch,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
  } = useGoals();

  // Modal states
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deletingGoal, setDeletingGoal] = useState<SavingsGoal | null>(null);

  const [isContribOpen, setIsContribOpen] = useState<boolean>(false);
  const [contribGoal, setContribGoal] = useState<SavingsGoal | null>(null);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedGoal(null);
    setIsGoalDialogOpen(true);
  };

  const handleOpenEdit = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsGoalDialogOpen(true);
  };

  const handleOpenDelete = (goal: SavingsGoal) => {
    setDeletingGoal(goal);
    setIsDeleteOpen(true);
  };

  const handleOpenContrib = (goal: SavingsGoal) => {
    setContribGoal(goal);
    setIsContribOpen(true);
  };

  const handleSaveGoal = async (data: SavingsGoalRequest) => {
    if (selectedGoal) {
      await updateGoal(selectedGoal.id, data);
    } else {
      await createGoal(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingGoal) {
      await deleteGoal(deletingGoal.id);
      setIsDeleteOpen(false);
      setDeletingGoal(null);
    }
  };

  const handleAddSavingsDeposit = async (goalId: string, data: GoalContributionRequest) => {
    await addContribution(goalId, data);
  };

  return (
    <PageContainer
      title="Savings Goals"
      description="Set financial targets, automate deposit progress, and achieve long-term milestones."
      className="py-6 space-y-6"
    >
      {/* Top Header Action Buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Overview & Insights
        </h2>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="p-2 rounded-xl border border-border/80 bg-background hover:bg-muted text-foreground transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Refresh goals"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <GoalSummary summary={summary} isLoading={isLoading} />

      {/* Visual Analytics Charts */}
      {!isLoading && (summary?.totalGoals ?? 0) > 0 && (
        <GoalCharts goals={filteredGoals} />
      )}

      {/* Filter and Search Controls */}
      <GoalFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onReset={resetFilters}
      />

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center justify-between">
          <span>Failed to load goals: {error}</span>
          <button
            type="button"
            onClick={refetch}
            className="px-3 py-1 text-xs font-semibold rounded-lg border border-destructive/30 hover:bg-destructive/10 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Goals Grid */}
      <GoalGrid
        goals={filteredGoals}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onAddSavings={handleOpenContrib}
        onCreateNew={handleOpenCreate}
      />

      {/* Create / Edit Dialog */}
      <GoalDialog
        isOpen={isGoalDialogOpen}
        onClose={() => {
          setIsGoalDialogOpen(false);
          setSelectedGoal(null);
        }}
        onSubmit={handleSaveGoal}
        goal={selectedGoal}
        isSubmitting={isSubmitting}
      />

      {/* Delete Dialog */}
      <DeleteGoalDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingGoal(null);
        }}
        onConfirm={handleConfirmDelete}
        goal={deletingGoal}
        isDeleting={isDeleting}
      />

      {/* Deposit Savings Dialog */}
      <GoalContributionDialog
        isOpen={isContribOpen}
        onClose={() => {
          setIsContribOpen(false);
          setContribGoal(null);
        }}
        onSubmit={handleAddSavingsDeposit}
        goal={contribGoal}
        isSubmitting={isSubmitting}
      />
    </PageContainer>
  );
};

export default GoalsPage;
