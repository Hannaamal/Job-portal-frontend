// redux/job/myApplicationsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface MyApplicationsState {
  myApplications: any[];
  loading: boolean;
  error: string | null;
  withdrawingId: string | null; // ✅ track which application is being withdrawn
}

const initialState: MyApplicationsState = {
  myApplications: [],
  loading: false,
  error: null,
  withdrawingId: null,
};

// Fetch user applications
export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/application/my-applications", {
        withCredentials: true,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Withdraw application
// redux/jobs/myApplicationsSlice.ts
export const withdrawApplication = createAsyncThunk(
  "applications/withdrawApplication",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/application/withdraw/${jobId}`, {
        withCredentials: true,
      });
      return res.data.deletedApplicationId; // return deleted ID
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to withdraw application"
      );
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
      .addCase(withdrawApplication.pending, (state, action) => {
        state.error = null;
        state.withdrawingId = action.meta.arg; // jobId being withdrawn
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        // action.payload = deletedApplicationId (string)
        state.myApplications = state.myApplications.filter(
          (app) => app._id !== action.payload // must match app._id from DB
        );
        state.withdrawingId = null; // reset button loading
      })

      .addCase(withdrawApplication.rejected, (state, action) => {
        state.error = action.payload as string;
        state.withdrawingId = null;
      });
  },
});

export default myApplicationsSlice.reducer;
