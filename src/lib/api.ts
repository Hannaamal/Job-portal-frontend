import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// Add interceptor OUTSIDE axios.create()
api.interceptors.request.use((config) => {
  // Since auth_token is HTTP-only, we don't read it here
  // The cookie will be automatically sent with withCredentials: true
  return config;
});

export default api;
