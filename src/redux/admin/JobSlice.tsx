import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* ======================
   Types
====================== */

export interface AdminJob {
  _id: string;
  title: string;
  description?: string;
  location: string;
  jobType?: string;
  experienceLevel?: string;
  company?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
}

interface AdminJobsState {
  jobs: AdminJob[];
  loading: boolean;
  success: boolean; // for create job
  error: string | null;
}

/* ======================
   Initial State
====================== */

const initialState: AdminJobsState = {
  jobs: [],
  loading: false,
  success: false,
  error: null,
};

interface JobCreateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}



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

export const fetchAdminJobs = createAsyncThunk(
  "adminJobs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/job");
      return res.data.jobs as AdminJob[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs"
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
      })
       .addCase(fetchAdminJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchAdminJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { resetJobCreateState } = jobCreateSlice.actions;
export default jobCreateSlice.reducer;
