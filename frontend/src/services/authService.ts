import api from './api';
import type { ApiResponse, AuthResponseData, LoginPayload, RegisterPayload, User } from '@/types/auth';

const TOKEN_KEY = 'trackwise_token';
const USER_KEY = 'trackwise_user';

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
    const authData = response.data.data;
    this.setSession(authData.token, authData.user);
    return authData;
  },

  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
    const authData = response.data.data;
    this.setSession(authData.token, authData.user);
    return authData;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    const user = response.data.data;
    this.setUser(user);
    return user;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  setSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getSavedUser(): User | null {
    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as User;
    } catch {
      return null;
    }
  },
};

export default authService;
