import type { ApiResponse } from './api';
import type { User } from './user';

export type { ApiResponse, User };

export interface AuthResponseData {
  token: string;
  tokenType: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}
