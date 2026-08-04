import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, FileText, Loader2, ArrowRight } from 'lucide-react';
import type { ImportResult } from '@/types/data';

interface ImportPanelProps {
  onImport: (file: File) => Promise<void>;
  isImporting: boolean;
  importResult: ImportResult | null;
  onClearResult: () => void;
  onDownloadTemplate: () => void;
}

export const ImportPanel: React.FC<ImportPanelProps> = ({
  onImport,
  isImporting,
  importResult,
  onClearResult,
  onDownloadTemplate,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      onClearResult();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      await onImport(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions header */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Upload className="w-5 h-5" />
            <h2>Import Transactions from CSV</h2>
          </div>
          <button
            type="button"
            onClick={onDownloadTemplate}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download CSV Template</span>
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Upload a CSV file containing your transactions. Ensure the headers include: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">Date</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">Title</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">Type</code>, and <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">Amount</code>.
        </p>
      </div>

      {/* Upload Zone */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : selectedFile
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-border bg-card hover:border-primary/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedFile ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
              {selectedFile ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB — Click or drag to replace
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground">Only standard CSV files (.csv) are supported</p>
              </div>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                onClearResult();
              }}
              disabled={isImporting}
              className="px-4 py-2 text-xs font-semibold border border-border rounded-xl hover:bg-muted text-muted-foreground"
            >
              Clear Selection
            </button>
            <button
              type="submit"
              disabled={isImporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50"
            >
              {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{isImporting ? 'Processing Import...' : 'Import Transactions'}</span>
            </button>
          </div>
        )}
      </form>

      {/* Results Summary */}
      {importResult && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Import Results Summary</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-muted/30 border border-border text-center space-y-0.5">
              <span className="text-xs text-muted-foreground">Total Rows</span>
              <p className="text-lg font-bold text-foreground">{importResult.totalRows}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-0.5">
              <span className="text-xs text-emerald-600 font-semibold">Imported</span>
              <p className="text-lg font-bold text-emerald-600">{importResult.importedCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-0.5">
              <span className="text-xs text-amber-600 font-semibold">Skipped</span>
              <p className="text-lg font-bold text-amber-600">{importResult.skippedCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center space-y-0.5">
              <span className="text-xs text-rose-600 font-semibold">Errors</span>
              <p className="text-lg font-bold text-rose-600">{importResult.errorCount}</p>
            </div>
          </div>

          {/* Error log if present */}
          {importResult.errors && importResult.errors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <AlertCircle className="w-4 h-4" />
                <span>Import Errors & Skipped Rows</span>
              </div>
              <div className="max-h-40 overflow-y-auto p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 font-mono text-[11px] text-rose-600 space-y-1">
                {importResult.errors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportPanel;
