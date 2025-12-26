import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./jobs/jobsSlice";
import companyReducer from "./company/companySlice"
import jobApplicationReducer from "./jobs/jobApplicationSlice"
import authReducer from "./authSlice"

export const store = configureStore({
  reducer: {
     auth: authReducer,    
    jobs: jobsReducer,
    company: companyReducer,
    jobApplication: jobApplicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
