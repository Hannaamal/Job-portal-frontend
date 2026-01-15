"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import JobCard from "./job/JobCard";
import JobDetails from "./job/JobDetails";
import Pagination from "@mui/material/Pagination";

import { fetchJobs, setSelectedJob } from "@/redux/jobs/jobsSlice";
import type { RootState, AppDispatch } from "@/redux/store";

export default function HomeContent() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";

 const { jobs, selectedJob, loading, error } = useSelector(
  (state: RootState) => state.jobs
);

  const JOBS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  const paginatedJobs = jobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );
  const hasNoResults = !loading && jobs.length === 0;

  // 🔥 FETCH JOBS WHEN SEARCH CHANGES
  useEffect(() => {
    dispatch(
      fetchJobs({
        keyword,
        location,
      })
    );
  }, [dispatch, keyword, location]);

  // AUTO SELECT FIRST JOB

 useEffect(() => {
  if (paginatedJobs.length > 0) {
    dispatch(setSelectedJob(paginatedJobs[0]));
  } else {
    dispatch(setSelectedJob(null));
  }
}, [paginatedJobs, dispatch]);


  const handlePageChange = (_: any, value: number) => {
  setCurrentPage(value);
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  useEffect(() => {
  setCurrentPage(1);
}, [keyword, location]);


  if (loading) return <div className="p-6">Loading jobs...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* LEFT COLUMN */}
      <div className="col-span-4 flex flex-col min-h-[calc(100vh-100px)]">
        {/* Job list */}
        <div className="flex-1 space-y-4">
          {hasNoResults && (
            <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
              <p className="font-medium text-lg">No jobs found</p>
              <p className="text-sm mt-1">Try changing keyword or location</p>
            </div>
          )}

          {paginatedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              active={job._id === selectedJob?._id}
              onSelect={() => dispatch(setSelectedJob(job))}
            />
          ))}
        </div>

        {/* Pagination FIXED at bottom */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              size="medium"
              variant="outlined"
            />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-8">
        <JobDetails job={selectedJob} />
      </div>
    </div>
  );
}
