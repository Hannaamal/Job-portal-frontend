"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobCard from "./job/JobCard";
import JobDetails from "./job/JobDetails";
import Pagination from "@mui/material/Pagination";

import { fetchJobs, setSelectedJob } from "@/redux/jobs/jobsSlice";
import type { RootState, AppDispatch } from "@/redux/store";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  const { jobs, selectedJob, loading, error, page, pages } = useSelector(
    (state: RootState) => state.jobs
  );

  // 1 Fetch jobs on page load
  useEffect(() => {
    dispatch(fetchJobs({ page: 1, limit: 10 }));
  }, [dispatch]);

  // 2 Auto-select first job
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      dispatch(setSelectedJob(jobs[0]));
    }
  }, [jobs, selectedJob, dispatch]);

  const handlePageChange = (_: any, value: number) => {
    dispatch(fetchJobs({ page: value, limit: 10 }));
  };

  if (loading) {
    return <div className="p-6">Loading jobs...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <>
      {/* Layout */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* LEFT: Job cards */}
        <div className="col-span-4 space-y-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              active={job._id === selectedJob?._id}
              onSelect={() => dispatch(setSelectedJob(job))}
            />
          ))}
          <div className="flex justify-center pl-6">
            <Pagination
              count={pages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>

        {/* RIGHT: Job details */}
        <div className="col-span-8">
          <JobDetails job={selectedJob} />
        </div>
      </div>
    </>
  );
}
