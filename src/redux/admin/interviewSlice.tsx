import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* =========================
   TYPES
========================= */

export interface Interview {
  _id: string;

  job:
    | {
        _id: string;
        title?: string;
      }
    | string;

  company:
    | {
        _id: string;
        name?: string;
      }
    | string;

  interviewMode: "Walk-in" | "Slot-based";
  medium: "Online" | "Onsite";
  interviewType: "HR" | "Technical" | "Managerial";

  meetingLink?: string;
  location?: string;

  date: string;
  timeRange?: {
    start: string;
    end: string;
  };

  instructions?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface InterviewState {
  interviews: Interview[];
  currentInterview?: Interview;
  loading: boolean;
  error?: string;
}

/* =========================
   INITIAL STATE
========================= */

const initialState: InterviewState = {
  interviews: [],
  currentInterview: undefined,
  loading: false,
  error: undefined,
};

/* =========================
   THUNKS
========================= */

// 1️⃣ Schedule Interview (Admin)
export const scheduleInterviewThunk = createAsyncThunk<
  Interview,
  { jobId: string; data: Partial<Interview> }
>("interview/schedule", async ({ jobId, data }, { rejectWithValue, dispatch }) => {
  try {
    const res = await api.post(
      `/api/admin/interview/jobs/${jobId}/interviews`,
      data
    );

    // Update job status to "interview" after scheduling
    await api.put(`/api/admin/application/applications/jobs/${jobId}/status`, {
      status: "interview"
    });
    
    
    return res.data.interview;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to schedule interview"
    );
  }
});

// 2️⃣ Get Interviews by Job
export const getJobInterviewsThunk = createAsyncThunk<
  Interview[],
  { jobId: string }
>("interview/getByJob", async ({ jobId }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/admin/interview/job/${jobId}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch interviews"
    );
  }
});

// 3️⃣ Get Interview by ID
export const getInterviewByIdThunk = createAsyncThunk<
  Interview,
  { interviewId: string }
>("interview/getById", async ({ interviewId }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/admin/interview/interviews/${interviewId}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Interview not found"
    );
  }
});

// 4️⃣ Update Interview
export const updateInterviewThunk = createAsyncThunk<
  Interview,
  { interviewId: string; data: Partial<Interview> }
>("interview/update", async ({ interviewId, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(
      `/api/admin/interview/interviews/${interviewId}`,
      data
    );
    return res.data.interview;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update interview"
    );
  }
});

// 5️⃣ Cancel Interview
export const cancelInterviewThunk = createAsyncThunk<
  string,
  { interviewId: string }
>("interview/cancel", async ({ interviewId }, { rejectWithValue }) => {
  try {
    await api.delete(`/api/admin/interview/interviews/${interviewId}`);
    return interviewId;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to cancel interview"
    );
  }
});

/* =========================
   SLICE
========================= */

const interviewSchedulerSlice = createSlice({
  name: "interviewScheduler",
  initialState,
  reducers: {
    clearCurrentInterview: (state) => {
      state.currentInterview = undefined;
    },
    clearInterviewError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- SCHEDULE ---------- */
      .addCase(scheduleInterviewThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        scheduleInterviewThunk.fulfilled,
        (state, action: PayloadAction<Interview>) => {
          state.loading = false;

          const index = state.interviews.findIndex(
            (i) => i._id === action.payload._id
          );

          if (index !== -1) {
            state.interviews[index] = action.payload;
          } else {
            state.interviews.push(action.payload);
          }
        }
      )
      .addCase(scheduleInterviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------- GET BY JOB ---------- */
      .addCase(getJobInterviewsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobInterviewsThunk.fulfilled, (state, action) => {
        state.loading = false;

        action.payload.forEach((incoming) => {
          const exists = state.interviews.find((i) => i._id === incoming._id);

          if (!exists) {
            state.interviews.push(incoming);
          }
        });
      })

      .addCase(getJobInterviewsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ---------- GET BY ID ---------- */
      .addCase(
        getInterviewByIdThunk.fulfilled,
        (state, action: PayloadAction<Interview>) => {
          state.currentInterview = action.payload;
        }
      )

      /* ---------- UPDATE ---------- */
      .addCase(
        updateInterviewThunk.fulfilled,
        (state, action: PayloadAction<Interview>) => {
          const index = state.interviews.findIndex(
            (i) => i._id === action.payload._id
          );

          if (index !== -1) {
            state.interviews[index] = action.payload;
          }

          state.currentInterview = action.payload;
        }
      )

      /* ---------- CANCEL ---------- */
      /* ---------- CANCEL ---------- */
.addCase(cancelInterviewThunk.pending, (state) => {
  state.loading = true;
})

.addCase(
  cancelInterviewThunk.fulfilled,
  (state, action: PayloadAction<string>) => {
    state.loading = false;

    state.interviews = state.interviews.filter(
      (i) => i._id !== action.payload
    );

    if (state.currentInterview?._id === action.payload) {
      state.currentInterview = undefined;
    }
  }
)

.addCase(cancelInterviewThunk.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});

  },
});

export const { clearCurrentInterview, clearInterviewError } =
  interviewSchedulerSlice.actions;

export default interviewSchedulerSlice.reducer;
