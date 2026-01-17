"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface AuthState {
  user: any | null;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  role: null,
  loading: false,
  isAuthenticated: false,
  error: null,
};

/* ======================
   SIGNUP
====================== */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (formData: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/register", formData);
      return res.data.user; // backend sends user
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);

/* ======================
   LOGIN
====================== */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", formData);
      return res.data.user; 
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message 
      );
    }
  }
);

/* ======================
   FETCH ME
====================== */
export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/auth/me");
      return res.data.user;
    } catch {
      return rejectWithValue("Not authenticated");
    }
  }
);

/* ======================
   LOGOUT
====================== */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/auth/logout"); // backend clears cookie
      return true;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Logout failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* SIGNUP */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ME */
      .addCase(fetchMe.pending, (state) => {
  state.loading = true;
})
.addCase(fetchMe.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload;
  state.role = action.payload.role;
  state.isAuthenticated = true;
})
.addCase(fetchMe.rejected, (state) => {
  state.loading = false;
  state.user = null;
  state.role = null;
  state.isAuthenticated = false;
})
      /* LOGOUT */
      .addCase(logoutUser.pending, (state) => {
        state.loading = true; 
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
      );
  }
});

export default authSlice.reducer;
