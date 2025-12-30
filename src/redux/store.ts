import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./jobs/jobsSlice";
import companyReducer from "./company/companySlice"
import jobApplicationReducer from "./jobs/jobApplicationSlice"
import authReducer from "./authSlice"
import myApplicationsReducer from "./jobs/myApplicationsSlice"
import profileReducer from "./profileSlice"
import jobCreateReducer from "./admin/JobSlice"
import adminJobsSliceReducer from "./admin/jobPageSlice"
import adminCompanySliceReducer from "./admin/companySlice"
import adminUsersReducer from "./admin/userSlice";
import notificationsReducer from "./notificationSlice";




export const store = configureStore({
  reducer: {
    auth: authReducer,    
    jobs: jobsReducer,
    company: companyReducer,
    jobApplication: jobApplicationReducer,
    myApplications: myApplicationsReducer,
    profile: profileReducer,
    jobCreate: jobCreateReducer,
    adminJobs: adminJobsSliceReducer,
    adminCompany:adminCompanySliceReducer,
     adminUsers: adminUsersReducer,
     notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
