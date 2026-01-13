"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { User } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchMe } from "@/redux/authSlice";
import type { AppDispatch } from "@/redux/store";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setAuthenticatedUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setAuthenticatedUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  // Load token from cookies on refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/me", {
          withCredentials: true, // 🔥 REQUIRED
        });
        setUser(res.data.user);
        // Also dispatch to Redux store
        dispatch(fetchMe());
      } catch {
        setUser(null);
        // Clear Redux store on auth failure
        dispatch(fetchMe());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);



  // Login function - simplified since token is HTTP-only
const login = (user: User) => {
  setUser(user);
  setLoading(false);
};

  // Set authenticated user - simplified since token is HTTP-only
  const setAuthenticatedUser = (user: User) => {
    setUser(user);
    setLoading(false);
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user, // ✅ only check token, ignore loadingl
        login,
        logout,
        setAuthenticatedUser,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
  
}

export const useAuth = () => useContext(AuthContext);
