// redux/jobs/savedJobsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface SavedJobsState {
  savedJobs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedJobsState = {
  savedJobs: [],
  loading: false,
  error: null,
};

// Fetch saved jobs
export const fetchSavedJobs = createAsyncThunk("savedJobs/fetchSavedJobs", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/savejob/saved", { withCredentials: true });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch saved jobs");
  }
});

// Save a job
export const saveJob = createAsyncThunk("savedJobs/saveJob", async (jobId: string, { rejectWithValue }) => {
  try {
    const res = await api.post(`/api/savejob/${jobId}/save`, {}, { withCredentials: true });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to save job");
  }
});

// Remove saved job
export const removeSavedJob = createAsyncThunk("savedJobs/removeSavedJob", async (jobId: string, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/api/savejob/${jobId}/remove`, { withCredentials: true });
    return jobId;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to remove saved job");
  }
});

const savedJobsSlice = createSlice({
  name: "savedJobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.savedJobs.unshift(action.payload);
      })
      .addCase(removeSavedJob.fulfilled, (state, action) => {
        state.savedJobs = state.savedJobs.filter((job) => job.job._id !== action.payload);
      });
  },
});

export default savedJobsSlice.reducer;
