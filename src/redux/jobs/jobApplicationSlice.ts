import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
// or same file


export const checkJobApplied = createAsyncThunk<
  { applied: boolean; status: string | null },
  string
>("jobApplication/checkJobApplied", async (jobId) => {
  const res = await api.get(`/api/application/check/${jobId}`);
  return res.data;
});



export const applyForJob = createAsyncThunk<
  JobApplication,
  { jobId: string; resume: File;experience:string, },
  { rejectValue: string }
  
>(
  "jobApplication/applyForJob",
  async ({ jobId, resume,experience, }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("experience", experience); // 👈 VERY IMPORTANT

      // DO NOT set Content-Type manually ✅
      const res = await api.post(`api/application/apply/${jobId}`, formData);

      return res.data.application;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Apply failed");
    }
  }
);

interface JobApplicationState {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;

  appliedJobs: {
    [jobId: string]: {
      applied: boolean;
      status: string | null;
    };
  };
}


const initialState: JobApplicationState = {
  applications: [],
  loading: false,
  error: null,
  appliedJobs: {}, // 👈 key point
};


const jobApplicationSlice = createSlice({
  name: "jobApplication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // ✅ CHECK JOB
    .addCase(checkJobApplied.fulfilled, (state, action) => {
      const { jobId, applied, status } = action.payload;
      state.appliedJobs[jobId] = { applied, status };
    })

    // ✅ APPLY JOB
    .addCase(applyForJob.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(applyForJob.fulfilled, (state, action) => {
      state.loading = false;

      const jobId = action.payload.job;

      state.appliedJobs[jobId] = {
        applied: true,
        status: "applied",
      };

      state.applications.push(action.payload);
    })
    .addCase(applyForJob.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Something went wrong";
    });
},
 });


export default jobApplicationSlice.reducer;
