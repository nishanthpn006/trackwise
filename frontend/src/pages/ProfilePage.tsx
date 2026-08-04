import { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import useProfile from '@/hooks/useProfile';
import useToast from '@/hooks/useToast';
import { User, Shield, Check, Loader2 } from 'lucide-react';

export const ProfilePage = () => {
  const { profile, isLoading, error, refetch, updateProfile } = useProfile();
  const toast = useToast();

  const [fullName, setFullName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  if (profile && !isInitialized) {
    setFullName(profile.fullName || '');
    setIsInitialized(true);
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSaving(true);
    try {
      await updateProfile({ fullName: fullName.trim() });
      toast.success('Your account profile details have been saved.');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer title="Account Profile" description="Manage your user account preferences and security">
      <div className="max-w-3xl mx-auto space-y-6">
        {isLoading ? (
          <div className="py-16 flex justify-center items-center">
            <Loading text="Loading profile details..." />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to Load Profile"
            message={error}
            onRetry={refetch}
            isRetrying={isLoading}
          />
        ) : !profile ? (
          <EmptyState
            icon={<User className="h-10 w-10 text-muted-foreground/60" />}
            title="No profile information available"
            description="Unable to load user account details."
            action={{
              label: 'Retry Fetching',
              onClick: refetch,
            }}
          />
        ) : (
          <div className="bg-card border border-border/80 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border/40">
              <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xl uppercase">
                {profile.fullName?.slice(0, 2) || 'US'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{profile.fullName}</h2>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
                <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted text-muted-foreground border">
                  <Shield className="h-3 w-3 text-primary" />
                  <span>{profile.role || 'ROLE_USER'}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="profile-fullname" className="block text-xs font-bold text-foreground">
                  Full Name
                </label>
                <input
                  id="profile-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border/80 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-email" className="block text-xs font-bold text-foreground">
                  Email Address <span className="text-muted-foreground font-normal">(Read-only)</span>
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-muted-foreground text-xs cursor-not-allowed"
                />
              </div>

              <div className="pt-3 border-t border-border/40 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving || !fullName.trim() || fullName === profile.fullName}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
