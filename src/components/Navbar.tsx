"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import WorkIcon from "@mui/icons-material/Work";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchNotifications } from "@/redux/notificationSlice";
import { fetchSavedJobs } from "@/redux/jobs/saveJobSlice";
import { BookmarkIcon } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { logoutUser } from "@/redux/authSlice";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isAuthenticated, loading, logout } = useAuth();

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const savedJobs = useSelector(
    (state: RootState) => state.savedJobs.savedJobs
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const savedCount = savedJobs.length;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // ✅ Fetch data ONLY when logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
      dispatch(fetchSavedJobs());
    }
  }, [dispatch, isAuthenticated]);

  // ✅ Prevent flicker
  if (loading) return null;

  const handleLogout = async () => {
  await dispatch(logoutUser()).unwrap(); // ensures success
  router.replace("/register");           // 👈 replace, NOT push
};



  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          JobPortal
        </Link>
        <Link href="/" className="text-gray-700 hover:text-blue-600">
          Jobs
        </Link>
        <Link href="/companies" className="text-gray-700 hover:text-blue-600">
          Companies
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {!isAuthenticated ? (
          // 🔐 NOT LOGGED IN
          <button
            onClick={() => router.push("/register")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login / Register
          </button>
        ) : (
          // ✅ LOGGED IN
          <>
            {/* Notifications */}
            <Link href="/notifications" className="relative">
              <NotificationsIcon className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Saved Jobs */}
            <button
              onClick={() => router.push("/job/saved-jobs")}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <BookmarkIcon className="text-gray-700 hover:text-blue-600" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <AccountCircleIcon fontSize="large" />
            </IconButton>
          </>
        )}
      </div>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem component={Link} href="/profile">
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem component={Link} href="/companies/my-subscriptions">
          <ListItemIcon>
            <SubscriptionsIcon fontSize="small" />
          </ListItemIcon>
          My Subscriptions
        </MenuItem>

        <MenuItem component={Link} href="/job/my-application">
          <ListItemIcon>
            <WorkIcon fontSize="small" />
          </ListItemIcon>
          Applied Jobs
        </MenuItem>

        

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </nav>
  );
}
