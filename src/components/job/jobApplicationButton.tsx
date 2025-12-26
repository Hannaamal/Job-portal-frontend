"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { checkJobApplied } from "@/redux/jobs/jobApplicationSlice";
import { RootState, AppDispatch } from "@/redux/store";

interface JobApplyButtonProps {
  jobId: string;
}

export default function JobApplyButton({ jobId }: JobApplyButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { appliedJobs, loading } = useSelector(
    (state: RootState) => state.jobApplication
  );

  // Check if this job is applied (default false until loaded)
  const applied = appliedJobs[jobId]?.applied ?? false;

  useEffect(() => {
    dispatch(checkJobApplied(jobId));
  }, [dispatch, jobId]);

  
  if (loading && appliedJobs[jobId] === undefined) return null; // or a skeleton


  const handleClick = () => {
    if (!applied && !loading) {
      router.push(`/apply/${jobId}`);
    }
  };

  return (
    <button
      disabled={applied || loading}
      onClick={handleClick}
      className={`w-full py-2 rounded-lg text-white
        ${applied || loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}
    >
      {loading ? "Checking..." : applied ? "Already Applied" : "Apply Job"}
    </button>
  );
}
