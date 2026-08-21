/**
 * MindfulLoop Centralized API Client
 * 
 * Provides unified HTTP request orchestration for all REST endpoints.
 * Configured via VITE_API_URL environment variable with robust error handling for:
 * - Loading & async states
 * - Success payloads
 * - Validation errors (HTTP 400, 422)
 * - Authentication errors (HTTP 401, 403)
 * - Server errors (HTTP 500+)
 * - Network failures (Offline, CORS, Failed to fetch)
 */

export interface ApiErrorDetails {
  status: number;
  statusText: string;
  message: string;
  data?: any;
  validationErrors?: Record<string, string | string[]>;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
  isServerError: boolean;
}

export class ApiError extends Error implements ApiErrorDetails {
  status: number;
  statusText: string;
  data?: any;
  validationErrors?: Record<string, string | string[]>;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
  isServerError: boolean;

  constructor(details: Partial<ApiErrorDetails> & { message: string }) {
    super(details.message);
    this.name = 'ApiError';
    this.status = details.status ?? 0;
    this.statusText = details.statusText ?? '';
    this.data = details.data;
    this.validationErrors = details.validationErrors;
    this.isNetworkError = details.isNetworkError ?? (this.status === 0);
    this.isAuthError = details.isAuthError ?? (this.status === 401 || this.status === 403);
    this.isValidationError = details.isValidationError ?? (this.status === 400 || this.status === 422);
    this.isServerError = details.isServerError ?? (this.status >= 500);

    // Maintain prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  skipAuth?: boolean;
}

class ApiClient {
  /**
   * Retrieves the configured backend base URL from environment variable VITE_API_URL.
   * Defaults to '/api' for same-origin proxy setups.
   */
  getBaseUrl(): string {
    const envUrl = (import.meta as any)?.env?.VITE_API_URL;
    if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
      return envUrl.trim().replace(/\/+$/, '');
    }
    return '/api';
  }

  /**
   * Resolves full endpoint URL correctly avoiding duplicate or missing slashes and paths.
   */
  resolveUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return this.appendQueryParams(endpoint, params);
    }

    const baseUrl = this.getBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    let fullUrl = '';
    // Prevent duplicate /api/api
    if (baseUrl.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      fullUrl = `${baseUrl}${cleanEndpoint.slice(4)}`;
    } else if (baseUrl.endsWith('/api') && cleanEndpoint === '/api') {
      fullUrl = baseUrl;
    } else {
      fullUrl = `${baseUrl}${cleanEndpoint}`;
    }

    return this.appendQueryParams(fullUrl, params);
  }

  private appendQueryParams(url: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (!queryString) return url;

    return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
  }

  /**
   * Extracts stored auth token if available.
   */
  getStoredAuthToken(): string | null {
    try {
      const sessionStr = localStorage.getItem('mindfulloop_auth_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session && session.token) {
          return session.token;
        }
      }
      return localStorage.getItem('token') || localStorage.getItem('mindfulloop_token');
    } catch {
      return null;
    }
  }

  /**
   * Core request execution pipeline with typed responses and error normalization.
   */
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      body,
      params,
      headers: customHeaders = {},
      timeoutMs = 15000,
      skipAuth = false,
      ...customOptions
    } = options;

    const url = this.resolveUrl(endpoint, params);
    const headers = new Headers(customHeaders as HeadersInit);

    // Add JSON Content-Type if sending an object payload
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    if (!headers.has('Content-Type') && !isFormData && body !== undefined) {
      headers.set('Content-Type', 'application/json');
    }

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json, text/plain, */*');
    }

    // Attach Authorization header if token exists
    if (!skipAuth && !headers.has('Authorization')) {
      const token = this.getStoredAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Serialized body payload
    let serializedBody: BodyInit | null | undefined = undefined;
    if (body !== undefined && body !== null) {
      if (isFormData || typeof body === 'string' || body instanceof Blob || body instanceof ArrayBuffer) {
        serializedBody = body;
      } else {
        serializedBody = JSON.stringify(body);
      }
    }

    // Configure AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...customOptions,
        headers,
        body: serializedBody,
        signal: customOptions.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response payload
      const contentType = response.headers.get('content-type') || '';
      let responseData: any = null;

      if (contentType.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch {
          responseData = null;
        }
      } else {
        try {
          const text = await response.text();
          responseData = text;
        } catch {
          responseData = null;
        }
      }

      // Handle non-2xx HTTP errors
      if (!response.ok) {
        const status = response.status;
        const statusText = response.statusText;

        let message = `Request failed with status ${status}`;
        let validationErrors: Record<string, string | string[]> | undefined = undefined;

        if (responseData && typeof responseData === 'object') {
          if (responseData.message) {
            message = responseData.message;
          } else if (responseData.error) {
            message = typeof responseData.error === 'string' ? responseData.error : responseData.error.message || message;
          }

          if (responseData.errors) {
            validationErrors = responseData.errors;
          } else if (responseData.validationErrors) {
            validationErrors = responseData.validationErrors;
          }
        }

        // Specific HTTP status code classification
        const isAuthError = status === 401 || status === 403;
        const isValidationError = status === 400 || status === 422;
        const isServerError = status >= 500;

        if (status === 401) {
          message = message || 'Session expired or unauthorized. Please log in again.';
        } else if (status === 403) {
          message = message || 'You do not have permission to perform this action.';
        } else if (status === 404) {
          message = message || 'The requested resource was not found.';
        } else if (status >= 500) {
          message = message || 'An unexpected server error occurred. Please try again later.';
        }

        throw new ApiError({
          status,
          statusText,
          message,
          data: responseData,
          validationErrors,
          isNetworkError: false,
          isAuthError,
          isValidationError,
          isServerError,
        });
      }

      return responseData as T;
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }

      // Handle network errors, aborts & DNS failures
      const isAbort = err?.name === 'AbortError';
      const isNetwork = !isAbort;

      const networkErrorMessage = isAbort
        ? `Request timed out after ${timeoutMs / 1000}s. Please check your network connection.`
        : (err?.message && err.message !== 'Failed to fetch')
        ? err.message
        : 'Network error. Could not connect to the backend server. Please verify the server is running.';

      throw new ApiError({
        status: 0,
        statusText: isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: networkErrorMessage,
        data: null,
        isNetworkError: true,
        isAuthError: false,
        isValidationError: false,
        isServerError: false,
      });
    }
  }

  // HTTP Method Shorthands
  get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
