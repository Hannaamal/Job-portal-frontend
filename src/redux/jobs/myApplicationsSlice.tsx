// redux/job/myApplicationsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface MyApplicationsState {
  myApplications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MyApplicationsState = {
  myApplications: [],
  loading: false,
  error: null,
};

// Fetch user applications
export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/application/my-applications", { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Withdraw application
export const withdrawApplication = createAsyncThunk(
  "applications/withdrawApplication",
  async (jobId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/jobs/${jobId}/withdraw`, { withCredentials: true });
      return jobId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to withdraw application");
    }
  }
);

const myApplicationsSlice = createSlice({
  name: "myApplications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(withdrawApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = state.myApplications.filter(
          (app) => app.job._id !== action.payload
        );
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default myApplicationsSlice.reducer;
