import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* ---------------- TYPES ---------------- */

export interface ApplicationStat {
  title: string;
  received: number;
  hold: number;
  rejected: number;
}

export interface DashboardStats {
  interviews: number;
  shortlisted: number;
  hired: number;
  jobs: number;
}

interface DashboardState {
  stats: DashboardStats;
  applications: ApplicationStat[];
  jobStats: number[];
  loading: boolean;
  error: string | null;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: DashboardState = {
  stats: {
    interviews: 0,
    shortlisted: 0,
    hired: 0,
    jobs: 0,
  },
  applications: [],
  jobStats: [],
  loading: false,
  error: null,
};

/* ---------------- THUNK ---------------- */

export const fetchDashboard = createAsyncThunk(
  "adminDashboard/fetch",
  async (company: string | undefined, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/dash/dashboard", {
        params: company ? { company } : {},
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);

/* ---------------- SLICE ---------------- */

const dashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          interviews: action.payload.interviews,
          shortlisted: action.payload.shortlisted,
          hired: action.payload.hired,
          jobs: action.payload.jobs,
        };
        state.applications = action.payload.applications;
        state.jobStats = action.payload.jobStats;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
