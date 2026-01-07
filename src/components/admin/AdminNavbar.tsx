"use client";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
   LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { logoutUser } from "@/redux/authSlice";

export default function AdminNavbar() {
  const pathname = usePathname();
   const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const links = [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Companies", href: "/admin/companies", icon: Building2 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Applications", href: "/admin/applications", icon: Users },
    { name: "Skills", href: "/admin/skills", icon: Briefcase },
    
];

   const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/authentication");
  };
  

  return (
    <aside className="w-64 min-h-screen bg-white border-r">
      {/* HEADER */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">
          Admin Panel
        </h1>
      </div>

      {/* NAV LINKS */}
      <nav className="p-4 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                ${
                  active
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      {/* LOGOUT BUTTON */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
