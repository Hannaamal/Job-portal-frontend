import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "@/lib/api";

// Get auth token (if needed)
const getToken = () => Cookies.get("auth_token");

/* =======================
   Async Thunks
======================= */

interface FetchJobsParams {
  [key: string]: string | number | boolean;
}

// Fetch all jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchAll",
  async (params: FetchJobsParams = {}, { rejectWithValue }) => {
    try {
      // Convert params object to query string
      const query = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, value.toString()])
      ).toString();

      const res = await api.get(`/api/job/?${query}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch job by ID
export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/job/${jobId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create job (admin)
export const createJob = createAsyncThunk(
  "jobs/create",
  async (jobData: any, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await api.post("/jobs", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.job;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const applyJob = createAsyncThunk(
  "jobs/apply",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/job-application/${jobId}/apply`);
      return { jobId };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);




export const fetchJobsByCompany = createAsyncThunk(
  "jobs/fetchByCompany",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/job/company/${companyId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =======================
   Slice
======================= */

interface JobsState {
  jobs: any[];
  selectedJob: any | null;
  loading: boolean;
  error: string | null;
  page: number;
  pages: number;
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setSelectedJob(state, action) {
      state.selectedJob = action.payload;
    },
    clearSelectedJob(state) {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // jobByCompanyId
      .addCase(fetchJobsByCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobsByCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobsByCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedJob, clearSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer;
