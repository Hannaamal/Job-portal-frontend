"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedJobs, removeSavedJob } from "@/redux/jobs/saveJobSlice";
import { RootState, AppDispatch } from "@/redux/store";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function SavedJobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { savedJobs, loading, error } = useSelector(
    (state: RootState) => state.savedJobs
  );

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading saved jobs...</p>;
  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;
  if (savedJobs.length === 0)
    return <p className="p-6 text-center text-gray-500">No saved jobs yet.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedJobs.map((item) => (
        <div
          key={item.job._id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
        >
          {/* Job Info */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {item.job.title}
            </h3>
            <p className="text-gray-600 text-sm mb-0.5">
              {item.job.company || "Company not disclosed"}
            </p>
            <p className="text-gray-500 text-sm">{item.job.location || "Location N/A"}</p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => dispatch(removeSavedJob(item.job._id))}
            className="mt-4 flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition text-sm font-medium"
          >
            <DeleteOutlineIcon fontSize="small" /> Remove
          </button>
        </div>
      ))}
    </div>
  );
}
