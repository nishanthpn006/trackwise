import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useBudgets } from '@/hooks/useBudgets';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/useToast';
import type { Budget, BudgetRequest } from '@/types/budget';
import { Plus, PiggyBank } from 'lucide-react';

import {
  BudgetStats,
  BudgetFilters,
  BudgetCard,
  BudgetDialog,
  DeleteBudgetDialog,
} from '@/components/budgets';

export const BudgetsPage: React.FC = () => {
  const { success: toastSuccess, error: toastError } = useToast();

  const {
    budgets,
    filteredBudgets,
    statsSummary,
    isLoading,
    isSubmitting,
    isDeleting,
    error,

    // Filters
    search,
    periodFilter,
    statusFilter,
    setSearch,
    setPeriodFilter,
    setStatusFilter,
    resetFilters,

    // Actions
    refetch,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets();

  // Load expense categories for the budget dialog category selector
  const { categories } = useCategories();
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenAdd = () => {
    setBudgetToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setBudgetToEdit(budget);
    setIsDialogOpen(true);
  };

  const handleSaveBudget = async (payload: BudgetRequest) => {
    try {
      if (budgetToEdit) {
        await updateBudget(budgetToEdit.id, payload);
        toastSuccess('Budget updated successfully');
      } else {
        await createBudget(payload);
        toastSuccess('Budget created successfully');
      }
      setIsDialogOpen(false);
      setBudgetToEdit(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save budget';
      toastError(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    try {
      await deleteBudget(budgetToDelete.id);
      toastSuccess('Budget deleted successfully');
      setBudgetToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete budget';
      toastError(msg);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <PageContainer className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Budgets</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Set monthly spending limits, track progress, and stay in control of your finances.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Statistics Summary Row */}
      <BudgetStats stats={statsSummary} isLoading={isLoading} />

      {/* Filters Bar */}
      <BudgetFilters
        search={search}
        onSearchChange={setSearch}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={resetFilters}
      />

      {/* Budget Grid */}
      <div className="space-y-4">
        {error ? (
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs">
            <ErrorState
              title="Failed to Load Budgets"
              message={error}
              onRetry={refetch}
              isRetrying={isLoading}
            />
          </div>
        ) : isLoading ? (
          // Loading skeleton grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs animate-pulse space-y-3 min-h-[200px]"
              >
                <div className="h-3 w-3/4 bg-muted rounded-lg" />
                <div className="h-2 w-1/2 bg-muted rounded-lg" />
                <div className="h-2 w-full bg-muted/60 rounded-full mt-6" />
                <div className="flex justify-between">
                  <div className="h-2 w-1/3 bg-muted rounded-lg" />
                  <div className="h-2 w-1/4 bg-muted rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBudgets.length === 0 ? (
          <div className="bg-card border border-border/80 rounded-2xl p-8 shadow-xs">
            <EmptyState
              icon={<PiggyBank className="h-10 w-10 text-muted-foreground/60" />}
              title={
                search || periodFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'No budgets match your filters'
                  : 'No budgets created yet'
              }
              description={
                search || periodFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or clearing active filters.'
                  : 'Start managing your spending by creating your first budget.'
              }
              action={
                search || periodFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? { label: 'Clear Filters', onClick: resetFilters }
                  : { label: 'Create First Budget', onClick: handleOpenAdd }
              }
              className="py-12"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={handleOpenEdit}
                onDelete={(b) => setBudgetToDelete(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <BudgetDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setBudgetToEdit(null);
        }}
        onSubmit={handleSaveBudget}
        budgetToEdit={budgetToEdit}
        existingBudgets={budgets}
        expenseCategories={expenseCategories}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBudgetDialog
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
        budget={budgetToDelete}
        isDeleting={isDeleting}
      />
    </PageContainer>
  );
};

export default BudgetsPage;
