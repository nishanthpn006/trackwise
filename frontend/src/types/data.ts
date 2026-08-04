export interface ImportResult {
  totalRows: number;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: string[];
}

export type ExportFormat = 'transactions' | 'backup' | 'template' | 'csv';

