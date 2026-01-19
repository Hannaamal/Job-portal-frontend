// "use client";

// import { createContext, useContext, ReactNode, useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "@/redux/store";
// import { fetchMe } from "@/redux/authSlice";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface AuthContextProps {
//   user: User | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   refreshUser: () => Promise<void>; 
  
// }

// const AuthContext = createContext<AuthContextProps>({
//   user: null,
//   loading: true,
//   isAuthenticated: false,
//     refreshUser: async () => {}, 
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const dispatch = useDispatch<AppDispatch>();
//   const { user, loading, isAuthenticated } = useSelector(
//     (state: RootState) => state.auth
//   );
//     const [initialized, setInitialized] = useState(false);
//     const refreshUser = async () => {
//     await dispatch(fetchMe()).unwrap().catch(() => {}); // fetch user from backend
//     setInitialized(true);
//   };
//   useEffect(() => {
//     refreshUser();
//   }, []);


//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         loading: !initialized || loading,
//         refreshUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchMe } from "@/redux/authSlice";

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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: reduxLoading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  
  const [initialized, setInitialized] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      await dispatch(fetchMe()).unwrap();
    } catch {}
    setInitialized(true); // mark as initialized after first fetch
  }, [dispatch]);

  useEffect(() => {
    refreshUser(); // only runs once
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading: !initialized || reduxLoading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
