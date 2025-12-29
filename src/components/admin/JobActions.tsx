"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { deleteJob } from "@/redux/admin/jobPageSlice";
import { AppDispatch } from "@/redux/store";

export default function JobActions({ id }: { id: string }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (confirmed) {
      dispatch(deleteJob(id));
    }
  };

  return (
    <div className="flex gap-1">
      <Tooltip title="View">
        <IconButton
          size="small"
          onClick={() => router.push(`/admin/jobs/${id}`)}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => router.push(`/admin/jobs/${id}/edit`)}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={handleDelete}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
