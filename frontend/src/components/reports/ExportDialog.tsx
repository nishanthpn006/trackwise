import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import { Download, FileSpreadsheet, FileText, FileCode, Loader2 } from 'lucide-react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => Promise<void>;
  isExporting: boolean;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  isExporting,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');

  const handleConfirm = async () => {
    await onExport(selectedFormat);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Export Financial Report"
      description="Download your full analytics data in your preferred format."
      maxWidth="md"
    >
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSelectedFormat('csv')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center ${
              selectedFormat === 'csv'
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FileCode className="w-6 h-6 mb-2" />
            <span className="text-xs">CSV File</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('excel')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center ${
              selectedFormat === 'excel'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-semibold'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FileSpreadsheet className="w-6 h-6 mb-2" />
            <span className="text-xs">Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('pdf')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center ${
              selectedFormat === 'pdf'
                ? 'border-rose-500 bg-rose-500/10 text-rose-600 font-semibold'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FileText className="w-6 h-6 mb-2" />
            <span className="text-xs">PDF Document</span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-xs"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Generating Report...' : 'Download Report'}</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ExportDialog;
