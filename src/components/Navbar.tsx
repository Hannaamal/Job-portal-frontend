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
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {  useDispatch } from "react-redux";
import {  AppDispatch } from "@/redux/store";
import { fetchNotifications } from "@/redux/notificationSlice";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

 const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_role");
    router.push("/register");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* Left */}
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
        {/* <Link href="/salaries" className="text-gray-700 hover:text-blue-600">
          Salaries
        </Link> */}
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">
      <Link href="/notifications" className="relative">
        <NotificationsIcon className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </Link>
    </div>

        {/* Account Icon with Dropdown */}
        <IconButton onClick={handleMenuOpen}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleMenuClose} component={Link} href="/profile">
            <ListItemIcon>
              <AccountBoxIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem
            onClick={handleMenuClose}
            component={Link}
            href="/companies/my-subscriptions"
          >
            <ListItemIcon>
              <SubscriptionsIcon fontSize="small" />
            </ListItemIcon>
            My Subscriptions
          </MenuItem>

          <MenuItem
            onClick={handleMenuClose}
            component={Link}
            href="/job/my-application"
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
      </div>
    </nav>
  );
}
