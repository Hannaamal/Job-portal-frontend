"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import JobCard from "./job/JobCard";
import JobDetails from "./job/JobDetails";
import Pagination from "@mui/material/Pagination";

import { fetchJobs, setSelectedJob } from "@/redux/jobs/jobsSlice";
import type { RootState, AppDispatch } from "@/redux/store";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";

  const { jobs, selectedJob, loading, error, page, pages } = useSelector(
    (state: RootState) => state.jobs
  );

  // 🔥 FETCH JOBS WHEN SEARCH CHANGES
  useEffect(() => {
    dispatch(
      fetchJobs({
        page: 1,
        limit: 10,
        keyword,
        location,
      })
    );
  }, [dispatch, keyword, location]);

  // 🔥 AUTO SELECT FIRST JOB
  useEffect(() => {
    if (jobs.length > 0) {
      dispatch(setSelectedJob(jobs[0]));
    }
  }, [jobs, dispatch]);

  const handlePageChange = (_: any, value: number) => {
    dispatch(
      fetchJobs({
        page: value,
        limit: 10,
        keyword,
        location,
      })
    );
  };

  if (loading) return <div className="p-6">Loading jobs...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <div className="col-span-4 space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            active={job._id === selectedJob?._id}
            onSelect={() => dispatch(setSelectedJob(job))}
          />
        ))}

        <Pagination
          count={pages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      <div className="col-span-8">
        <JobDetails job={selectedJob} />
      </div>
    </div>
  );
}
