import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/api";
import { RootState } from "./store";

export interface Skill {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Profile {
  user: User | null;
  phone?: string;
  location?: string;
  title?: string;
  experienceLevel?: "Fresher" | "1-3" | "3-5" | "5+";
  skills: Skill[];
  summary?: string;
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  resume?: {
    url: string;
    uploadedAt: string;
  };
  preferences?: {
    jobType?: string;
    remoteOnly?: boolean;
    preferredLocations?: string[];
  };
  avatar?: string;
}

/* ================= THUNKS ================= */

// Fetch profile
export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/profile/me");
      return res.data; // return { user, profile }!
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Update profile
export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.put("/api/profile/me/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // backend returns { user, profile }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Fetch skills
export const fetchSkills = createAsyncThunk(
  "profile/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/skills/");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* ================= SLICE ================= */

interface ProfileState {
  user: User | null;
  profile: Profile | null;
  skills: Skill[];
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
      // Fetch
      .addCase(fetchMyProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { user, profile } = action.payload;

        // Parse resume/preferences if string
        if (profile?.resume && typeof profile.resume === "string") {
          try { profile.resume = JSON.parse(profile.resume); } catch { profile.resume = null; }
        }
        if (profile?.preferences && typeof profile.preferences === "string") {
          try { profile.preferences = JSON.parse(profile.preferences); } catch { profile.preferences = {}; }
        }

        state.user = user;
        state.profile = profile;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateMyProfile.pending, (state) => { state.loading = true; })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { user, profile } = action.payload;
        state.user = user;
        state.profile = profile;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Skills
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload || [];
      });
  },
});

export const selectProfile = (state: RootState) => state.profile.profile;
export const selectUser = (state: RootState) => state.profile.user;
export const selectSkills = (state: RootState) => state.profile.skills || [];

export default profileSlice.reducer;
