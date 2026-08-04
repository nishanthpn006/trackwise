import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import useReports from '@/hooks/useReports';
import {
  AnalyticsCards,
  DateRangePicker,
  ExpensePieChart,
  IncomeExpenseBarChart,
  SpendingTrendChart,
  CashFlowChart,
  BudgetAnalytics,
  GoalAnalytics,
  TopCategories,
  FinancialInsights,
  ReportFilters,
  ExportDialog,
  MonthlyReportTab,
  YearlyReportTab,
} from '@/components/reports';
import { Download, RefreshCw, AlertTriangle, FileText, PieChart as PieChartIcon } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    summary,
    isLoading,
    isExporting,
    error,
    preset,
    setPreset,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    resetFilters,
    refetch,
    exportReport,
  } = useReports();

  const [activeTab, setActiveTab] = useState<'overview' | 'monthly' | 'yearly'>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  return (
    <PageContainer
      title="Reports & Financial Analytics"
      description="Gain deep insights into your cash flow, spending patterns, budgets, and savings goals with interactive visual analytics and export options."
    >
      <div className="space-y-6">
        {/* Top Header Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* View Tab Switches */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PieChartIcon className="w-4 h-4 text-primary" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('monthly')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'monthly'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Monthly Report</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('yearly')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'yearly'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Yearly Report</span>
            </button>
          </div>

          {/* Export & Refresh buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <DateRangePicker
          preset={preset}
          onPresetChange={setPreset}
          customStart={customStart}
          onCustomStartChange={setCustomStart}
          customEnd={customEnd}
          onCustomEndChange={setCustomEnd}
        />

        {/* Search & Category Filter Bar */}
        <ReportFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={summary?.categoryBreakdown || []}
          onReset={resetFilters}
        />

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-600">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-3 py-1 font-semibold border border-rose-500/40 rounded-lg hover:bg-rose-500/20"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 10 KPI Cards */}
            <AnalyticsCards summary={summary} isLoading={isLoading} />

            {/* Financial Insights Card */}
            <FinancialInsights insights={summary?.insights} isLoading={isLoading} />

            {/* Charts Grid Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeExpenseBarChart data={summary?.incomeVsExpenseTrend || []} isLoading={isLoading} />
              <ExpensePieChart data={summary?.categoryBreakdown || []} isLoading={isLoading} />
            </div>

            {/* Charts Grid Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingTrendChart data={summary?.spendingTrend || []} isLoading={isLoading} />
              <CashFlowChart data={summary?.cashFlowTrend || []} isLoading={isLoading} />
            </div>

            {/* Performance Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BudgetAnalytics data={summary?.budgetAnalytics} isLoading={isLoading} />
              <GoalAnalytics data={summary?.goalAnalytics} isLoading={isLoading} />
            </div>

            {/* Top Categories Ranked List */}
            <TopCategories categories={summary?.topCategories || []} isLoading={isLoading} />
          </div>
        )}

        {activeTab === 'monthly' && <MonthlyReportTab summary={summary} isLoading={isLoading} />}

        {activeTab === 'yearly' && <YearlyReportTab summary={summary} isLoading={isLoading} />}
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={exportReport}
        isExporting={isExporting}
      />
    </PageContainer>
  );
};

export default ReportsPage;
