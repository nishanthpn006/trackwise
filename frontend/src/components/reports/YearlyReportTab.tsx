import React from 'react';
import type { ReportSummary } from '@/types/report';
import { formatCurrency } from '@/utils/currency';

interface YearlyReportTabProps {
  summary: ReportSummary | null;
  isLoading?: boolean;
}

export const YearlyReportTab: React.FC<YearlyReportTabProps> = ({ summary, isLoading }) => {

  if (isLoading) {
    return (
      <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
    );
  }

  if (!summary || !summary.monthlyBreakdown || summary.monthlyBreakdown.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-xs">
        No yearly breakdown available.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Yearly Performance Matrix</h3>
          <p className="text-xs text-muted-foreground">Month-by-month financial stream audit</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
            <tr>
              <th className="p-3">Month</th>
              <th className="p-3 text-right">Income</th>
              <th className="p-3 text-right">Expenses</th>
              <th className="p-3 text-right">Net Savings</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {summary.monthlyBreakdown.map((row, idx) => {
              const isPositive = row.netCashFlow >= 0;
              return (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-semibold text-foreground">{row.label}</td>
                  <td className="p-3 text-right text-emerald-600 font-medium">{formatCurrency(row.income)}</td>
                  <td className="p-3 text-right text-rose-500 font-medium">{formatCurrency(row.expense)}</td>
                  <td className={`p-3 text-right font-bold ${isPositive ? 'text-indigo-600' : 'text-amber-500'}`}>
                    {formatCurrency(row.netCashFlow)}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                      }`}
                    >
                      {isPositive ? 'Surplus' : 'Deficit'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyReportTab;
