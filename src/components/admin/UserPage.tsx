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
import { fetchSkills } from "@/redux/profileSlice";

export default function AdminUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, selectedUser, totalUsers } = useSelector(
    (state: RootState) => state.adminUsers
  );

  const skills = useSelector((state: RootState) => state.profile.skills);

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    dispatch(fetchAdminUsers({ page, limit: pageSize }));
    dispatch(fetchSkills());
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
      <div className="mb-6">
        <Typography variant="h4" className="font-semibold text-gray-800">
          Users
        </Typography>
        <Typography variant="body2" className="text-gray-600 mt-1">
          Manage and view user profiles across the platform
        </Typography>
      </div>

      {/* User list grows and pushes pagination down */}
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={3}>
          {users
            .filter((user) => user.role !== "admin")
            .map((user) => (
              <Card 
                key={user._id} 
                variant="outlined" 
                sx={{ 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'gray.200',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                    borderColor: 'blue.200'
                  }
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '24px !important'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    {/* Profile Image */}
                    <Avatar
                      src={user.profile?.avatar ? 
                        (user.profile.avatar.startsWith('http') 
                          ? user.profile.avatar 
                          : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${user.profile.avatar}`)
                        : undefined}
                      alt={user.name}
                      sx={{ 
                        width: 60, 
                        height: 60,
                        border: '2px solid',
                        borderColor: 'gray.200'
                      }}
                    >
                      {!user.profile?.avatar && user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    {/* User Info */}
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="gray.900">
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="gray.600" className="flex items-center gap-2">
                        {user.email}
                      </Typography>
                      {user.profile?.title && (
                        <Typography variant="body2" color="blue.600" className="flex items-center gap-2 mt-1">
                          <span>💼</span>
                          {user.profile.title}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Chip
                      label={user.role}
                      color={user.role === "admin" ? "error" : "primary"}
                      size="medium"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    />
                    <Button
                      size="medium"
                      variant="contained"
                      onClick={() => handleView(user._id)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2
                      }}
                    >
                      View Profile
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
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  src={selectedUser.profile?.avatar ? 
                    (selectedUser.profile.avatar.startsWith('http') 
                      ? selectedUser.profile.avatar 
                      : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}${selectedUser.profile.avatar}`)
                    : undefined}
                  alt={selectedUser.user.name}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    border: '2px solid',
                    borderColor: 'gray.200'
                  }}
                >
                  {!selectedUser.profile?.avatar && selectedUser.user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600} color="gray.900">
                    {selectedUser.user.name}
                  </Typography>
                  <Typography variant="body2" color="gray.600" className="flex items-center gap-2 mt-1">
                    <span>📧</span>
                    {selectedUser.user.email}
                  </Typography>
                  <Typography variant="body2" color="blue.600" className="flex items-center gap-2 mt-1">
                    <span>👤</span>
                    Role: {selectedUser.user.role}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" mt={2} className="font-semibold text-gray-800">
                Profile Details
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Typography variant="body2" className="text-gray-600 font-medium">
                    📱 Phone
                  </Typography>
                  <Typography variant="body1" className="text-gray-800">
                    {selectedUser.profile?.phone || "Not added"}
                  </Typography>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Typography variant="body2" className="text-gray-600 font-medium">
                    📍 Location
                  </Typography>
                  <Typography variant="body1" className="text-gray-800">
                    {selectedUser.profile?.location || "Not added"}
                  </Typography>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Typography variant="body2" className="text-gray-600 font-medium">
                    💼 Title
                  </Typography>
                  <Typography variant="body1" className="text-gray-800">
                    {selectedUser.profile?.title || "Not added"}
                  </Typography>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Typography variant="body2" className="text-gray-600 font-medium">
                    🏆 Experience Level
                  </Typography>
                  <Typography variant="body1" className="text-gray-800">
                    {selectedUser.profile?.experienceLevel || "Not added"}
                  </Typography>
                </div>
              </div>

              <div className="mt-4">
                <Typography variant="body2" className="text-gray-600 font-medium mb-2">
                  📝 Summary
                </Typography>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Typography variant="body1" className="text-gray-800">
                    {selectedUser.profile?.summary || "Not added"}
                  </Typography>
                </div>
              </div>

              <div className="mt-4">
                <Typography variant="body2" className="text-gray-600 font-medium mb-2">
                  🏷️ Skills
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedUser.profile?.skills) && selectedUser.profile.skills.length > 0 ? (
                    selectedUser.profile.skills.map((skill: any, index: number) => {
                      // Find the skill name from the skills array
                      const skillObj = skills.find(s => s._id === skill);
                      const skillName = skillObj ? skillObj.name : (typeof skill === 'string' ? skill : skill.name);
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skillName}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-500 italic">No skills added</span>
                  )}
                </div>
              </div>

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
