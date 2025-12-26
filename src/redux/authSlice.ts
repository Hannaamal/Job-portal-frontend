"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import Cookies from "js-cookie";

interface AuthState {
  user: any | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("auth_token") || null,
  role: Cookies.get("role") || null,
  loading: false,
  error: null,
};

// ------------------------ SIGNUP API ------------------------
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/register", formData);

      const token = res.data.accessToken;
      const role = res.data.userRole;
      const user = res.data.data;

      Cookies.set("auth_token", token, { path: "/" });
      Cookies.set("role", role, { path: "/" });

      return { user, token, role };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);

// ------------------------ LOGIN API ------------------------

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/api/auth/login", formData);

      const token = res.data.accessToken;
      const role = res.data.userRole;
      const user = res.data.data;

      // Save in cookies
      Cookies.set("auth_token", token, { path: "/" });
      Cookies.set("role", role, { path: "/" });

      return { user, token, role };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);
export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/auth/me");
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue("Not authenticated");
    }
  }
);

// ------------------------ LOGOUT API ------------------------

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  Cookies.remove("auth_token", { path: "/" });
  Cookies.remove("role", { path: "/" });
  return true;
});

// -------------------- AUTH SLICE  --------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* SIGNUP */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(signupUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Me

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
