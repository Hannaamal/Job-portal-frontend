"use client";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { saveJob, removeSavedJob, fetchSavedJobs } from "@/redux/jobs/saveJobSlice";
import { useEffect } from "react";
import { BookmarkIcon } from "lucide-react";


interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
 jobType?: string;          // ✅ FIX
  experienceLevel?: string;  // ✅ FIX
  salaryRange?: {
    min: number;
    max: number;
  };
  company: {
    _id: string;
    name: string;
  };
  requiredSkills?: {   // ✅ FIX
    _id: string;
    name: string;
  }[];
}


interface Props {
  job: Job;
  active: boolean;
  onSelect: () => void;
}


export default function JobCard({ job, active, onSelect }: Props) {
 const dispatch = useDispatch<AppDispatch>();
  const savedJobs = useSelector((state: RootState) => state.savedJobs.savedJobs);

  const isSaved = savedJobs.some((s) => s.job._id === job._id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering onSelect
    if (isSaved) {
      dispatch(removeSavedJob(job._id));
    } else {
      dispatch(saveJob(job._id));
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer border rounded-lg p-4 bg-white transition hover:shadow
        ${active ? "border-blue-600 bg-blue-50" : "border-gray-200"}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {job.title || "Untitled role"}
          </h3>

          <p className="text-sm text-gray-600">
            {job.company?.name || "Company not disclosed"}
          </p>

          <p className="text-sm text-gray-500">
            {job.location || "Location not specified"}
          </p>
        </div>

         {/* Bookmark */}
        <div onClick={handleToggleSave} className="cursor-pointer">
          {isSaved ? (
            <BookmarkIcon className="text-blue-600" />
          ) : (
            <BookmarkBorderIcon className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex gap-2 text-xs">
        {job.jobType && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
            {job.jobType}
          </span>
        )}

        {job.experienceLevel && (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {job.experienceLevel}
          </span>
        )}
      </div>

      {/* Salary */}
      {(job.salaryRange?.min || job.salaryRange?.max) && (
        <p className="text-sm mt-2 text-gray-700">
          ₹{job.salaryRange?.min ?? "—"} - ₹{job.salaryRange?.max ?? "—"}
        </p>
      )}
    </div>
  );
}
