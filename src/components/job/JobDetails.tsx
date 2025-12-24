"use client";

import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Button from "@mui/material/Button";

interface JobDetailsProps {
  job: any | null;
}

export default function JobDetails({ job }: JobDetailsProps) {
  // ✅ Safe guard (VERY IMPORTANT)
  if (!job) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-gray-500">
        Select a job to view details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 sticky top-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-600">
            <BusinessIcon fontSize="small" />
            <span>{job.company?.name}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <LocationOnIcon fontSize="small" />
            <span>{job.location}</span> 
          </div>
        </div>

        <BookmarkBorderIcon className="text-gray-500 cursor-pointer" />
      </div>

      {/* Meta info */}
      <div className="flex gap-6 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <WorkOutlineIcon fontSize="small" />
          <span>{job.jobType}</span>
        </div>

        <span>{job.experienceLevel}</span>
      </div>

      {/* Apply button */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          py: 1.5,
          backgroundColor: "#2563eb",
          fontSize: "16px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#1d4ed8",
          },
        }}
      >
        Apply Now
      </Button>

      {/* Job description */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">
          Job Description
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Required skills */}
      {job.requiredSkills?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">
            Required Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill: any) => (
              <span
                key={skill._id || skill}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
