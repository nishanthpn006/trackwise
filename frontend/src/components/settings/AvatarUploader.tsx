import React, { useRef } from 'react';
import type { UserProfileData } from '@/types/settings';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface AvatarUploaderProps {
  profile: UserProfileData | null;
  onUpload: (avatarUrl: string) => Promise<void>;
  onRemove: () => Promise<void>;
  isSaving: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  profile,
  onUpload,
  onRemove,
  isSaving,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPEG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64 = evt.target?.result as string;
      if (base64) {
        await onUpload(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!profile) return null;

  const initials = profile.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'US';

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
      <div className="relative group shrink-0">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-sm"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-primary font-bold text-2xl uppercase shadow-xs">
            {initials}
          </div>
        )}
      </div>

      <div className="space-y-2 text-center sm:text-left flex-1">
        <h3 className="text-base font-bold text-foreground">Profile Avatar</h3>
        <p className="text-xs text-muted-foreground">
          Supports PNG, JPEG, or WebP formats under 2MB. Updated across your dashboard.
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{profile.avatarUrl ? 'Replace Photo' : 'Upload Photo'}</span>
          </button>

          {profile.avatarUrl && (
            <button
              type="button"
              onClick={onRemove}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/30 text-rose-600 font-semibold text-xs hover:bg-rose-500/10 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUploader;
