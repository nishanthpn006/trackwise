import React from 'react';
import { Download, FileSpreadsheet, Database, FileCode, Loader2, ShieldCheck, HelpCircle } from 'lucide-react';
import type { ExportFormat } from '@/types/data';

interface ExportPanelProps {
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ onExport, isExporting }) => {
  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Download className="w-5 h-5" />
          <h2>Export & Data Backup</h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Download your complete TrackWise financial dataset for external analysis, offline backup, or seamless migration to other tools.
        </p>
      </div>

      {/* Export Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Transactions CSV */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Transactions CSV</h3>
            <p className="text-xs text-muted-foreground">
              Export all your income and expense records with dates, amounts, categories, and descriptions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onExport('transactions')}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export CSV</span>
          </button>
        </div>

        {/* Card 2: Full Data Backup */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Full Account Backup</h3>
            <p className="text-xs text-muted-foreground">
              Download a complete archive containing transactions, categories, budgets, and savings goals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onExport('backup')}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Export Full Backup</span>
          </button>
        </div>

        {/* Card 3: Import Template */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-sky-500/40 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Sample Import Template</h3>
            <p className="text-xs text-muted-foreground">
              Download a sample CSV template with pre-filled headers to prepare your data for batch import.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onExport('template')}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-muted transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Get CSV Template</span>
          </button>
        </div>
      </div>

      {/* Security & Format Note */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-start gap-3 text-xs text-muted-foreground">
        <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-foreground">Data Privacy & Encryption</span>
          <p>
            Exported CSV files contain raw financial details. Store backup files securely and do not share them publicly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
