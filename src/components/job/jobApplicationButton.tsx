import { checkJobApplied } from "@/redux/jobs/jobApplicationSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Router } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function JobApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { appliedJobs, loading } = useSelector(
    (state: RootState) => state.jobApplication
  );

  const applied = appliedJobs[jobId]?.applied;

  useEffect(() => {
    dispatch(checkJobApplied(jobId));
  }, [dispatch, jobId]);

  return (
    <button
      disabled={applied || loading}
      onClick={() => router.push(`/apply/${jobId}`)}
      className={`w-full py-2 rounded-lg text-white
        ${applied ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}
    >
      {applied ? "Already Applied" : "Apply Job"}
    </button>
  );
}
