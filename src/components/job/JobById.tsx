"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchJobById } from "@/redux/jobs/jobsSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Job } from "@/redux/jobs/jobsSlice";
import JobApplyButton from "./jobApplicationButton";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const dispatch = useDispatch<AppDispatch>();
  const { job, loading, error } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [dispatch, jobId]);

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

  /* =========================
     TypeScript-safe company object
  ========================== */
  const company = typeof job.company !== "string" ? job.company : null;

  /* =========================
     UI
  ========================== */
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
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

        {/* Apply Button */}
        {/* Apply Button */}
<div className="mt-4 w-full md:w-auto">
  <JobApplyButton jobId={job._id as string} />
</div>

      </div>
    </div>
  );
}
