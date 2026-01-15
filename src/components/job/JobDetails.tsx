"use client";

import { useRouter } from "next/navigation";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import JobApplyButton from "./jobApplicationButton";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { saveJob, removeSavedJob, fetchSavedJobs } from "@/redux/jobs/saveJobSlice";
import { useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";

interface JobDetailsProps {
  job: any | null;
}

export default function JobDetails({ job }: JobDetailsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const savedJobs = useSelector((state: RootState) => state.savedJobs.savedJobs);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const isSaved = job ? savedJobs.some((s) => s.job._id === job._id) : false;

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  const handleToggleSave = () => {
    if (!job) return;
    
    // Redirect to authentication if not logged in
    if (!isAuthenticated) {
      router.push('/authentication');
      return;
    }
    
    if (isSaved) dispatch(removeSavedJob(job._id));
    else dispatch(saveJob(job._id));
  };

  if (!job) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-gray-500">
        Select a job to view details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 sticky top-6 z-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold mb-1">{job.title}</h1>

          <div className="flex items-center gap-2 text-gray-600">
            <BusinessIcon fontSize="small" />
            <span>{job.company?.name}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <LocationOnIcon fontSize="small" />
            <span>{job.location}</span>
          </div>
        </div>

         <div onClick={handleToggleSave} className="cursor-pointer">
          {isSaved ? <BookmarkIcon className="text-blue-600" /> : <BookmarkBorderIcon />}
        </div>
      </div>

      {/* Meta */}
      <div className="flex gap-6 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <WorkOutlineIcon fontSize="small" />
          <span>{job.jobType}</span>
        </div>
        <span>{job.experienceLevel}</span>
      </div>

      {/* Apply Button */}
      <div className="mt-4">
       <JobApplyButton jobId={job._id as string} />

      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>
    </div>
  );
}
