"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedJobs, removeSavedJob } from "@/redux/jobs/saveJobSlice";
import { RootState, AppDispatch } from "@/redux/store";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 6;

export default function SavedJobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { savedJobs, loading, error } = useSelector(
    (state: RootState) => state.savedJobs
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500">Loading saved jobs...</p>
    );

  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  if (!savedJobs || savedJobs.length === 0)
    return <p className="p-6 text-center text-gray-500">No saved jobs yet.</p>;

  const totalPages = Math.ceil(savedJobs.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = savedJobs.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-gray-50">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Saved Jobs</h1>

      {/* Jobs Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((item) => (
          <div
            key={item.job._id}
            onClick={() => router.push(`/job/${item.job._id}`)}
            className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between h-full"
          >
            {/* Job Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {item.job.title}
              </h3>

              {/* Company name */}
              <p className="text-gray-600 text-sm mb-0.5">
                {item.job.company?.name || "Company not disclosed"}
              </p>

              {/* Company location */}
              <p className="text-gray-500 text-sm mb-0.5">
                {item.job.company?.location || "Location N/A"}
              </p>

              {/* Saved date */}
              <p className="text-gray-400 text-xs">
                Saved on:{" "}
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(removeSavedJob(item.job._id));
              }}
              className="mt-4 flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-sm font-medium"
            >
              <DeleteOutlineIcon fontSize="small" />
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          {/* Previous */}
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow"
            }`}
          >
            Prev
          </button>

          {/* Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition duration-200 shadow ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-blue-500 hover:text-white shadow"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
