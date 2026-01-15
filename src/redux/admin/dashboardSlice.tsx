import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* ---------------- TYPES ---------------- */

export interface ApplicationStat {
  applicant: string;
  title: string;
  received: number;
  interviews: number;
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
          interviews: action.payload.interviews ?? 0,
          shortlisted: action.payload.shortlisted ?? 0,
          hired: action.payload.hired ?? 0,
          jobs: action.payload.jobs ?? 0,
        };

        // Map applications and normalize field names
        console.log("API Response applications:", action.payload.applications);
        state.applications = (action.payload.applications || []).map(
          (app: any) => {
            console.log("Processing app:", app);
            console.log("Applicant data:", app.applicant);
            
            // Handle different possible structures for applicant data
            let applicantName = "Unknown";
            
            if (app.applicant) {
              if (typeof app.applicant === 'string') {
                // If applicant is just an ID string, we can't get the name
                applicantName = "Applicant details not available";
              } else if (typeof app.applicant === 'object') {
                // If applicant is an object, try to get the name
                applicantName = app.applicant.name || app.applicant.fullName || app.applicant.username || "Unknown";
              }
            } else if (app.applicantName) {
              // Direct applicant name field
              applicantName = app.applicantName;
            } else if (app.name) {
              // Simple name field
              applicantName = app.name;
            }

            return {
              applicant: applicantName,
              title: app.title || "Untitled Job",
              received: app.received ?? 0,
              interviews: app.interviews ?? app.interview ?? app.hold ?? 0,
              rejected: app.rejected ?? 0,
            };
          }
        );
        state.jobStats = action.payload.jobStats;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
