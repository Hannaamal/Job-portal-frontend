"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchAdminUsers,
  fetchAdminUserProfile,
  clearSelectedUser,
} from "@/redux/admin/userSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Pagination,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

export default function AdminUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, selectedUser, totalUsers } = useSelector(
    (state: RootState) => state.adminUsers
  );

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    dispatch(fetchAdminUsers({ page, limit: pageSize }));
  }, [dispatch, page]);

  const handleView = (id: string) => {
    dispatch(fetchAdminUserProfile(id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(clearSelectedUser());
  };

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  if (loading && users.length === 0) {
    return (
      <Box className="flex justify-center mt-20">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      className="p-6"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" className="mb-6 font-semibold text-gray-800">
        Users
      </Typography>

      {/* User list grows and pushes pagination down */}
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={3}>
          {users
            .filter((user) => user.role !== "admin")
            .map((user) => (
              <Card key={user._id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip
                      label={user.role}
                      color={user.role === "admin" ? "error" : "default"}
                      size="small"
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleView(user._id)}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Box>

      {/* Pagination always at the bottom */}
      {totalUsers > pageSize && (
        <Box className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(totalUsers / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* User Profile Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {selectedUser ? (
            <Stack spacing={2} mt={1}>
              <Typography>
                <b>Name:</b> {selectedUser.user.name}
              </Typography>
              <Typography>
                <b>Email:</b> {selectedUser.user.email}
              </Typography>
              <Typography>
                <b>Role:</b> {selectedUser.user.role}
              </Typography>

              <Typography variant="subtitle1" mt={2}>
                Profile Details
              </Typography>
              <Typography>
                <b>Bio:</b> {selectedUser.profile?.bio || "Not added"}
              </Typography>
              <Typography>
                <b>Skills:</b>{" "}
                {selectedUser.profile?.skills?.length
                  ? selectedUser.profile.skills.join(", ")
                  : "Not added"}
              </Typography>
            </Stack>
          ) : (
            <Box className="flex justify-center py-6">
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
