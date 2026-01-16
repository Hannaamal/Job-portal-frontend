import axios from "axios";
// import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// Add interceptor OUTSIDE axios.create()
// api.interceptors.request.use((config) => {
//  const token = Cookies.get("auth_token"); // FIXED

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

export default api;

