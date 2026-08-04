import { useState, useCallback, useEffect } from 'react';
import profileService from '@/services/profileService';
import type { User, UpdateProfileRequest } from '@/types/user';
import { parseApiError } from '@/services/api';

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err: unknown) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (payload: UpdateProfileRequest): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await profileService.updateProfile(payload);
      setProfile(updated);
      return updated;
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};

export default useProfile;
