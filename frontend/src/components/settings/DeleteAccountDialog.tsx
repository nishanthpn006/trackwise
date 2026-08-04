import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import { Trash2, AlertTriangle, Download, FileSpreadsheet, FileText, FileCode, Loader2, Lock } from 'lucide-react';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (password: string) => Promise<void>;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
  isSaving: boolean;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  onExport,
  isSaving,
}) => {
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password) {
      setErrorMsg('Password confirmation is required.');
      return;
    }

    try {
      await onConfirmDelete(password);
    } catch {
      // Error toast handled by parent hook
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-base font-bold text-foreground">Data Management & Account Removal</h3>
        <p className="text-xs text-muted-foreground">Download a complete copy of your financial data or permanently delete your account.</p>
      </div>

      {/* Export Section */}
      <div className="p-4 border border-border bg-muted/20 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Download className="w-4 h-4 text-primary" />
          <span>Export All Financial Data</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Download your transactions, categories, budgets, and goal progress in standard open formats.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => onExport('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-primary" />
            <span>CSV Format</span>
          </button>

          <button
            type="button"
            onClick={() => onExport('excel')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors text-emerald-600"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => onExport('pdf')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors text-rose-600"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>PDF Document</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="p-4 border border-rose-500/30 bg-rose-500/5 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone: Permanent Account Deletion</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Once deleted, your profile, transaction history, categories, budgets, and savings goals will be permanently erased.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete TrackWise Account</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm Account Deletion"
        description="This action is irreversible. Please enter your password to confirm."
        maxWidth="md"
      >
        <form onSubmit={handleDelete} className="space-y-4 py-2">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>All your data will be erased forever.</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="delete-confirm-password" className="block text-xs font-bold text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                id="delete-confirm-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={isSaving}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-medium border border-border rounded-xl hover:bg-muted text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !password}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>{isSaving ? 'Deleting Account...' : 'Permanently Delete'}</span>
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default DeleteAccountDialog;
