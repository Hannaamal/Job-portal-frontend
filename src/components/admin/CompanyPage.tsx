"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  fetchCompanies,
  deleteCompany,
  fetchSubscribers,
  updateCompany,
  clearSubscribers,
  addCompany,
} from "@/redux/admin/companySlice";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  CircularProgress,
  Drawer,
} from "@mui/material";
import { Edit, Delete, Visibility, Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function AdminCompanyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { companies, loading, error } = useSelector(
    (state: RootState) => state.adminCompany
  );

  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    logoPreview: "",
    location: "",
  });
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewCompany, setViewCompany] = useState<any>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<any>(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  // 👉 Drawer state
  const [openAddDrawer, setOpenAddDrawer] = useState(false);

  // 👉 Add company form
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    website: "",
    location: "",
    logo: null as File | null,
    logoPreview: "",
  });

  // Fetch companies on mount
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  // Add Company
  // ======================
  const handleAddCompany = () => {
    const formData = new FormData();
    formData.append("name", addForm.name);
    formData.append("email", addForm.email);
    formData.append("website", addForm.website);
    formData.append("location", addForm.location);
    if (addForm.logo) formData.append("logo", addForm.logo);

    dispatch(addCompany(formData))
  .unwrap()
  .then(() => {
    dispatch(fetchCompanies()); // <-- reload companies
    setOpenAddDrawer(false);
    setAddForm({ name: "", email: "", website: "", location: "", logo: null, logoPreview: "" });
  })
  .catch(err => console.error(err));

  };
  useEffect(() => {
    return () => {
      if (addForm.logoPreview) {
        URL.revokeObjectURL(addForm.logoPreview);
      }
    };
  }, [addForm.logoPreview]);


  //view company by id
  const handleViewCompany = (company: any) => {
    setViewCompany(company);
    setOpenViewDialog(true);
  };

  // Open edit dialog
  const handleEdit = (company: any) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      email: company.email,
      website: company.website,
      logoPreview: getCompanyLogo(company.logo),
      location: company.location,
    });
    setOpenEditDialog(true);
  };

  // Update company
  const handleUpdate = () => {
    if (!selectedCompany) return;

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("website", formData.website);
    form.append("location", formData.location);

    if (selectedCompany.newLogo) {
      form.append("logo", selectedCompany.newLogo);
    }

    dispatch(updateCompany({ id: selectedCompany._id, formData: form }))
  .unwrap()
  .then((updatedCompany) => {
    // update the local Redux state
    dispatch(fetchCompanies()); // reload or handle slice state update
    setOpenEditDialog(false);
  })
  .catch(err => console.error(err));

  };

  const getCompanyLogo = (logo?: string) => {
    if (!logo) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/logos/default-logo.png`;
    }

    // If logo already includes '/uploads/logos/', return as is
    if (logo.startsWith("/uploads/logos/") || logo.startsWith("http")) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${logo}`;
    }

    // Otherwise, assume it's a filename
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/logos/${logo}`;
  };


  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "logo",
      headerName: "Logo",
      width: 70,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <img
          src={getCompanyLogo(params.value as string)}
          alt="logo"
          style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 4 }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/logos/default-logo.png`;
          }}
        />
      ),
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "website", headerName: "Website", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const company = params.row;
        return (
          <Box display="flex" gap={0.5}>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => handleViewCompany(company)}>
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(company)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setCompanyToDelete(company);
                  setOpenDeleteDialog(true);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];


  

  return (
    <Container>
      <Typography variant="h4" my={4}>
        Company management
      </Typography>

      {/* Add Company Button */}
      <Box mb={2}>
        <Button variant="contained" onClick={() => setOpenAddDrawer(true)}>
          Add Company
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {/* DataGrid */}
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={companies.map(c => ({ ...c, id: c._id }))}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          density="standard"
          sx={{
            "& .MuiDataGrid-cell": { py: 1 },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5" },
            "& .MuiDataGrid-footerContainer": { borderTop: "none" },
          }}
        />
      </Box>
      

      {/* <Table>
        <TableHead>
          <TableRow>
            <TableCell>Logo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Website</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                <img
                  src={getCompanyLogo(company.logo)}
                  alt={company.name}
                  width={50}
                  height={50}
                  style={{ objectFit: "contain" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/logos/default_logo.jpg`;
                  }}
                />
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.website}</TableCell>
              <TableCell>
                <Tooltip title="View Company">
                  <IconButton onClick={() => handleViewCompany(company)}>
                    <Visibility />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEdit(company)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => {
                      setCompanyToDelete(company);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}

      {/* view Company */}

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>Company Details</DialogTitle>
        <DialogContent>
          {viewCompany && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <img
                src={getCompanyLogo(viewCompany.logo)}
                alt={viewCompany.name}
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
              <Typography>
                <strong>Name:</strong> {viewCompany.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {viewCompany.email}
              </Typography>
              <Typography>
                <strong>Website:</strong> {viewCompany.website}
              </Typography>
              <Typography>
                <strong>Location:</strong> {viewCompany.location}
              </Typography>
              <Typography>
                <strong>Description:</strong> {viewCompany.description || "-"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
          Edit Company
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Website"
              variant="outlined"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={formData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            {/* Logo Upload */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={2}
            >
              <Button
                component="label"
                variant="outlined"
                color="primary"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white",
                  },
                }}
              >
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      setFormData({
                          ...formData,
                          logoPreview: URL.createObjectURL(file),
                        });
                        
                        setSelectedCompany((prev: any) => ({
                            ...prev,
                            newLogo: file,
                        }));
                    }}
                    />
                    Change Logo
              </Button>

              {formData.logoPreview && (
                <Box
                  component="img"
                  src={formData.logoPreview}
                  alt="Logo Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "contain",
                    borderRadius: 2,
                    border: "1px solid #ddd",
                    mt: 1,
                    p: 0.5,
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFORMATION */}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{companyToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (companyToDelete) {
                dispatch(deleteCompany(companyToDelete._id));
              }
              setOpenDeleteDialog(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= ADD COMPANY DRAWER ================= */}
      <Drawer
        anchor="right"
        open={openAddDrawer}
        onClose={() => setOpenAddDrawer(false)}
      >
        <Box width={400} p={3}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Add Company</Typography>
            <IconButton onClick={() => setOpenAddDrawer(false)}>
              <Close />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Company Name"
            margin="normal"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={addForm.email}
            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
          />

          <TextField
            fullWidth
            label="Website"
            margin="normal"
            value={addForm.website}
            onChange={(e) =>
              setAddForm({ ...addForm, website: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Location"
            margin="normal"
            value={addForm.location}
            onChange={(e) =>
              setAddForm({ ...addForm, location: e.target.value })
            }
          />

          <Button component="label" fullWidth sx={{ mt: 2 }}>
            Upload Logo
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setAddForm({
                  ...addForm,
                  logo: file,
                  logoPreview: URL.createObjectURL(file),
                });
              }}
            />
          </Button>
          {addForm.logoPreview && (
            <Box
              mt={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <img
                src={addForm.logoPreview}
                alt="Logo Preview"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  padding: 8,
                }}
              />
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleAddCompany}
            disabled={loading}
          >
            Save Company
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
}
