import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add interceptor to log requests for debugging
api.interceptors.request.use((config) => {
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    withCredentials: config.withCredentials,
    headers: config.headers
  });
  
  // Since auth_token is HTTP-only, we don't read it here
  // The cookie will be automatically sent with withCredentials: true
  return config;
});

// Add response interceptor to log responses for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.log('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;
