import { useState, useCallback, useEffect } from 'react';
import notificationService from '@/services/notificationService';
import type { NotificationItem, NotificationFilters } from '@/types/notification';
import { parseApiError } from '@/services/api';
import { useToast } from './useToast';

export const useNotifications = (initialFilters?: NotificationFilters) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>(initialFilters || {});

  const toast = useToast();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(filters);
      const count = await notificationService.getUnreadCount();
      setNotifications(data);
      setUnreadCount(count);
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Polling unread count every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch {
        // Silent polling fail
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      setIsUpdating(true);
      try {
        const updated = await notificationService.markAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? updated : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        toast.info('Notification marked as read.');
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Failed to mark read: ${msg}`);
      } finally {
        setIsUpdating(false);
      }
    },
    [toast]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    setIsUpdating(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (err: unknown) {
      const msg = parseApiError(err);
      toast.error(`Failed to mark all read: ${msg}`);
    } finally {
      setIsUpdating(false);
    }
  }, [toast]);

  const handleDeleteNotification = useCallback(
    async (id: string) => {
      setIsUpdating(true);
      try {
        await notificationService.deleteNotification(id);
        const item = notifications.find((n) => n.id === id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (item && !item.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        toast.info('Notification removed.');
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Delete failed: ${msg}`);
      } finally {
        setIsUpdating(false);
      }
    },
    [notifications, toast]
  );

  const handleClearAll = useCallback(async () => {
    setIsUpdating(true);
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared.');
    } catch (err: unknown) {
      const msg = parseApiError(err);
      toast.error(`Clear failed: ${msg}`);
    } finally {
      setIsUpdating(false);
    }
  }, [toast]);

  const handleGenerateSummaries = useCallback(async () => {
    setIsUpdating(true);
    try {
      await notificationService.generateSummaries();
      toast.success('Generated monthly summary notification.');
      await fetchNotifications();
    } catch (err: unknown) {
      const msg = parseApiError(err);
      toast.error(`Generate summary failed: ${msg}`);
    } finally {
      setIsUpdating(false);
    }
  }, [fetchNotifications, toast]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isUpdating,
    error,
    filters,
    setFilters,
    refetch: fetchNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    clearAll: handleClearAll,
    generateSummaries: handleGenerateSummaries,
  };
};

export default useNotifications;
