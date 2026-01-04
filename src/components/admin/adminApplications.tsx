"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminApplications, updateApplicationStatus } from "@/redux/admin/applicationSlice";
import { RootState, AppDispatch } from "@/redux/store";

const ITEMS_PER_PAGE = 5;

export default function AdminApplicationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading } = useSelector(
    (state: RootState) => state.adminApplications
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminApplications());
  }, [dispatch]);

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApplications = applications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) {
    return <p className="p-6 text-gray-500">Loading applications...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Job Applications</h1>

      {applications.length === 0 && (
        <p className="text-gray-500">No applications found.</p>
      )}

      {/* APPLICATION LIST */}
  
<div className="flex-1 space-y-4">
  {paginatedApplications.map((app) => (
    <div
      key={app._id}
      className="relative bg-white border rounded-xl p-6 shadow hover:shadow-lg transition duration-200"
    >
      {/* STATUS BADGE */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase ${
          app.status === "applied"
            ? "bg-yellow-100 text-yellow-800"
            : app.status === "interview"
            ? "bg-blue-100 text-blue-800"
            : app.status === "shortlisted"
            ? "bg-green-100 text-green-800"
            : app.status === "rejected"
            ? "bg-red-100 text-red-800"
            : app.status === "hired"
            ? "bg-purple-100 text-purple-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {app.status}
      </span>

      <h3 className="font-semibold text-gray-900 text-lg">
        {app.job?.title ?? "Untitled Job"}
      </h3>
      <p className="text-sm text-gray-500 mb-2">
        {app.company?.name ?? "Unknown Company"}
      </p>

      <div className="text-sm text-gray-600 space-y-1">
        <p>👤 {app.applicant?.name ?? "Unknown Applicant"}</p>
        <p>📧 {app.applicant?.email ?? "-"}</p>
        <p>
          📅 Applied on{" "}
          {app.createdAt
            ? new Date(app.createdAt).toLocaleDateString()
            : "-"}
        </p>
      </div>

      {/* READ-ONLY INTERVIEW INFO */}
      {app.interview && (
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm">
          <p className="font-medium mb-1">Interview Details</p>
          <p>🗓 {new Date(app.interview.date).toLocaleString()}</p>
          <p>
            {app.interview.mode === "Online"
              ? `💻 ${app.interview.meetingLink ?? "No link"}`
              : `📍 ${app.interview.location ?? "No location"}`}
          </p>
          <p>📝 {app.interview.interviewType} Interview</p>
        </div>
      )}

      {/* ADMIN STATUS BUTTONS */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["applied", "interview", "shortlisted", "rejected", "hired"].map(
          (statusOption) => (
            <button
              key={statusOption}
              onClick={async () => {
                try {
                  await dispatch(
                    updateApplicationStatus({
                      applicationId: app._id,
                      status: statusOption,
                    })
                  );
                  dispatch(fetchAdminApplications()); // refresh
                } catch (err) {
                  console.error(err);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                app.status === statusOption
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </button>
          )
        )}
      </div>
    </div>
  ))}
</div>


      {/* FIXED BOTTOM PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 sticky bottom-0 bg-gray-50 py-4 flex justify-center border-t border-gray-200 shadow-inner z-10">
          <nav className="inline-flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-full bg-white text-gray-700 shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 shadow hover:bg-gray-100"
                } transition-all`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-full bg-white text-gray-700 shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
