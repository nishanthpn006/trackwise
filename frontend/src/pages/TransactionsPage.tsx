import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useAccounts } from '@/hooks/useAccounts';
import { useToast } from '@/hooks/useToast';
import type { Category, CategoryRequest, Transaction, TransactionRequest } from '@/types/transaction';
import { CreditCard, Plus, Tag } from 'lucide-react';

import {
  TransactionSummary,
  TransactionFilters,
  TransactionTable,
  TransactionPagination,
  TransactionDialog,
  DeleteTransactionDialog,
} from '@/components/transactions';
import Dialog from '@/components/ui/Dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '@/utils/validation';
import categoryService from '@/services/categoryService';

export const TransactionsPage: React.FC = () => {
  const toast = useToast();

  const {
    transactions,
    summary,
    isLoading,
    isSubmitting,
    isDeleting,
    error,

    // Filter values
    search,
    categoryId,
    type,
    startDate,
    endDate,
    page,
    size,
    sortBy,
    sortDir,

    // Actions
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setSearch,
    setCategoryId,
    setType,
    setDateRange,
    setPage,
    setSize,
    setSort,
    resetFilters,
  } = useTransactions({ initialSize: 10 });

  const { categories, isLoading: isLoadingCategories, refetch: refetchCategories } = useCategories();
  const { accounts } = useAccounts();


  // Modals state
  const [isTxDialogOpen, setIsTxDialogOpen] = useState<boolean>(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  // Category Management Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Category Form
  const {
    register: registerCat,
    handleSubmit: handleSubmitCat,
    reset: resetCat,
    formState: { errors: catErrors, isSubmitting: isCatSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      color: '#3B82F6',
      icon: 'tag',
    },
  });

  // Handlers for Add/Edit Transaction
  const handleOpenAddTx = () => {
    setTxToEdit(null);
    setIsTxDialogOpen(true);
  };

  const handleOpenEditTx = (tx: Transaction) => {
    setTxToEdit(tx);
    setIsTxDialogOpen(true);
  };

  const handleSaveTransaction = async (payload: TransactionRequest) => {
    try {
      if (txToEdit) {
        await updateTransaction(txToEdit.id, payload);
        toast.success('Transaction updated successfully');
      } else {
        await createTransaction(payload);
        toast.success('Transaction added successfully');
      }
      setIsTxDialogOpen(false);
      setTxToEdit(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save transaction';
      toast.error(msg);
    }
  };

  // Handlers for Delete Transaction
  const handleConfirmDeleteTx = async () => {
    if (!txToDelete) return;
    try {
      await deleteTransaction(txToDelete.id);
      toast.success('Transaction deleted successfully');
      setTxToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete transaction';
      toast.error(msg);
    }
  };

  // Category Management Handlers
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      resetCat({
        name: cat.name,
        type: cat.type,
        color: cat.color || '#3B82F6',
        icon: cat.icon || 'tag',
      });
    } else {
      setEditingCategory(null);
      resetCat({
        name: '',
        type: 'EXPENSE',
        color: '#3B82F6',
        icon: 'tag',
      });
    }
    setIsCategoryModalOpen(true);
  };

  const onSubmitCategory = async (data: CategoryFormData) => {
    try {
      const payload: CategoryRequest = {
        name: data.name.trim(),
        type: data.type,
        color: data.color || '#3B82F6',
        icon: data.icon || 'tag',
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
        toast.success('Category updated successfully');
      } else {
        await categoryService.createCategory(payload);
        toast.success('Category created successfully');
      }
      setEditingCategory(null);
      resetCat({ name: '', type: 'EXPENSE', color: '#3B82F6', icon: 'tag' });
      await refetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save category';
      toast.error(msg);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    try {
      await categoryService.deleteCategory(deletingCategory.id);
      toast.success('Category deleted successfully');
      setDeletingCategory(null);
      await refetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete category';
      toast.error(msg);
    }
  };

  const totalElements = transactions?.totalElements ?? 0;
  const totalPages = transactions?.totalPages ?? 0;
  const transactionList = transactions?.content ?? [];

  return (
    <PageContainer className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage and track all income and expense records with real-time filtering.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenCategoryModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border/80 bg-card hover:bg-muted text-foreground transition-all shadow-xs"
          >
            <Tag className="h-3.5 w-3.5 text-primary" />
            <span>Manage Categories</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddTx}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Row */}
      <TransactionSummary summary={summary} totalTransactions={totalElements} isLoading={isLoading} />

      {/* Filters & Search Row */}
      <TransactionFilters
        search={search}
        onSearchChange={setSearch}
        selectedType={type}
        onTypeChange={setType}
        selectedCategory={categoryId}
        onCategoryChange={setCategoryId}
        categories={categories}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={setDateRange}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={setSort}
        onReset={resetFilters}
        isLoadingCategories={isLoadingCategories}
      />

      {/* Transactions Table & Container */}
      <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden">
        {error ? (
          <div className="p-6">
            <ErrorState
              title="Failed to Load Transactions"
              message={error}
              onRetry={fetchTransactions}
              isRetrying={isLoading}
            />
          </div>
        ) : !isLoading && transactionList.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-10 w-10 text-muted-foreground/60" />}
            title="No transactions yet"
            description={
              search || categoryId || type || startDate || endDate
                ? 'No transactions match your active search filters or date range.'
                : 'Start tracking your financial transactions by creating your first entry.'
            }
            action={{
              label: 'Add First Transaction',
              onClick: handleOpenAddTx,
            }}
            className="py-16"
          />
        ) : (
          <>
            <TransactionTable
              transactions={transactionList}
              isLoading={isLoading}
              onEdit={handleOpenEditTx}
              onDelete={(tx) => setTxToDelete(tx)}
            />

            <TransactionPagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={size}
              onPageChange={setPage}
              onSizeChange={setSize}
              isLoading={isLoading}
            />
          </>
        )}
      </div>

      {/* Add / Edit Transaction Dialog */}
      <TransactionDialog
        isOpen={isTxDialogOpen}
        onClose={() => {
          setIsTxDialogOpen(false);
          setTxToEdit(null);
        }}
        onSubmit={handleSaveTransaction}
        transactionToEdit={txToEdit}
        categories={categories}
        accounts={accounts}
        isSubmitting={isSubmitting}
      />


      {/* Delete Transaction Dialog */}
      <DeleteTransactionDialog
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleConfirmDeleteTx}
        transaction={txToDelete}
        isDeleting={isDeleting}
      />

      {/* Manage Categories Dialog */}
      {isCategoryModalOpen && (
        <Dialog
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Manage Categories'}
          description="Create, update, or delete transaction category labels."
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Form to Create/Update Category */}
            <form onSubmit={handleSubmitCat(onSubmitCategory)} className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {editingCategory ? 'Update Category' : 'Create New Category'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="cat-name-input" className="block font-bold mb-1">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="cat-name-input"
                    type="text"
                    {...registerCat('name')}
                    placeholder="e.g. Subscriptions, Groceries"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-input text-foreground text-xs"
                  />
                  {catErrors.name && <p className="text-[11px] font-semibold text-destructive mt-1">{catErrors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="cat-type-select" className="block font-bold mb-1">
                    Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="cat-type-select"
                    {...registerCat('type')}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-input text-foreground text-xs"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-end">
                <div>
                  <label htmlFor="cat-color-input" className="block font-bold mb-1">
                    Badge Color
                  </label>
                  <input
                    id="cat-color-input"
                    type="color"
                    {...registerCat('color')}
                    className="w-full h-9 rounded-xl bg-background border border-input p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isCatSubmitting}
                    className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {isCatSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </div>
            </form>

            {/* List of Existing Categories */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Existing Categories</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-card">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c.color || '#3B82F6' }} />
                      <span className="font-semibold text-xs text-foreground">{c.name}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {c.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenCategoryModal(c)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-border/80 hover:bg-muted text-foreground"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(c)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Delete Category Confirmation Dialog */}
      {deletingCategory && (
        <Dialog
          isOpen={Boolean(deletingCategory)}
          onClose={() => setDeletingCategory(null)}
          title="Delete Category?"
          description={`Are you sure you want to delete category "${deletingCategory.name}"?`}
          maxWidth="sm"
        >
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeletingCategory(null)}
              className="px-4 py-2 rounded-xl border border-border/80 text-foreground hover:bg-muted font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteCategory}
              className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90"
            >
              Delete
            </button>
          </div>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default TransactionsPage;
