import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* ======================
   ASYNC THUNKS
====================== */

// Fetch all skills
export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/skills");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create skill
export const createSkill = createAsyncThunk(
  "skills/createSkill",
  async (data: { name: string; category?: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/skills", data);
      return res.data.skill;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update skill
export const updateSkill = createAsyncThunk(
  "skills/updateSkill",
  async (
    { id, data }: { id: string; data: { name: string; category?: string } },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/api/skills/${id}`, data);
      return res.data.skill;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete skill
export const deleteSkill = createAsyncThunk(
  "skills/deleteSkill",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/skills/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ======================
   SLICE
====================== */

interface SkillState {
  skills: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createSkill.fulfilled, (state, action) => {
        state.skills = [action.payload, ...state.skills]; // add at the beginning
        state.loading = false; // optional, if you use loading state
      })

      // Update
      .addCase(updateSkill.fulfilled, (state, action) => {
        const index = state.skills.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) state.skills[index] = action.payload;
      })

      // Delete
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter((s) => s._id !== action.payload);
      });
  },
});

export default skillsSlice.reducer;
