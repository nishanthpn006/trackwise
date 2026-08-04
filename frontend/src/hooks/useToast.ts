import { useContext } from 'react';
import { ToastContext, type ToastType } from '@/context/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    showToast: context.showToast,
    success: (msg: string) => context.showToast(msg, 'success'),
    error: (msg: string) => context.showToast(msg, 'error'),
    info: (msg: string) => context.showToast(msg, 'info'),
  };
};

export type { ToastType };
export default useToast;
