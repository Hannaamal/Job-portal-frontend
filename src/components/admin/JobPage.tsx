"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchAdminJobs,
  deleteJob,
  updateJob,
} from "@/redux/admin/jobPageSlice";
import api from "@/lib/api";
import EditJobSlideOver from "@/components/admin/EditJobSlider";

export default function AdminJobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading } = useSelector((state: RootState) => state.adminJobs);
  const [viewJob, setViewJob] = useState<any>(null);
  const [editJob, setEditJob] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [deleteJobTitle, setDeleteJobTitle] = useState<string>("");
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
  dispatch(fetchAdminJobs(undefined));
}, [dispatch]);


  useEffect(() => {
    const delay = setTimeout(() => {
      const params: any = {};

      if (search.trim()) params.jobTitle = search.trim();
      if (companyFilter) params.company = companyFilter;

      dispatch(fetchAdminJobs(params));
    }, 400);

    return () => clearTimeout(delay);
  }, [dispatch, search, companyFilter]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await api.get("/api/company/view");
        setCompanies(res.data.companies ?? res.data ?? []);
      } catch (err) {
        console.error("Failed to load companies", err);
      }
    };

    loadCompanies();
  }, []);

  const handleDeleteClick = (job: any) => {
    setDeleteJobId(job._id);
    setDeleteJobTitle(job.title);
  };

  const handleDeleteConfirm = () => {
    if (deleteJobId) {
      dispatch(deleteJob(deleteJobId));
    }
    setDeleteJobId(null);
    setDeleteJobTitle("");
  };

  const handleDeleteCancel = () => {
    setDeleteJobId(null);
    setDeleteJobTitle("");
  };

  const handleEditOpen = (job: any) => {
    setEditJob(job);
  };

  const handleEditSave = async (updatedData: any) => {
  if (!editJob) return;

  await dispatch(updateJob({ id: editJob._id, data: updatedData }));
  
  // Refetch jobs to ensure latest data
  dispatch(fetchAdminJobs(undefined));

  setEditJob(null);
};


  const columns: GridColDef[] = [
    { field: "title", headerName: "Job Title", flex: 1, minWidth: 180 },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      valueGetter: (_, row) => row?.company?.name || "—",
    },
    { field: "jobType", headerName: "Type", width: 120 },
    { field: "experienceLevel", headerName: "Experience", width: 130 },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      valueGetter: (_, row) =>
        row?.isRemote ? "Remote" : row?.location || "—",
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? "Active" : "Closed"}
          color={params.value ? "success" : "default"}
        />
      ),
    },
    {
      field: "expiresAt",
      headerName: "Expiry",
      width: 130,
      valueGetter: (_, row) =>
        row?.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : "—",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-1">
          <Tooltip title="View">
            <IconButton size="small" onClick={() => setViewJob(params.row)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEditOpen(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(params.row)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold">Jobs</h1>

      <div className="bg-white rounded-lg border">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm w-60"
          />

          {/* Company Filter */}
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm w-60"
          >
            <option value="">All Companies</option>

            {(companies ?? []).map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {mounted && (
          <DataGrid
            rows={jobs}
            columns={columns}
            loading={loading}
            getRowId={(row) => row._id}
            autoHeight
            density="compact"
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            localeText={{
              noRowsLabel: "No jobs match your filters",
            }}
            sx={{
              border: "none",

              /* HEADER */
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "13px",
                fontWeight: 600,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              },

              /* HEADER CELLS */
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },

              /* ROWS */
              "& .MuiDataGrid-row": {
                transition: "background-color 0.2s ease",
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f5f9",
              },

              /* CELLS */
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f1f5f9",
                fontSize: "13.5px",
                color: "#374151",
              },

              /* FOOTER */
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e5e7eb",
                backgroundColor: "#fafafa",
              },

              /* PAGINATION */
              "& .MuiTablePagination-root": {
                fontSize: "12px",
              },

              /* ICONS */
              "& .MuiDataGrid-sortIcon": {
                opacity: 0.4,
              },

              "& .MuiDataGrid-menuIcon": {
                opacity: 0.4,
              },

              /* REMOVE BLUE FOCUS */
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },

              /* CHECKBOX (if enabled later) */
              "& .MuiCheckbox-root": {
                color: "#9ca3af",
              },
            }}
          />
        )}
      </div>

      {/* View Dialog */}
      <Dialog
        open={Boolean(viewJob)}
        onClose={() => setViewJob(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="font-semibold">{viewJob?.title}</DialogTitle>

        <DialogContent dividers>
          <Box className="space-y-3 text-sm">
            {/* Company */}
            <Box>
              <b className="text-gray-600">Company</b>
              <p>{viewJob?.company?.name || "—"}</p>
            </Box>

            {/* Type & Experience */}
            <Box display="flex" gap={4}>
              <Box>
                <b className="text-gray-600">Job Type</b>
                <p>{viewJob?.jobType || "—"}</p>
              </Box>

              <Box>
                <b className="text-gray-600">Experience</b>
                <p>{viewJob?.experienceLevel || "—"}</p>
              </Box>
            </Box>

            {/* Skills */}
            <Box>
              <b className="text-gray-600">Skills Required</b>
              <Box className="flex flex-wrap gap-1 mt-1">
                {viewJob?.requiredSkills?.length ? (
                  viewJob.requiredSkills.map((skill: any) => (
                    <Chip
                      key={skill._id}
                      label={skill.name}
                      size="small"
                      variant="outlined"
                    />
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">
                    No skills specified
                  </span>
                )}
              </Box>
            </Box>

            {/* Location */}
            <Box>
              <b className="text-gray-600">Location</b>
              <p>{viewJob?.isRemote ? "Remote" : viewJob?.location || "—"}</p>
            </Box>

            {/* Status */}
            <Box>
              <b className="text-gray-600">Status</b>
              <Chip
                size="small"
                label={viewJob?.isActive ? "Active" : "Closed"}
                color={viewJob?.isActive ? "success" : "default"}
                className="ml-2"
              />
            </Box>

            {/* Description */}
            <Box>
              <b className="text-gray-600">Description</b>
              <p className="text-gray-700 whitespace-pre-line mt-1">
                {viewJob?.description || "—"}
              </p>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(deleteJobId)}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-semibold">Delete Job</DialogTitle>

        <DialogContent dividers>
          <p className="text-sm text-gray-700">
            Are you sure you want to delete the job <b>{deleteJobTitle}</b>?
            <br />
            <span className="text-red-600 text-xs">
              This action cannot be undone.
            </span>
          </p>
        </DialogContent>

        <Box className="flex justify-end gap-2 px-4 py-3">
          <button
            onClick={handleDeleteCancel}
            className="px-4 py-1.5 rounded-md text-sm border border-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-1.5 rounded-md text-sm bg-red-600 text-white"
          >
            Delete
          </button>
        </Box>
      </Dialog>

      <EditJobSlideOver
        isOpen={Boolean(editJob)}
        onClose={() => setEditJob(null)}
        job={editJob}
        onSave={handleEditSave}
      />
    </div>
  );
}
