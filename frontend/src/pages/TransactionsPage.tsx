import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PageContainer from '@/components/common/PageContainer';
import Loading from '@/components/common/Loading';
import categoryService from '@/services/categoryService';
import transactionService from '@/services/transactionService';
import type { Category, PagedResponse, Transaction, TransactionType } from '@/types/transaction';
import {
  categorySchema,
  transactionSchema,
  type CategoryFormData,
  type TransactionFormData,
} from '@/utils/validation';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<PagedResponse<Transaction> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Modal States
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Transaction Form
  const {
    register: registerTx,
    handleSubmit: handleSubmitTx,
    reset: resetTx,
    setValue: setTxValue,
    formState: { errors: txErrors, isSubmitting: isTxSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'EXPENSE',
    },
  });

  // Category Form
  const {
    register: registerCat,
    handleSubmit: handleSubmitCat,
    reset: resetCat,
    formState: { errors: catErrors, isSubmitting: isCatSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: 'EXPENSE',
      color: '#3B82F6',
    },
  });

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch {
      // Handled silently
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await transactionService.getTransactions({
        search: search || undefined,
        categoryId: selectedCategory || undefined,
        type: (selectedType as TransactionType) || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        size: 10,
        sortBy,
        sortDir,
      });
      setTransactions(data);
    } catch {
      setErrorMessage('Failed to load transactions.');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, selectedType, startDate, endDate, page, sortBy, sortDir]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Handlers for Transaction Create/Edit
  const handleOpenAddTx = () => {
    setEditingTx(null);
    resetTx({
      title: '',
      amount: 0,
      type: 'EXPENSE',
      categoryId: categories.length > 0 ? categories[0].id : '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setIsTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    resetTx({
      title: tx.title,
      amount: tx.amount,
      type: tx.type,
      categoryId: tx.category?.id || '',
      date: tx.date,
      description: tx.description || '',
    });
    setIsTxModalOpen(true);
  };

  const onSubmitTx = async (data: TransactionFormData) => {
    try {
      if (editingTx) {
        await transactionService.updateTransaction(editingTx.id, {
          title: data.title,
          amount: data.amount,
          type: data.type,
          categoryId: data.categoryId || undefined,
          date: data.date,
          description: data.description || undefined,
        });
        showNotification('Transaction updated successfully');
      } else {
        await transactionService.createTransaction({
          title: data.title,
          amount: data.amount,
          type: data.type,
          categoryId: data.categoryId || undefined,
          date: data.date,
          description: data.description || undefined,
        });
        showNotification('Transaction added successfully');
      }
      setIsTxModalOpen(false);
      fetchTransactions();
    } catch {
      setErrorMessage('Failed to save transaction.');
    }
  };

  const handleDeleteTx = async () => {
    if (!deletingTx) return;
    try {
      await transactionService.deleteTransaction(deletingTx.id);
      showNotification('Transaction deleted successfully');
      setDeletingTx(null);
      fetchTransactions();
    } catch {
      setErrorMessage('Failed to delete transaction.');
    }
  };

  // Handlers for Category Management
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      resetCat({
        name: cat.name,
        type: cat.type,
        icon: cat.icon || '',
        color: cat.color || '#3B82F6',
      });
    } else {
      setEditingCategory(null);
      resetCat({
        name: '',
        type: 'EXPENSE',
        icon: 'tag',
        color: '#3B82F6',
      });
    }
    setIsCategoryModalOpen(true);
  };

  const onSubmitCategory = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, data);
        showNotification('Category updated successfully');
      } else {
        await categoryService.createCategory(data);
        showNotification('Category created successfully');
      }
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
        setErrorMessage(msg || 'Failed to save category.');
      } else {
        setErrorMessage('Failed to save category.');
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    try {
      await categoryService.deleteCategory(deletingCategory.id);
      showNotification('Category deleted successfully');
      setDeletingCategory(null);
      fetchCategories();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
        setErrorMessage(msg || 'Failed to delete category.');
      } else {
        setErrorMessage('Failed to delete category.');
      }
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  return (
    <PageContainer className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">Manage your income and expenses with real-time filters</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenCategoryModal()}
            className="px-3 py-2 text-xs font-medium border border-border rounded-lg bg-card text-foreground hover:bg-secondary transition-colors"
          >
            Manage Categories
          </button>
          <button
            onClick={handleOpenAddTx}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg shadow hover:bg-primary/90 transition-colors"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm border border-emerald-500/20">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
          {errorMessage}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                setSortBy(sb);
                setSortDir(sd as 'asc' | 'desc');
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="title-asc">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Date Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Date Range:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
            className="px-2 py-1 border border-input rounded bg-background text-foreground text-xs"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
            className="px-2 py-1 border border-input rounded bg-background text-foreground text-xs"
          />
          {(startDate || endDate || search || selectedCategory || selectedType) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
                setSelectedType('');
                setStartDate('');
                setEndDate('');
                setPage(0);
              }}
              className="text-xs font-medium text-primary hover:underline ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Transaction Table & UI States */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex justify-center items-center">
            <Loading />
          </div>
        ) : !transactions || transactions.content.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-base font-semibold text-foreground">No transactions found</p>
            <p className="text-sm text-muted-foreground">Try clearing your filters or add a new transaction.</p>
            <button
              onClick={handleOpenAddTx}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90"
            >
              + Add Transaction
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground border-b border-border bg-muted/40">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.content.map((tx: Transaction) => (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-xs">{tx.date}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{tx.title}</p>
                        {tx.description && <p className="text-xs text-muted-foreground line-clamp-1">{tx.description}</p>}
                      </td>
                      <td className="py-3 px-4">
                        {tx.category ? (
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                            style={{
                              borderColor: tx.category.color || '#94A3B8',
                              color: tx.category.color || '#64748B',
                            }}
                          >
                            {tx.category.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">Uncategorized</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            tx.type === 'INCOME'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold whitespace-nowrap ${
                          tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditTx(tx)}
                          className="px-2.5 py-1 text-xs font-medium rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingTx(tx)}
                          className="px-2.5 py-1 text-xs font-medium rounded border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
              <div>
                Showing Page {transactions.page + 1} of {transactions.totalPages || 1} ({transactions.totalElements} total items)
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={transactions.page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-3 py-1.5 rounded border border-border bg-card text-foreground disabled:opacity-40 hover:bg-secondary"
                >
                  Previous
                </button>
                <button
                  disabled={transactions.last}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded border border-border bg-card text-foreground disabled:opacity-40 hover:bg-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              {editingTx ? 'Edit Transaction' : 'Add Transaction'}
            </h2>

            <form onSubmit={handleSubmitTx(onSubmitTx)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <input
                  type="text"
                  {...registerTx('title')}
                  placeholder="e.g. Grocery Shopping"
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                />
                {txErrors.title && <p className="text-xs text-destructive mt-1">{txErrors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...registerTx('amount', { valueAsNumber: true })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                  />
                  {txErrors.amount && <p className="text-xs text-destructive mt-1">{txErrors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Type</label>
                  <select
                    {...registerTx('type')}
                    onChange={(e) => {
                      setTxValue('type', e.target.value as TransactionType);
                    }}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <select
                    {...registerTx('categoryId')}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Date</label>
                  <input
                    type="date"
                    {...registerTx('date')}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                  />
                  {txErrors.date && <p className="text-xs text-destructive mt-1">{txErrors.date.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Description (Optional)</label>
                <textarea
                  {...registerTx('description')}
                  rows={2}
                  placeholder="Notes..."
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTxSubmitting}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {isTxSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Transaction Modal */}
      {deletingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Confirm Delete</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete transaction &quot;{deletingTx.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingTx(null)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTx}
                className="px-4 py-2 bg-destructive text-destructive-foreground text-xs font-medium rounded-lg hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground">
                {editingCategory ? 'Edit Category' : 'Categories Management'}
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Category Form */}
            <form onSubmit={handleSubmitCat(onSubmitCategory)} className="p-4 border border-border rounded-lg bg-muted/20 space-y-3">
              <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                {editingCategory ? 'Update Category' : 'Create New Category'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Name</label>
                  <input
                    type="text"
                    {...registerCat('name')}
                    placeholder="e.g. Subscriptions"
                    className="w-full px-3 py-1.5 border border-input rounded-lg bg-background text-xs"
                  />
                  {catErrors.name && <p className="text-xs text-destructive mt-1">{catErrors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Type</label>
                  <select
                    {...registerCat('type')}
                    className="w-full px-3 py-1.5 border border-input rounded-lg bg-background text-xs"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Color (Hex)</label>
                  <input
                    type="color"
                    {...registerCat('color')}
                    className="w-full h-8 border border-input rounded-lg bg-background p-1 cursor-pointer"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isCatSubmitting}
                    className="w-full py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isCatSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Add Category'}
                  </button>
                </div>
              </div>
            </form>

            {/* Existing Categories List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Existing Categories</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <div key={c.id} className="flex justify-between items-center p-2.5 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color || '#3B82F6' }} />
                      <span className="text-xs font-medium text-foreground">{c.name}</span>
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {c.type}
                      </span>
                    </div>
                    <div className="space-x-1">
                      <button
                        onClick={() => handleOpenCategoryModal(c)}
                        className="px-2 py-0.5 text-[11px] font-medium rounded border border-border hover:bg-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingCategory(c)}
                        className="px-2 py-0.5 text-[11px] font-medium rounded border border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Delete Category</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete category &quot;{deletingCategory.name}&quot;?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 bg-destructive text-destructive-foreground text-xs font-medium rounded-lg hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default TransactionsPage;
