import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./jobs/jobsSlice";
import companyReducer from "./company/companySlice"
import jobApplicationReducer from "./jobs/jobApplicationSlice"
import authReducer from "./authSlice"
import myApplicationsReducer from "./jobs/myApplicationsSlice"
import profileReducer from "./profileSlice"
import   adminJobsSliceReducer from "./admin/jobPageSlice"
import adminCompanySliceReducer from "./admin/companySlice"
import adminUsersReducer from "./admin/userSlice";
import notificationsReducer from "./notificationSlice";
import savedJobsSliceReducer from "./jobs/saveJobSlice";
import adminApplicationsSlice from "./admin/applicationSlice"
import dashboardReducer from "./admin/dashboardSlice";
import skillsReducer from "@/redux/admin/skillsSlice";
import interviewSchedulerSliceReducer from "@/redux/admin/interviewSlice"



export const store = configureStore({
  reducer: {
    auth: authReducer,    
    jobs: jobsReducer,
    company: companyReducer,
    jobApplication: jobApplicationReducer,
    myApplications: myApplicationsReducer,
    profile: profileReducer,
    adminJobs: adminJobsSliceReducer,
    adminCompany:adminCompanySliceReducer,
     adminUsers: adminUsersReducer,
     notifications: notificationsReducer,
     savedJobs:savedJobsSliceReducer,
     adminApplications:adminApplicationsSlice,
      adminDashboard: dashboardReducer,
      skills: skillsReducer,
      adminInterviews:interviewSchedulerSliceReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
