import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Interview {
  _id: string;
  user?: string;
  job?: string;
  company?: string;
  interviewType: "Technical" | "HR" | "Managerial";
  mode: "Online" | "Onsite";
  meetingLink?: string;
  location?: string;
  date: string;
  notes?: string;
  status?: "Scheduled" | "Completed" | "Cancelled";
}

interface InterviewState {
  interviews: Interview[];
  loading: boolean;
  error?: string;
}

const initialState: InterviewState = {
  interviews: [],
  loading: false,
  error: undefined,
};

/* =========================
   THUNKS
========================= */

// Schedule Interview
export const scheduleInterviewThunk = createAsyncThunk<
  { applicationId: string; interview: Interview },
  { applicationId: string; data: Partial<Interview> }
>(
  "interviews/schedule",
  async ({ applicationId, data }) => {
    const res = await api.post(
      `/api/admin/interview/applications/${applicationId}/interview`,
      data
    );

    return {
      applicationId,
      interview: res.data.interview,
    };
  }
);

// Update Interview
export const updateInterviewThunk = createAsyncThunk<
  Interview,
  { interviewId: string; data: Partial<Interview> }
>("interviews/update", async ({ interviewId, data }) => {
  const res = await api.put(`/api/admin/interview/${interviewId}`, data);
  return res.data;
});

// Cancel Interview
export const cancelInterviewThunk = createAsyncThunk<
  { interviewId: string },
  { interviewId: string }
>("interviews/cancel", async ({ interviewId }) => {
  await api.delete(`/api/admin/interview/${interviewId}`);
  return { interviewId };
});

/* =========================
   SLICE
========================= */

const adminInterviewSlice = createSlice({
  name: "adminInterviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Schedule
    builder.addCase(scheduleInterviewThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      scheduleInterviewThunk.fulfilled,
      (
        state,
        action: PayloadAction<{ applicationId: string; interview: Interview }>
      ) => {
        state.loading = false;

        const index = state.interviews.findIndex(
          (i) => i._id === action.payload.interview._id
        );

        if (index !== -1) {
          // Update existing interview in state
          state.interviews[index] = action.payload.interview;
        } else {
          // Add new interview
          state.interviews.push(action.payload.interview);
        }
      }
    );
    builder.addCase(scheduleInterviewThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Update
    builder.addCase(updateInterviewThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateInterviewThunk.fulfilled, (state, action: PayloadAction<Interview>) => {
      state.loading = false;
      const index = state.interviews.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) state.interviews[index] = action.payload;
    });
    builder.addCase(updateInterviewThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Cancel
    builder.addCase(cancelInterviewThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(cancelInterviewThunk.fulfilled, (state, action: PayloadAction<{ interviewId: string }>) => {
      state.loading = false;
      const index = state.interviews.findIndex((i) => i._id === action.payload.interviewId);
      if (index !== -1) {
        state.interviews[index].status = "Cancelled";
      }
    });
    builder.addCase(cancelInterviewThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default adminInterviewSlice.reducer;
