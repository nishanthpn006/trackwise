import { useState, useCallback } from 'react';
import dataService from '@/services/dataService';
import type { ImportResult, ExportFormat } from '@/types/data';
import { parseApiError } from '@/services/api';
import { useToast } from './useToast';

export const useDataManagement = () => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toast = useToast();

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setIsExporting(true);
      try {
        let blob: Blob;
        let filename: string;

        if (format === 'transactions') {
          blob = await dataService.exportTransactions();
          filename = `TrackWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
        } else if (format === 'backup') {
          blob = await dataService.exportFullBackup();
          filename = `TrackWise_Full_Backup_${new Date().toISOString().split('T')[0]}.csv`;
        } else {
          blob = await dataService.downloadTemplate();
          filename = 'TrackWise_Import_Template.csv';
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(
          format === 'template'
            ? 'CSV Template downloaded successfully.'
            : 'File exported successfully!'
        );
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Export failed: ${msg}`);
      } finally {
        setIsExporting(false);
      }
    },
    [toast]
  );

  const handleImport = useCallback(
    async (file: File) => {
      if (!file) return;
      setIsImporting(true);
      setImportResult(null);

      try {
        const result = await dataService.importTransactions(file);
        setImportResult(result);
        if (result.importedCount > 0) {
          toast.success(`Successfully imported ${result.importedCount} transaction(s)!`);
        } else if (result.errorCount > 0) {
          toast.error(`Import completed with ${result.errorCount} error(s).`);
        } else {
          toast.info('No new transactions were found to import.');
        }
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Import failed: ${msg}`);
      } finally {
        setIsImporting(false);
      }
    },
    [toast]
  );

  const clearImportResult = useCallback(() => {
    setImportResult(null);
    setSelectedFile(null);
  }, []);

  return {
    isExporting,
    isImporting,
    importResult,
    selectedFile,
    setSelectedFile,
    exportData: handleExport,
    importData: handleImport,
    clearImportResult,
  };
};

export default useDataManagement;
