export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | string;

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface UserProfile extends User {
  avatarUrl?: string;
  currency?: string;
  timezone?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  currency?: string;
  timezone?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
