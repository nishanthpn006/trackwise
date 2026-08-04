import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import useDataManagement from '@/hooks/useDataManagement';
import { ExportPanel, ImportPanel } from '@/components/data';
import { Download, Upload } from 'lucide-react';

export const ImportExportPage: React.FC = () => {
  const {
    isExporting,
    isImporting,
    importResult,
    exportData,
    importData,
    clearImportResult,
  } = useDataManagement();

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

  return (
    <PageContainer
      title="Import / Export & Data Backup"
      description="Download complete copies of your financial records or bulk import transactions from CSV files."
    >
      <div className="space-y-6">
        {/* Top Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'export'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export & Backup</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'import'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'export' && (
          <ExportPanel onExport={exportData} isExporting={isExporting} />
        )}

        {activeTab === 'import' && (
          <ImportPanel
            onImport={importData}
            isImporting={isImporting}
            importResult={importResult}
            onClearResult={clearImportResult}
            onDownloadTemplate={() => exportData('template')}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default ImportExportPage;
