import { useContext, useMemo } from 'react';
import { ToastContext, type ToastType } from '@/context/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { showToast } = context;

  return useMemo(
    () => ({
      showToast,
      success: (msg: string) => showToast(msg, 'success'),
      error: (msg: string) => showToast(msg, 'error'),
      info: (msg: string) => showToast(msg, 'info'),
    }),
    [showToast]
  );
};

export type { ToastType };
export default useToast;
