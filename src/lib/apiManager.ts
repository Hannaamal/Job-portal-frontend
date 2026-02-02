import axios from "axios";
import Cookies from "js-cookie";

// Request cache to prevent duplicate concurrent requests
const requestCache = new Map<string, Promise<any>>();

// Request deduplication function
function createRequestKey(url: string, params?: any): string {
  const sortedParams = params ? Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&') : '';
  return `${url}?${sortedParams}`;
}

// Enhanced API instance with request deduplication
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add interceptor for authentication tokens
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear auth token on 401
      Cookies.remove("auth_token");
      // Redirect to login handled by middleware
    }
    return Promise.reject(error);
  }
);

// Enhanced request function with deduplication
export const apiRequest = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const key = createRequestKey(url, params);
    
    // Return cached promise if request is already in progress
    if (requestCache.has(key)) {
      return requestCache.get(key);
    }

    // Create new request promise
    const requestPromise = api.get<T>(url, { params }).then(response => response.data);
    
    // Cache the promise
    requestCache.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Remove from cache when request completes (success or failure)
      requestCache.delete(key);
    }
  },

  post: async <T>(url: string, data?: any): Promise<T> => {
    const key = createRequestKey(url, data);
    
    if (requestCache.has(key)) {
      return requestCache.get(key);
    }

    const requestPromise = api.post<T>(url, data).then(response => response.data);
    requestCache.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      requestCache.delete(key);
    }
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const key = createRequestKey(url, data);
    
    if (requestCache.has(key)) {
      return requestCache.get(key);
    }

    const requestPromise = api.put<T>(url, data).then(response => response.data);
    requestCache.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      requestCache.delete(key);
    }
  },

  delete: async <T>(url: string, params?: any): Promise<T> => {
    const key = createRequestKey(url, params);
    
    if (requestCache.has(key)) {
      return requestCache.get(key);
    }

    const requestPromise = api.delete<T>(url, { params }).then(response => response.data);
    requestCache.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      requestCache.delete(key);
    }
  }
};

// Cache invalidation function
export const invalidateCache = (pattern?: string) => {
  if (pattern) {
    // Clear specific cache entries matching pattern
    for (const key of requestCache.keys()) {
      if (key.includes(pattern)) {
        requestCache.delete(key);
      }
    }
  } else {
    // Clear all cache
    requestCache.clear();
  }
};

export default api;
