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
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchNotifications } from "@/redux/notificationSlice";
import { fetchSavedJobs } from "@/redux/jobs/saveJobSlice";
import { fetchMyProfile } from "@/redux/profileSlice";
import { BookmarkIcon } from "lucide-react";
import { logoutUser } from "@/redux/authSlice";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname(); // ✅ get current path

  const { isAuthenticated, loading, role } = useSelector(
  (state: RootState) => state.auth);

  const isAdmin = isAuthenticated && role === "admin";

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const savedJobs = useSelector(
    (state: RootState) => state.savedJobs.savedJobs
  );
  const profile = useSelector((state: RootState) => state.profile.profile);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const savedCount = savedJobs.length;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Fetch notifications, saved jobs, and profile only when logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
      dispatch(fetchSavedJobs());
      dispatch(fetchMyProfile());
    }
  }, [dispatch, isAuthenticated]);

  // Prevent flicker
  if (loading) {
  return <div className="h-16 bg-white shadow-sm"></div>;
}

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

 const handleLogout = async () => {
  handleCloseMenu();
  await dispatch(logoutUser()).unwrap();
  router.replace("/authentication");
};



  const getLinkClass = (link: string) =>
    pathname === link
      ? "bg-blue-600 text-white px-3 py-1 rounded-md font-semibold"
      : "text-gray-700 hover:text-blue-600 px-3 py-1 rounded-md";

  const getIconButtonClass = (link: string) =>
    pathname === link
      ? "bg-blue-600 p-2 rounded-full" // background + padding
      : "bg-gray-100 hover:bg-blue-100 p-2 rounded-full"; // normal state

  const getIconColor = (link: string) =>
    pathname === link ? "text-white" : "text-gray-700 hover:text-blue-600";

  // ✅ Helper for menu items
  const getMenuItemClass = (link: string) =>
    pathname === link ? "font-semibold text-blue-600" : "";

  // Get avatar URL for profile icon
  const getAvatarUrl = () => {
    if (profile?.avatar) {
      // If avatar is a relative path, prepend the backend URL
      if (!profile.avatar.startsWith('http')) {
        return `${process.env.NEXT_PUBLIC_BACKEND_URL}${profile.avatar}`;
      }
      return profile.avatar;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          JobPortal
        </Link>
        <Link href="/" className={getLinkClass("/")}>
          Jobs
        </Link>
        <Link href="/companies" className={getLinkClass("/companies")}>
          Companies
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {!isAuthenticated ? (
          <button
            onClick={() => router.push("/authentication")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login / Register
          </button>
        ) : isAdmin ? (
          /* ADMIN VIEW */
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        ) : (
          /* USER VIEW */
          <>
            {/* Notifications */}
            <Link
              href="/notifications"
              className={`relative ${getIconButtonClass("/notifications")}`}
            >
              <NotificationsIcon className={getIconColor("/notifications")} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full min-w-[18px] h-4 flex items-center justify-center text-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Saved Jobs */}
            {/* Saved Jobs */}
            <button
              onClick={() => router.push("/saved-jobs")}
              className={`relative p-2 rounded-full transition ${
                pathname === "/saved-jobs" ? "bg-blue-600" : "hover:bg-gray-100"
              }`}
            >
              <BookmarkIcon
                className={`w-5 h-5 ${
                  pathname === "/saved-jobs"
                    ? "text-white"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <AccountCircleIcon fontSize="large" />
              )}
            </IconButton>
          </>
        )}
      </div>

      {/* PROFILE MENU */}
      {!isAdmin && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem 
            onClick={() => {
              handleCloseMenu();
              router.push("/profile");
            }}
          >
            <ListItemIcon>
              <AccountBoxIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem 
            onClick={() => {
              handleCloseMenu();
              router.push("/companies/my-subscriptions");
            }}
          >
            <ListItemIcon>
              <SubscriptionsIcon fontSize="small" />
            </ListItemIcon>
            My Subscriptions
          </MenuItem>

          <MenuItem 
            onClick={() => {
              handleCloseMenu();
              router.push("/my-application");
            }}
          >
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
      )}
    </nav>
  );
}
