import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import useSettings from '@/hooks/useSettings';
import {
  ProfileForm,
  PasswordDialog,
  AvatarUploader,
  AppearanceSettings,
  PreferenceSettings,
  NotificationSettings,
  SecurityPanel,
  AccountStatistics,
  DeleteAccountDialog,
} from '@/components/settings';
import { User, Palette, Sliders, Bell, Shield, Database, AlertTriangle, Loader2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    profile,
    statistics,
    theme,
    isLoading,
    isSaving,
    error,
    refetch,
    updateProfile,
    updatePassword,
    updatePreferences,
    updateNotifications,
    updateAvatar,
    deleteAvatar,
    setTheme,
    exportData,
    deleteAccount,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'preferences' | 'notifications' | 'security' | 'data'>('profile');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const tabs: { id: typeof activeTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Usage', icon: Shield },
    { id: 'data', label: 'Data & Removal', icon: Database },
  ];

  return (
    <PageContainer
      title="Settings & Preferences"
      description="Manage your user profile, security credentials, appearance themes, and notification preferences."
    >
      <div className="space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-600">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-3 py-1 font-semibold border border-rose-500/40 rounded-lg hover:bg-rose-500/20"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-muted-foreground text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Loading user settings...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-2 shadow-xs space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === 'profile' && (
                <>
                  <AvatarUploader
                    profile={profile}
                    onUpload={updateAvatar}
                    onRemove={deleteAvatar}
                    isSaving={isSaving}
                  />
                  <ProfileForm profile={profile} onSave={updateProfile} isSaving={isSaving} />
                </>
              )}

              {activeTab === 'appearance' && (
                <AppearanceSettings
                  currentTheme={theme}
                  onThemeChange={(newTheme) => {
                    setTheme(newTheme);
                    updatePreferences({ theme: newTheme });
                  }}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'preferences' && (
                <PreferenceSettings
                  preferences={profile?.preferences}
                  onSave={updatePreferences}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationSettings
                  notifications={profile?.notifications}
                  onSave={updateNotifications}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'security' && (
                <>
                  <SecurityPanel
                    profile={profile}
                    onChangePasswordClick={() => setIsPasswordModalOpen(true)}
                  />
                  <AccountStatistics statistics={statistics} isLoading={isLoading} />
                </>
              )}

              {activeTab === 'data' && (
                <DeleteAccountDialog
                  isOpen={isDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                  onConfirmDelete={deleteAccount}
                  onExport={exportData}
                  isSaving={isSaving}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Password Change Dialog */}
      <PasswordDialog
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={updatePassword}
        isSaving={isSaving}
      />
    </PageContainer>
  );
};

export default SettingsPage;
