import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Public authentication endpoints that must NOT receive an Authorization header.
 * A stale/expired token sent to these endpoints can cause a 403 from Spring Security.
 */
const PUBLIC_AUTH_PATHS = ['/auth/register', '/auth/login'];

/**
 * api — Centralized Axios instance configured with base URL, timeout, headers, and interceptors.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Authorization header for protected endpoints only.
// Public auth endpoints (/auth/register, /auth/login) must never receive a JWT —
// a stale or expired token would cause Spring Security to return 403.
api.interceptors.request.use(
  (config) => {
    const url = config.url ?? '';
    const isPublicAuthEndpoint = PUBLIC_AUTH_PATHS.some((path) => url.endsWith(path));

    const token = localStorage.getItem('trackwise_token');

    if (token && config.headers && !isPublicAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized globally and dispatch custom session-expired event
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('trackwise_token');
      localStorage.removeItem('trackwise_user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('trackwise:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Parses unknown API errors into a human-readable string without exposing stack traces.
 */
export const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message as string;
    }
    if (error.response?.status === 400) {
      return 'Bad request. Please verify the submitted data.';
    }
    if (error.response?.status === 401) {
      return 'Session expired. Please log in again.';
    }
    if (error.response?.status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.response?.status === 409) {
      return 'Resource conflict. A record with this information already exists.';
    }
    if (error.response?.status === 422) {
      return 'Validation failed. Please check your form input values.';
    }
    if (error.response?.status === 500) {
      return 'Internal server error. Please try again later.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your network connection and try again.';
    }
    if (!error.response) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export default api;
