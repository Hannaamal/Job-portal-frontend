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
  Avatar,
  Grid,
} from "@mui/material";
import Image from "next/image";

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
                  <Box display="flex" alignItems="center" gap={2}>
                    {/* Profile Image */}
                    <Avatar
                      src={user.profile?.avatar ? 
                        (user.profile.avatar.startsWith('http') 
                          ? user.profile.avatar 
                          : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${user.profile.avatar}`)
                        : undefined}
                      alt={user.name}
                      sx={{ width: 50, height: 50 }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    {/* User Info */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
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
              {/* Profile Header with Image */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={selectedUser.profile?.avatar ? 
                    (selectedUser.profile.avatar.startsWith('http') 
                      ? selectedUser.profile.avatar 
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${selectedUser.profile.avatar}`)
                    : undefined}
                  alt={selectedUser.user.name}
                  sx={{ width: 80, height: 80 }}
                >
                  {selectedUser.user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedUser.user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.user.email}
                  </Typography>
                  <Typography variant="body2">
                    <b>Role:</b> {selectedUser.user.role}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" mt={2}>
                Profile Details
              </Typography>

              <Typography>
                <b>Phone:</b> {selectedUser.profile?.phone || "Not added"}
              </Typography>
              <Typography>
                <b>Location:</b> {selectedUser.profile?.location || "Not added"}
              </Typography>
              <Typography>
                <b>Title:</b> {selectedUser.profile?.title || "Not added"}
              </Typography>
              <Typography>
                <b>Experience Level:</b> {selectedUser.profile?.experienceLevel || "Not added"}
              </Typography>
              <Typography>
                <b>Summary:</b> {selectedUser.profile?.summary || "Not added"}
              </Typography>
              <Typography>
                <b>Skills:</b>{" "}
                {Array.isArray(selectedUser.profile?.skills) && selectedUser.profile.skills.length > 0
                  ? selectedUser.profile.skills.map((skill: any) => 
                      typeof skill === 'string' ? skill : skill.name
                    ).join(", ")
                  : "Not added"}
              </Typography>

              <Typography variant="subtitle1" mt={3}>
                Education
              </Typography>
              {Array.isArray(selectedUser.profile?.education) && selectedUser.profile.education.length > 0 ? (
                selectedUser.profile.education.map((edu: any, index: number) => (
                  <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                    • {edu.degree} at {edu.institution} ({edu.year || "Year not specified"})
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  No education added
                </Typography>
              )}

              <Typography variant="subtitle1" mt={3}>
                Experience
              </Typography>
              {Array.isArray(selectedUser.profile?.experience) && selectedUser.profile.experience.length > 0 ? (
                selectedUser.profile.experience.map((exp: any, index: number) => (
                  <Box key={index} sx={{ ml: 2, mb: 1 }}>
                    <Typography variant="body2">
                      • {exp.role} at {exp.company}
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : "Start date not specified"} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                    </Typography>
                    {exp.description && (
                      <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                        {exp.description}
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  No experience added
                </Typography>
              )}

              <Typography variant="subtitle1" mt={3}>
                Resume
              </Typography>
              {selectedUser.profile?.resume ? (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  <a href={selectedUser.profile.resume.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                    View Resume (PDF)
                  </a>
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ ml: 2 }}>
                  No resume uploaded
                </Typography>
              )}
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
