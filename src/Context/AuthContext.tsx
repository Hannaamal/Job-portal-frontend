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
import { fetchNotifications } from "@/redux/notificationSlice";
import { fetchSavedJobs } from "@/redux/jobs/saveJobSlice";
import { fetchMyProfile } from "@/redux/profileSlice";

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshUser = useCallback(async () => {
    if (isRefreshing) return; // Prevent concurrent refreshes
    
    setIsRefreshing(true);
    try {
      // First, fetch user authentication status
      const userData = await dispatch(fetchMe()).unwrap();
      
      // Only fetch additional data if user is authenticated
      if (userData && userData._id) {
        // Fetch all user-related data sequentially to prevent race conditions
        await Promise.all([
          dispatch(fetchNotifications()).unwrap(),
          dispatch(fetchSavedJobs()).unwrap(),
          dispatch(fetchMyProfile()).unwrap()
        ]);
      }
    } catch (error) {
      console.error('Auth refresh failed:', error);
    } finally {
      setIsRefreshing(false);
      setInitialized(true);
    }
  }, [dispatch]);

  useEffect(() => {
    refreshUser(); // only runs once on mount
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading: !initialized || reduxLoading || isRefreshing,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
