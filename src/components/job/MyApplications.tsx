"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyApplications,
  withdrawApplication,
} from "@/redux/jobs/myApplicationsSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function MyApplicationsPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Ensure default values exist
  const state = useSelector((state: RootState) => state.myApplications);
  const myApplications = state?.applications ?? [];
  const loading = state?.loading ?? false;
  const error = state?.error ?? null;

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const handleWithdraw = (jobId: string) => {
    if (confirm("Are you sure you want to withdraw your application?")) {
      dispatch(withdrawApplication(jobId));
    }
  };

  if (loading) return <p className="p-6">Loading applications...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (myApplications.length === 0)
    return <p className="p-6 text-center">You have not applied to any jobs yet.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myApplications.map((app: any) => {
        const job = app.job; // populated job object
        return (
          <div
            key={job._id}
            className="border rounded-xl p-4 shadow-md flex flex-col justify-between"
          >
            {/* Job Info */}
            <div>
              <h3 className="font-bold text-lg mb-1">{job.title}</h3>
              <p className="text-sm text-gray-500 mb-1">{job.company.name}</p>
              <p className="text-sm text-gray-600 mb-1">
                Applied on: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Status: {app.status || "Pending"}
              </p>
            </div>

            {/* Withdraw Button */}
            <button
              onClick={() => handleWithdraw(job._id)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Withdraw
            </button>
          </div>
        );
      })}
    </div>
  );
}
