import { useState, useCallback, useEffect } from 'react';
import settingsService from '@/services/settingsService';
import type {
  UserProfileData,
  UpdateProfilePayload,
  UpdatePasswordPayload,
  UserPreferences,
  UserNotifications,
  UserStatistics,
} from '@/types/settings';
import { parseApiError } from '@/services/api';
import { useToast } from './useToast';
import { useTheme } from './useTheme';

export const useSettings = () => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  // Delegate all theme DOM/localStorage management to ThemeContext
  const { setTheme } = useTheme();

  const fetchProfileAndStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profData, statsData] = await Promise.all([
        settingsService.getProfile(),
        settingsService.getStatistics().catch(() => null),
      ]);
      setProfile(profData);
      setStatistics(statsData);
      // Sync server-stored theme preference via ThemeContext
      if (profData?.preferences?.theme) {
        setTheme(profData.preferences.theme);
      }
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setError(msg);
      toast.error('Failed to load profile settings.');
    } finally {
      setIsLoading(false);
    }
  }, [setTheme, toast]);

  useEffect(() => {
    fetchProfileAndStats();
  }, [fetchProfileAndStats]);

  const handleUpdateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      setIsSaving(true);
      try {
        const updated = await settingsService.updateProfile(payload);
        setProfile(updated);
        toast.success('Profile details saved successfully.');
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Update failed: ${msg}`);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [toast]
  );

  const handleUpdatePassword = useCallback(
    async (payload: UpdatePasswordPayload) => {
      setIsSaving(true);
      try {
        await settingsService.updatePassword(payload);
        toast.success('Password changed successfully.');
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Password update failed: ${msg}`);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [toast]
  );

  const handleUpdatePreferences = useCallback(
    async (payload: Partial<UserPreferences>) => {
      setIsSaving(true);
      try {
        const updated = await settingsService.updatePreferences(payload);
        setProfile(updated);
        // Theme is already applied by ThemeContext before this API call
        toast.success('Preferences saved.');
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Preferences update failed: ${msg}`);
      } finally {
        setIsSaving(false);
      }
    },
    [toast]
  );

  const handleUpdateNotifications = useCallback(
    async (payload: Partial<UserNotifications>) => {
      setIsSaving(true);
      try {
        const updated = await settingsService.updateNotifications(payload);
        setProfile(updated);
        toast.success('Notification settings saved.');
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Notification update failed: ${msg}`);
      } finally {
        setIsSaving(false);
      }
    },
    [toast]
  );

  const handleUpdateAvatar = useCallback(
    async (avatarUrl: string) => {
      setIsSaving(true);
      try {
        const updated = await settingsService.updateAvatar(avatarUrl);
        setProfile(updated);
        toast.success('Avatar updated successfully.');
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Avatar upload failed: ${msg}`);
      } finally {
        setIsSaving(false);
      }
    },
    [toast]
  );

  const handleDeleteAvatar = useCallback(async () => {
    setIsSaving(true);
    try {
      const updated = await settingsService.deleteAvatar();
      setProfile(updated);
      toast.success('Avatar removed.');
    } catch (err: unknown) {
      const msg = parseApiError(err);
      toast.error(`Remove avatar failed: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const handleExportData = useCallback(
    async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
      try {
        const blob = await settingsService.exportPersonalData(format);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TrackWise_Data_Export.${format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Data exported cleanly as ${format.toUpperCase()}!`);
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Export failed: ${msg}`);
      }
    },
    [toast]
  );

  const handleDeleteAccount = useCallback(
    async (password: string) => {
      setIsSaving(true);
      try {
        await settingsService.deleteAccount(password);
        toast.success('Your account has been deleted.');
        window.location.href = '/login';
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Delete account failed: ${msg}`);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [toast]
  );

  return {
    profile,
    statistics,
    isLoading,
    isSaving,
    error,
    refetch: fetchProfileAndStats,
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,
    updatePreferences: handleUpdatePreferences,
    updateNotifications: handleUpdateNotifications,
    updateAvatar: handleUpdateAvatar,
    deleteAvatar: handleDeleteAvatar,
    exportData: handleExportData,
    deleteAccount: handleDeleteAccount,
  };
};

export default useSettings;
