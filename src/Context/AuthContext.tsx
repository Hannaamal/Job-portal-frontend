"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
