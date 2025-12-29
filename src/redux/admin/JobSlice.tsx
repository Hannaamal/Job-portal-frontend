import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface JobCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: JobCreateState = {
  loading: false,
  success: false,
  error: null,
};

// ✅ Async thunk
export const createJob = createAsyncThunk(
  "jobs/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/job/", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job"
      );
    }
  }
);

const jobCreateSlice = createSlice({
  name: "jobCreate",
  initialState,
  reducers: {
    resetJobCreateState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetJobCreateState } = jobCreateSlice.actions;
export default jobCreateSlice.reducer;
