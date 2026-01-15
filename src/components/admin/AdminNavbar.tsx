"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { logoutUser } from "@/redux/authSlice";
import { useState } from "react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, color: "from-blue-500 to-cyan-500" },
    { name: "Jobs", href: "/admin/jobs", icon: Briefcase, color: "from-green-500 to-emerald-500" },
    { name: "Companies", href: "/admin/companies", icon: Building2, color: "from-purple-500 to-pink-500" },
    { name: "Users", href: "/admin/users", icon: Users, color: "from-orange-500 to-red-500" },
    { name: "Applications", href: "/admin/applications", icon: Users, color: "from-teal-500 to-blue-500" },
    { name: "Skills", href: "/admin/skills", icon: Briefcase, color: "from-indigo-500 to-purple-500" },
    { name: "Interview-Scheduler", href: "/admin/interview-scheduler", icon: Briefcase, color: "from-amber-500 to-orange-500" },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    router.replace("/authentication");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`min-h-screen bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-25' : 'w-64'
    }`}>
      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-500">Management Dashboard</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight 
            size={20} 
            className={`text-gray-600 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`} 
          />
        </button>
      </div>

      {/* USER INFO
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@company.com'}
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* NAV LINKS */}
      <nav className="p-4 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-white shadow-md border border-gray-100 transform translate-x-1"
                  : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
              }`}
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 ${
                active ? 'ring-2 ring-white/50 scale-105' : ''
              }`}>
                <Icon size={20} className="text-white" />
              </div>
              {!isCollapsed && (
                <span className="flex-1">{item.name}</span>
              )}
              {!isCollapsed && active && (
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-gray-200 bg-gradient-to-t from-gray-50 to-transparent p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
            <LogOut size={20} className="text-white" />
          </div>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* DECORATIVE ELEMENTS */}
      {!isCollapsed && (
        <div className="absolute top-20 right-0 w-1/3 h-32 bg-gradient-to-l from-blue-100/50 to-transparent rounded-full blur-xl" />
      )}
    </aside>
  );
}
