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
} from "@mui/material";

export default function AdminUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, selectedUser } = useSelector(
    (state: RootState) => state.adminUsers
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleView = (id: string) => {
    dispatch(fetchAdminUserProfile(id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(clearSelectedUser());
  };

  if (loading && users.length === 0) {
    return (
      <Box className="flex justify-center mt-20">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" className="mb-4 font-semibold">
        Admin – Users
      </Typography>

      <Box className="space-y-3">
        {users.map((user) => (
          <Box
            key={user._id}
            className="flex justify-between items-center border p-3 rounded-md"
          >
            <Box>
              <Typography className="font-medium">{user.name}</Typography>
              <Typography className="text-sm text-gray-500">
                {user.email}
              </Typography>
            </Box>

            <Box className="flex gap-2 items-center">
              <Chip
                label={user.role}
                color={user.role === "admin" ? "error" : "default"}
                size="small"
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleView(user._id)}
              >
                View
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* VIEW USER PROFILE */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>User Profile</DialogTitle>

        <DialogContent className="space-y-2">
          {selectedUser ? (
            <>
              <Typography>
                <b>Name:</b> {selectedUser.user.name}
              </Typography>
              <Typography>
                <b>Email:</b> {selectedUser.user.email}
              </Typography>
              <Typography>
                <b>Role:</b> {selectedUser.user.role}
              </Typography>

              <Typography className="mt-3 font-semibold">
                Profile Details
              </Typography>

              <Typography>
                <b>Bio:</b>{" "}
                {selectedUser.profile?.bio || "Not added"}
              </Typography>

              <Typography>
                <b>Skills:</b>{" "}
                {selectedUser.profile?.skills?.length > 0
                  ? selectedUser.profile.skills.join(", ")
                  : "Not added"}
              </Typography>
            </>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
