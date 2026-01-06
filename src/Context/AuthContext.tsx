"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { User } from "lucide-react";

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
  login: (token: string, user: User) => void;
  logout: () => void;
  setAuthenticatedUser: (token: string, user: User) => void;
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
  console.log("AuthProvider token:", token, "loading:", loading);

  // Load token from cookies on refresh



  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await api.get("/api/auth/me", {
        withCredentials: true, // 🔥 REQUIRED
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);



  // Login function
const login = (token: string, user: User) => {
  setToken(token); // optional
  setUser(user);
  setLoading(false);
};


  const setAuthenticatedUser = (token: string, user: User) => {
    Cookies.set("auth_token", token, { path: "/" });
    setToken(token);
    setUser(user);
    setLoading(false);
  };

  // Logout
  const logout = async () => {
  await api.post("/api/auth/logout", {}, { withCredentials: true });
  setToken(null);
  setUser(null);
  setLoading(false);
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
