import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./jobs/jobsSlice";
import companyReducer from "./company/companySlice"
import jobApplicationReducer from "./jobs/jobApplicationSlice"
import authReducer from "./authSlice"
import myApplicationsReducer from "./jobs/jobApplicationSlice"
import profileReducer from "./profileSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,    
    jobs: jobsReducer,
    company: companyReducer,
    jobApplication: jobApplicationReducer,
    myApplications: myApplicationsReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
