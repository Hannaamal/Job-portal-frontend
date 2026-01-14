import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeToken(token: string) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("auth_token")?.value;

  /* =====================
     ALWAYS-ALLOWED ROUTES
     (CRITICAL FOR NO LOOPS)
  ===================== */
  const alwaysAllowed =
    path === "/not-authorized" ||
    path === "/admin/not-authorized";

  if (alwaysAllowed) {
    return NextResponse.next();
  }

  /* =====================
     PUBLIC ROUTES
  ===================== */
  const isPublic =
    path === "/" ||
    path === "/authentication" ||
    path === "/companies" ||
    path.startsWith("/companies/");

  /* =====================
     NOT LOGGED IN
  ===================== */
  if (!token) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  /* =====================
     LOGGED IN - HANDLE AUTHENTICATION PAGE
  ===================== */
  if (token && path === "/authentication") {
    const payload = decodeToken(token);
    
    if (payload?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    
    if (payload?.role === "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    // If token is invalid or no role, redirect to auth
    const res = NextResponse.redirect(new URL("/authentication", req.url));
    res.cookies.delete("auth_token");
    return res;
  }

  const payload = decodeToken(token);

  if (!payload?.role) {
    const res = NextResponse.redirect(new URL("/authentication", req.url));
    res.cookies.delete("auth_token");
    return res;
  }

  /* =====================
     ADMIN
  ===================== */
  if (payload.role === "admin") {
    if (!path.startsWith("/admin")) {
      return NextResponse.redirect(
        new URL("/admin/not-authorized", req.url)
      );
    }

    return NextResponse.next();
  }

  /* =====================
     USER
  ===================== */
  if (payload.role === "user") {
    if (path.startsWith("/admin")) {
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

