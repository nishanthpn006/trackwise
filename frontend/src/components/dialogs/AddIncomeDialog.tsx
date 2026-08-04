import React from 'react';
import Dialog from '@/components/ui/Dialog';
import TransactionForm, { type TransactionFormData } from '@/components/forms/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/useToast';

export interface AddIncomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * AddIncomeDialog — Modal dialog component for recording new income transactions.
 */
export const AddIncomeDialog: React.FC<AddIncomeDialogProps> = ({
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
        type: 'INCOME',
        categoryId: data.categoryId || undefined,
        date: data.date,
        description: data.description || undefined,
      });

      toast.success('Income Added Successfully');
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
      title="Add Income"
      description="Record a new income stream or paycheck entry."
    >
      <TransactionForm
        type="INCOME"
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Dialog>
  );
};

export default AddIncomeDialog;
