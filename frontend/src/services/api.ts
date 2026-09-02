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
 * Parses unknown API errors into contextual, human-readable strings.
 * Never exposes raw stack traces, internal exception messages, or Spring bean errors.
 *
 * Priority order:
 * 1. Backend-supplied message when it is safe and short
 * 2. HTTP status-specific contextual string
 * 3. Network condition (no response from server — backend down or ECONNREFUSED)
 * 4. Generic fallback
 */
export const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // ── Server responded with an HTTP error status ─────────────────────────
    if (error.response) {
      const serverMsg = error.response.data?.message as string | undefined;
      const isSafeMessage =
        serverMsg &&
        typeof serverMsg === 'string' &&
        serverMsg.length < 250 &&
        !serverMsg.includes('Exception') &&
        !serverMsg.includes('at com.') &&
        !serverMsg.includes('java.');

      if (isSafeMessage) {
        return serverMsg;
      }

      switch (error.response.status) {
        case 400:
          return 'Please check your form data and try again.';
        case 401:
          return 'Authentication failed. Please check your credentials.';
        case 403:
          return 'Access denied. You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'An account with this email already exists.';
        case 422:
          return 'Validation failed. Please check your input and try again.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
        case 502:
        case 503:
          return 'Something went wrong on the server. Please try again.';
        default:
          return `Request failed (${error.response.status}). Please try again.`;
      }
    }

    // ── Request timed out ─────────────────────────────────────────────────
    if (error.code === 'ECONNABORTED') {
      return 'The TrackWise server is taking too long to respond. Please try again.';
    }

    // ── No response received — backend unreachable (ECONNREFUSED / ERR_NETWORK) ──
    if (!error.response) {
      return 'Unable to reach the TrackWise server. Please try again in a moment.';
    }
  }

  if (error instanceof Error) {
    if (!error.message.includes('at ') && error.message.length < 200) {
      return error.message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

export default api;
