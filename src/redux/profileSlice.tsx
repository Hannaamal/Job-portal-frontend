import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* ======================
   ASYNC THUNKS
====================== */

// Get my profile
export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/profile/me");
      return res.data; // { user, profile }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update my profile
export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/profile/me", data);
      return res.data.profile;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch skills
export const fetchSkills = createAsyncThunk(
  "profile/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/skills");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ======================
   SLICE
====================== */

interface ProfileState {
  user: any | null;
  profile: any | null;
  skills: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  profile: null,
  skills: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
      });
  },
});

export default profileSlice.reducer;
