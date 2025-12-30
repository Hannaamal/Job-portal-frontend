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

  const { myApplications, loading, error } = useSelector(
    (state: RootState) => state.myApplications
  );

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const handleWithdraw = (jobId: string) => {
    if (confirm("Withdraw this application?")) {
      dispatch(withdrawApplication(jobId));
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading applications...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (myApplications.length === 0)
    return (
      <p className="p-10 text-center text-gray-500">
        You haven’t applied to any jobs yet.
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">My Applications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myApplications.map((app: any) => {
          const job = app.job;
          const company = app.company;

          return (
            <div
              key={app._id}
              className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Job Info */}
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {job?.title || "Untitled Job"}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {company?.name || "Company not available"}
                </p>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>📍 {job?.location || "N/A"}</p>
                  <p>
                    Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status */}
                <span className="inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  {app.status}
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => handleWithdraw(job._id)}
                className="
                  mt-5 text-sm font-medium
                  border border-gray-300 text-gray-700
                  px-4 py-2 rounded-lg
                  hover:border-red-500 hover:text-red-600
                  transition
                "
              >
                Withdraw application
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
