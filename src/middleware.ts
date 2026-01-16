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

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8")
    );
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  /* ======================
     ALWAYS ALLOWED
  ====================== */
  if (
    pathname === "/authentication" ||
    pathname === "/not-authorized" ||
    pathname === "/admin/not-authorized"
  ) {
    return NextResponse.next();
  }

  /* ======================
     PUBLIC ROUTES
  ====================== */
  const isPublic =
    pathname === "/" ||
    pathname === "/companies" ||
    pathname.startsWith("/companies/");

  if (!token) {
    return isPublic
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/authentication", req.url));
  }

  const payload = decodeJWT(token);
  if (!payload?.role) {
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  /* ======================
     AUTH PAGE REDIRECT
  ====================== */
  if (pathname === "/authentication") {
    return NextResponse.redirect(
      new URL(
        payload.role === "admin" ? "/admin/dashboard" : "/",
        req.url
      )
    );
  }

  /* ======================
     ADMIN
  ====================== */
  if (payload.role === "admin") {
    if (!pathname.startsWith("/admin")) {
      return NextResponse.redirect(
        new URL("/admin/not-authorized", req.url)
      );
    }
    return NextResponse.next();
  }

  /* ======================
     USER
  ====================== */
  if (payload.role === "user") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(
        new URL("/not-authorized", req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/authentication", req.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts|assets).*)",
  ],
};
