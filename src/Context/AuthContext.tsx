"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";

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
  isAuthenticated: boolean;   // ✅ ADD THIS
  login: (token: string, user: User) => void;
  logout: () => void;
  setAuthenticatedUser: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,   // ✅ ADD DEFAULT
  login: () => {},
  logout: () => {},
  setAuthenticatedUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from cookies on refresh
  useEffect(() => {
    const storedToken = Cookies.get("auth_token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    fetchUser(storedToken);
  }, []);

  // Fetch the logged user
  const fetchUser = async (jwt: string) => {
  try {
    const res = await api.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    setUser(res.data.data);
  } catch (err: any) {
    // 🔥 Only logout if token is invalid
    if (err.response?.status === 401 || err.response?.status === 403) {
      logout();
    } else {
      console.error("Temporary error, not logging out", err);
    }
  } finally {
    setLoading(false);
  }
};


  // Login function
  const login = (token: string, user: User) => {
    Cookies.set("auth_token", token, { path: "/" });
    setToken(token);
    setUser(user);
  };
  const setAuthenticatedUser = (token: string, user: User) => {
  Cookies.set("auth_token", token, { path: "/" });
  setToken(token);
  setUser(user);
};

  

  // Logout
  const logout = () => {
  Cookies.remove("auth_token", { path: "/" });
  setToken(null);
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,   // ✅ THE IMPORTANT LINE
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
