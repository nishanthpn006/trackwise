import React, { useState, useCallback, useMemo } from 'react';
import { ToastContext, type ToastItem, type ToastType } from './ToastContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToasts((prev) => {
        if (prev.some((t) => t.message === message && t.type === type)) {
          return prev;
        }
        const id = Math.random().toString(36).substring(2, 9);
        setTimeout(() => {
          removeToast(id);
        }, 4000);
        return [...prev, { id, message, type }];
      });
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
    }),
    [toasts, showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
