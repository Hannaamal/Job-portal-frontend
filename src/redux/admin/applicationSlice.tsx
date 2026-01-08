import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

// import { scheduleInterviewThunk } from "@/redux/admin/interviewSlice";

/* =========================
   TYPES (INSIDE SAME FILE)
========================= */

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Job {
  _id: string;
  title: string;
}

interface Company {
  _id: string;
  name: string;
}

export interface Application {
  _id: string;
  status: string;
  applicant: User;
  job: Job;
  company?: Company;
  createdAt?: string;
  interview?: {
    _id: string; 
    date: string;
    mode: "Online" | "Onsite";
    interviewType: "HR" | "Technical" | "Managerial";
    meetingLink?: string;
    location?: string;
    notes?:string
  };
}

interface AdminApplicationsState {
  applications: Application[];
  loading: boolean;
}

/* =========================
   INITIAL STATE
========================= */

const initialState: AdminApplicationsState = {
  applications: [],
  loading: false,
};

/* =========================
   THUNKS
========================= */

export const fetchAdminApplications = createAsyncThunk<Application[]>(
  "adminApplications/fetch",
  async () => {
    const res = await api.get("/api/admin/application/applications");
    return res.data;
  }
);

export const updateApplicationStatus = createAsyncThunk<
  Application,
  { applicationId: string; status: string }
>("adminApplications/updateStatus", async ({ applicationId, status }) => {
  const res = await api.put(`/api/admin/application/applications/${applicationId}/status`, {
    status,
  });

  return res.data;
});

/* =========================
   SLICE
========================= */

const adminApplicationsSlice = createSlice({
  name: "adminApplications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH APPLICATIONS */
      .addCase(fetchAdminApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAdminApplications.fulfilled,
        (state, action: PayloadAction<Application[]>) => {
          state.loading = false;

          state.applications = action.payload.map((app) => {
            let interview: Application["interview"] = undefined;

            if (app.interview) {
              const { _id, date, mode, meetingLink, location, interviewType } =
                app.interview;
              interview = { _id, date, mode, meetingLink, location, interviewType };
            }

            return {
              ...app,
              interview,
            };
          });
        }
      )

      .addCase(fetchAdminApplications.rejected, (state) => {
        state.loading = false;
      })

      /* UPDATE STATUS */
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateApplicationStatus.fulfilled,
        (state, action: PayloadAction<Application>) => {
          state.loading = false;

          const index = state.applications.findIndex(
            (a) => a._id === action.payload._id
          );

          if (index !== -1) {
            state.applications[index] = action.payload;
          }
        }
      )
      .addCase(updateApplicationStatus.rejected, (state) => {
        state.loading = false;
      });

    // /* SCHEDULE INTERVIEW */
    // builder.addCase(
    //   scheduleInterviewThunk.fulfilled,
    //   (
    //     state,
    //     action: PayloadAction<{ applicationId: string; interview: any }>
    //   ) => {
    //     const app = state.applications.find(
    //       (a) => a._id === action.payload.applicationId
    //     );

    //     if (app) {
    //       const { _id, date, mode, meetingLink, location, interviewType } =
    //         action.payload.interview;

    //       app.interview = { _id, date, mode, meetingLink, location, interviewType };
    //       app.status = "interview";
    //     }
    //   }
    // );
  },
});

export default adminApplicationsSlice.reducer;
