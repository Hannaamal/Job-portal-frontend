"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AppNavbar({
  children,
}: {
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR */}
        <AdminNavbar />

        {/* RIGHT CONTENT */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    );
  }

  // NORMAL USER LAYOUT
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
