"use client";

import JobShareButtons from "../common/ShareButton";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchJobById } from "@/redux/jobs/jobsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Job } from "@/redux/jobs/jobsSlice";
import JobApplyButton from "./jobApplicationButton";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { removeSavedJob, saveJob } from "@/redux/jobs/saveJobSlice";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const dispatch = useDispatch<AppDispatch>();
  const { job, loading, error } = useSelector((state: RootState) => state.jobs);
  const savedJobs = useSelector(
    (state: RootState) => state.savedJobs.savedJobs
  );

  const isSaved = job ? savedJobs.some((s) => s.job._id === job._id) : false;

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [dispatch, jobId]);

  const handleToggleSave = () => {
    if (!job) return;
    if (isSaved) dispatch(removeSavedJob(job._id));
    else dispatch(saveJob(job._id));
  };

  /* =========================
     Loading State
  ========================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading job details...</p>
      </div>
    );
  }

  /* =========================
     Error State
  ========================== */
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  /* =========================
     No Job Found
  ========================== */
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Job not found.</p>
      </div>
    );
  }


  const shareJob = async () => {
  const url = window.location.href;

  if (navigator.share) {
    await navigator.share({
      title: job.title,
      url,
    });
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
  }
};


  /* =========================
     TypeScript-safe company object
  ========================== */
  const company = typeof job.company !== "string" ? job.company : null;

  /* =========================
     UI
  ========================== */
  return (
    
      
        <div className="relative bg-white shadow-md rounded-lg flex justify-center items-center px-4 p-6"> 
            <div className=" relative bg-white  max-w-4xl  shadow-md rounded-lg p-6">
        {/* Bookmark Button */}
        <button
          onClick={handleToggleSave}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100"
          aria-label="Save job"
        >
          {isSaved ? (
            <BookmarkIcon className="text-blue-600" />
          ) : (
            <BookmarkBorderIcon className="text-gray-500" fontSize="medium" />
          )}
        </button>
        {/* Job Title */}
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>

        {/* Company Info */}
        {company && (
          <div className="flex items-center gap-4 mb-4">
            {company.logo && (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${company.logo}`}
                alt={company.name}
                className="w-24 h-24 object-cover rounded-full border"
              />
            )}
            <div>
              <p className="text-lg font-semibold">{company.name}</p>
              <p className="text-sm text-gray-500">{company.location}</p>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <span>📍 {job.location}</span>
          {job.jobType && <span>🕒 {job.jobType}</span>}
          {job.experienceLevel && <span>📈 {job.experienceLevel}</span>}
          {job.salaryRange && (
            <span>
              💰 {job.salaryRange.min.toLocaleString()} -{" "}
              {job.salaryRange.max.toLocaleString()}
            </span>
          )}
        </div>
        {/* Skills */}
        {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill._id ?? skill.name} // fallback if _id missing
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>


{/* Share Section */}
<div className="mt-6">
  <p className="text-sm text-gray-600 mb-2">Share this job</p>
  <JobShareButtons jobId={job._id} />
</div>


        {/* Apply Button */}
        <div className="mt-4 w-full md:w-auto">
          <JobApplyButton jobId={job._id as string} />
        </div>
      </div>
    </div>
  );
}
