// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// export const dynamic = "force-dynamic";

// function decodeToken(token: string) {
// try {
// const base64 = token.split(".")[1];
// const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
// const json = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
// return JSON.parse(json);
// } catch (err) {
// console.log("JWT decode failed", err);
// return null;
// }
// }

// export function middleware(req: NextRequest) {
// const path = req.nextUrl.pathname;
// const token = req.cookies.get("auth_token")?.value;

// /* =====================
// ALWAYS-ALLOWED ROUTES
// (CRITICAL FOR NO LOOPS)
// ===================== */
// const alwaysAllowed =
// // path === "/authentication" ||
// path === "/not-authorized" ||
// path === "/admin/not-authorized";

// if (alwaysAllowed) {
// return NextResponse.next();
// }

// /* =====================
// PUBLIC ROUTES
// ===================== */
// const isPublic =
// path === "/" ||
// path === "/authentication" ||
// path === "/companies" ||
// path.startsWith("/companies/");

// /* =====================
// NOT LOGGED IN
// ===================== */
// if (!token) {
// if (isPublic) return NextResponse.next();
// return NextResponse.redirect(new URL("/authentication", req.url));
// }

// /* =====================
// LOGGED IN - HANDLE AUTHENTICATION PAGE
// ===================== */
// if (token && path === "/authentication") {
// const payload = decodeToken(token);

// if (payload?.role === "admin") {
// return NextResponse.redirect(new URL("/admin/dashboard", req.url));
// }

// if (payload?.role === "user") {
// return NextResponse.redirect(new URL("/", req.url));
// }

// // If token is invalid or no role, redirect to auth
// const res = NextResponse.redirect(new URL("/authentication", req.url));
// return res;
// }

// const payload = decodeToken(token);

// if (!payload?.role) {
// const res = NextResponse.redirect(new URL("/authentication", req.url));
// return res;
// }

// /* =====================
// ADMIN
// ===================== */
// if (payload.role === "admin") {
// if (!path.startsWith("/admin")) {
// return NextResponse.redirect(
// new URL("/admin/not-authorized", req.url)
// );
// }

// return NextResponse.next();
// }

// /* =====================
// USER
// ===================== */
// if (payload.role === "user") {
// if (path.startsWith("/admin")) {
// return NextResponse.redirect(
// new URL("/not-authorized", req.url)
// );
// }

// return NextResponse.next();
// }

// return NextResponse.redirect(new URL("/authentication", req.url));
// }

// export const config = {
// matcher: [
// "/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts|assets).*)",
// ],
// };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   const token = req.cookies.get("auth_token")?.value;

//   const publicRoutes = [
//     "/",
//     "/authentication",
//     "/companies",
//   ];

//   const isPublic = publicRoutes.some(
//     (route) => path === route || path.startsWith(route + "/")
//   );

//   if (!token && !isPublic) {
//     return NextResponse.redirect(new URL("/authentication", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts|assets).*)",
//   ],
// };

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
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
    return NextResponse.redirect(new URL("/admin/not-authorized", req.url));
  }

  // User routes
  if (!url.startsWith("/admin") && role !== "user") {
    return NextResponse.redirect(new URL("/not-authorized", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|assets|images).*)"],
};
