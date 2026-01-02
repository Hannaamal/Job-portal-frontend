"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminApplications,
  updateApplicationStatus,
  Application,
} from "@/redux/admin/applicationSlice";
import { RootState, AppDispatch } from "@/redux/store";
import ScheduleInterviewModal from "@/components/admin/ScheduleInterviewModal";
import InterviewActions from "@/components/admin/InterviewActionButtons";

export default function AdminApplicationsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { applications, loading } = useSelector(
    (state: RootState) => state.adminApplications
  );

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    dispatch(fetchAdminApplications());
  }, [dispatch]);

  if (loading)
    return <p className="p-6 text-gray-500">Loading applications...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Job Applications</h1>

      {applications.length === 0 && (
        <p className="text-gray-500">No applications found.</p>
      )}

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white border rounded-xl p-5 flex justify-between gap-6"
          >
            {/* LEFT SECTION */}
            <div>
              <h3 className="font-medium text-gray-900">
                {app.job?.title ?? "Untitled Job"}
              </h3>

              <p className="text-sm text-gray-500">
                {app.company?.name ?? "Unknown Company"}
              </p>

              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>👤 {app.applicant?.name ?? "Unknown Applicant"}</p>
                <p>📧 {app.applicant?.email ?? "-"}</p>
                <p>
                  📅 Applied on{" "}
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "-"}
                </p>

                {/* Show interview info if exists */}
                {app.interview && (
                  <div className="mt-2 p-2 border-l-4 border-blue-500 bg-blue-50 text-blue-700 text-sm">
                    🗓 {new Date(app.interview.date).toLocaleString()} <br />
                    {app.interview.mode === "Online"
                      ? `💻 ${app.interview.meetingLink ?? "No link"}`
                      : `📍 ${app.interview.location ?? "No location"}`}{" "}
                    <br />
                    📝 {app.interview.interviewType} Interview
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex flex-col gap-3">
              {/* Status buttons */}
              <div className="flex gap-2 flex-wrap">
                {[
                  "applied",
                  "shortlisted",
                  "interview",
                  "rejected",
                  "hired",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      dispatch(
                        updateApplicationStatus({
                          applicationId: app._id,
                          status,
                        })
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      app.status === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Schedule/Edit Interview Button */}

              {/* 🔹 INTERVIEW ACTIONS */}
              {app.status === "interview" && app.interview ? (
                <InterviewActions
                  interview={app.interview}
                  refresh={() => dispatch(fetchAdminApplications())}
                />
              ) : (
                <button
                  onClick={() => setSelectedApp(app)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Schedule Interview
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SCHEDULE INTERVIEW MODAL */}
      {selectedApp && (
        <ScheduleInterviewModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onSuccess={() => {
            dispatch(fetchAdminApplications()); // refresh data to get updated interview
            setSelectedApp(null);
          }}
        />
      )}
    </div>
  );
}
