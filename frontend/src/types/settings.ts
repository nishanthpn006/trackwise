export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  currency: string;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: string;
  numberFormat: string;
  language: string;
  theme: ThemeMode;
}

export interface UserNotifications {
  budgetAlerts: boolean;
  goalAlerts: boolean;
  monthlySummary: boolean;
  weeklySummary: boolean;
  securityAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  currency?: string;
  timezone?: string;
  bio?: string;
  avatarUrl?: string;
  lastLoginAt?: string;
  passwordChangedAt?: string;
  preferences: UserPreferences;
  notifications: UserNotifications;
  createdAt: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  currency?: string;
  timezone?: string;
  bio?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserStatistics {
  transactionsCount: number;
  categoriesCount: number;
  budgetsCount: number;
  goalsCount: number;
  reportsCount: number;
  memberSince: string;
}
