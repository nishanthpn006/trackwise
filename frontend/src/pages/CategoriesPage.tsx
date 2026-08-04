import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/useToast';
import type { CategoryRequest, CategoryWithStats } from '@/types/category';
import { Plus, Tags } from 'lucide-react';

import {
  CategoryStats,
  CategoryFilters,
  CategoryGrid,
  CategoryDialog,
  DeleteCategoryDialog,
} from '@/components/categories';

export const CategoriesPage: React.FC = () => {
  const { toastSuccess, toastError } = (() => {
    const toast = useToast();
    return {
      toastSuccess: toast.success,
      toastError: toast.error,
    };
  })();

  const {
    categories,
    filteredCategories,
    statsSummary,
    isLoading,
    isSubmitting,
    isDeleting,
    error,

    // Filter states
    search,
    typeFilter,
    usageFilter,
    sortBy,

    // Filter handlers
    setSearch,
    setTypeFilter,
    setUsageFilter,
    setSortBy,
    resetFilters,

    // Actions
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // Modals state
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryWithStats | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithStats | null>(null);

  // Handlers for Add/Edit
  const handleOpenAdd = () => {
    setCategoryToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (cat: CategoryWithStats) => {
    setCategoryToEdit(cat);
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async (payload: CategoryRequest) => {
    try {
      if (categoryToEdit) {
        await updateCategory(categoryToEdit.id, payload);
        toastSuccess('Category updated successfully');
      } else {
        await createCategory(payload);
        toastSuccess('Category created successfully');
      }
      setIsDialogOpen(false);
      setCategoryToEdit(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save category';
      toastError(msg);
    }
  };

  // Handlers for Delete
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      toastSuccess('Category deleted successfully');
      setCategoryToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete category';
      toastError(msg);
    }
  };

  return (
    <PageContainer className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Organize income and expense categories with custom icons, colors, and usage analytics.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Statistics Row */}
      <CategoryStats stats={statsSummary} isLoading={isLoading} />

      {/* Filters Bar */}
      <CategoryFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        usageFilter={usageFilter}
        onUsageFilterChange={setUsageFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={resetFilters}
      />

      {/* Categories Grid Container */}
      <div className="space-y-4">
        {error ? (
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs">
            <ErrorState
              title="Failed to Load Categories"
              message={error}
              onRetry={refetch}
              isRetrying={isLoading}
            />
          </div>
        ) : !isLoading && filteredCategories.length === 0 ? (
          <div className="bg-card border border-border/80 rounded-2xl p-8 shadow-xs">
            <EmptyState
              icon={<Tags className="h-10 w-10 text-muted-foreground/60" />}
              title={
                search || typeFilter !== 'ALL' || usageFilter !== 'ALL'
                  ? 'No categories match your filters'
                  : 'No categories created yet'
              }
              description={
                search || typeFilter !== 'ALL' || usageFilter !== 'ALL'
                  ? 'Try adjusting your search term or clearing active filters.'
                  : 'Start classifying your financial records by adding your first category.'
              }
              action={{
                label: 'Create First Category',
                onClick: handleOpenAdd,
              }}
              className="py-12"
            />
          </div>
        ) : (
          <CategoryGrid
            categories={filteredCategories}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={(cat) => setCategoryToDelete(cat)}
          />
        )}
      </div>

      {/* Add / Edit Category Dialog */}
      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setCategoryToEdit(null);
        }}
        onSubmit={handleSaveCategory}
        categoryToEdit={categoryToEdit}
        existingCategories={categories}
        isSubmitting={isSubmitting}
      />

      {/* Delete Category Dialog (with Deletion Protection) */}
      <DeleteCategoryDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
        category={categoryToDelete}
        isDeleting={isDeleting}
      />
    </PageContainer>
  );
};

export default CategoriesPage;
