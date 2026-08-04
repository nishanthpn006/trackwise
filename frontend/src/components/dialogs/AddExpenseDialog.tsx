import React from 'react';
import Dialog from '@/components/ui/Dialog';
import TransactionForm, { type TransactionFormData } from '@/components/forms/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/useToast';

export interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * AddExpenseDialog — Modal dialog component for recording new expense transactions.
 */
export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createTransaction, isSubmitting } = useTransactions();
  const toast = useToast();

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      await createTransaction({
        title: data.title,
        amount: data.amount,
        type: 'EXPENSE',
        categoryId: data.categoryId || undefined,
        date: data.date,
        description: data.description || undefined,
      });

      toast.success('Expense Added Successfully');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Transaction Failed';
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Expense"
      description="Log a new personal spending entry or purchase."
    >
      <TransactionForm
        type="EXPENSE"
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Dialog>
  );
};

export default AddExpenseDialog;
