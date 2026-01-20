import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const url = req.nextUrl.pathname;

  const publicRoutes = [
    "/",
    "/authentication",
    "/companies",
    "/not-authorized",
    "/admin/not-authorized",
    "/profile",
  ];

  // Logged-in user visiting login/signup
  if (token && url.startsWith("/authentication")) {
    try {
      function decodeJWT(token: string) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          return JSON.parse(jsonPayload);
        } catch {
          return null;
        }
      }
      const payload = decodeJWT(token);

      const role = payload.role;

      if (role === "admin")
        return NextResponse.redirect(new URL("/admin", req.url));
      if (role === "user") return NextResponse.redirect(new URL("/", req.url));
    } catch {
      return NextResponse.next(); // invalid token
    }
  }

  // Allow public routes
  if (publicRoutes.includes(url) || url.startsWith("/companies/")) {
    return NextResponse.next();
  }

  // Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  let role: string;
  try {
    function decodeJWT(token: string) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch {
        return null;
      }
    }

    const payload = decodeJWT(token);
    role = payload.role;
    if (!role) throw new Error("No role");
  } catch {
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  // Admin routes
  // Only block users from admin pages
  if (url.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/not-authorized", req.url));
  }

  // User routes
  if (!url.startsWith("/admin") && role !== "user") {
    return NextResponse.redirect(new URL("/admin/not-authorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|assets|images).*)"],
};
