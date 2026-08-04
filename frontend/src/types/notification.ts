export type NotificationType =
  | 'BUDGET_ALERT'
  | 'GOAL_MILESTONE'
  | 'GOAL_COMPLETED'
  | 'GOAL_ACHIEVED'
  | 'GOAL_OVERDUE'
  | 'OVERSPENDING_ALERT'
  | 'MONTHLY_SUMMARY'
  | 'WEEKLY_SUMMARY'
  | 'SECURITY_ALERT'
  | 'SYSTEM_NOTIFICATION'
  | 'TRANSACTION_SUCCESS'
  | 'CATEGORY_UPDATE';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationSummary {
  totalCount: number;
  unreadCount: number;
  notifications: NotificationItem[];
}

export interface NotificationFilters {
  search?: string;
  unreadOnly?: boolean;
  type?: string;
  priority?: NotificationPriority | 'ALL';
  sortBy?: 'newest' | 'oldest';
}
