import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import CategoryForm, { type CategoryFormData } from '@/components/forms/CategoryForm';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/useToast';

export interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * AddCategoryDialog — Modal dialog component for creating new financial categories.
 */
export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createCategory } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await createCategory({
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
      });

      toast.success('Category Created Successfully');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Category creation failed';
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')) {
        setServerError('A category with this name already exists.');
      } else {
        setServerError('Failed to create category. Please check your inputs.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Category"
      description="Define a custom income or expense category to organize your finances."
    >
      <CategoryForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
        serverError={serverError}
      />
    </Dialog>
  );
};

export default AddCategoryDialog;
