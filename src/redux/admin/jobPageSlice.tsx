import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface AdminJob {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  company: { _id: string; name: string } | null; // ✅ must be present
  isActive: boolean;
  createdAt: string;
}

interface AdminJobsState {
  jobs: AdminJob[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminJobsState = {
  jobs: [],
  loading: false,
  error: null,
};

// 🔹 Fetch all jobs (admin)
export const fetchAdminJobs = createAsyncThunk(
  "adminJobs/fetchAll",
  async (
   params: { jobTitle?: string; company?: string } | undefined,

    { rejectWithValue }
  ) => {
    try {
      const res = await api.get("/api/job/", {
        params,
      });
      return res.data.jobs;
    } catch (err: any) {
      return rejectWithValue("Failed to load jobs");
    }
  }
);


// Fetch single job
export const fetchAdminJobById = createAsyncThunk(
  "adminJobs/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/job/${id}`);
      return res.data.job;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load job"
      );
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  "adminJobs/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/job/${id}`, data);
      console.log("UPDATE JOB API CALLED",res);
      return res.data.job;

    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job"
      );
    }
  }
);

// 🔹 Delete job
export const deleteJob = createAsyncThunk(
  "adminJobs/delete",
  async (jobId: string, { rejectWithValue }) => {
    try {
      await api.put(`/api/job/delete/${jobId}`);
      return jobId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete job"
      );
    }
  }
);

const adminJobsSlice = createSlice({
  name: "adminJobs",
  initialState,
  reducers: {
    resetAdminJobsState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch
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

      // Delete
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.map((job) =>
          job._id === action.payload._id ? action.payload : job
        );
      })

      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAdminJobsState } = adminJobsSlice.actions;

export default adminJobsSlice.reducer;
