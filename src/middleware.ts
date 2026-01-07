import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("auth_token")?.value;
  const url = req.nextUrl.pathname;

  // ✅ PUBLIC ROUTES
  const publicRoutes = [
    "/",
    "/companies",
    "/job",
    "/authentication",
    "/not-authorized",
    "/admin/not-authorized"
  ];

  // 🟢 HANDLE LOGGED-IN USER VISITING LOGIN / SIGNUP
  if (token && (url === "/authentication")) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      const role = payload.user_role;

      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      if (role === "user") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      // invalid token → allow login page
      return NextResponse.next();
    }
  }

  // ✅ ALLOW PUBLIC ROUTES
  if (publicRoutes.includes(url) || url.startsWith("/")) {
    return NextResponse.next();
  }

  // 🔐 NOT LOGGED IN
  if (!token) {
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  let role: string;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    role = payload.user_role;
    if (!role) throw new Error("No role");
  } catch {
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  // 🔐 ADMIN ROUTES
  if (url.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/not-authorized", req.url)
      );
    }
  }

  // 🔐 USER ROUTES
  if (!url.startsWith("/admin")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }

    if (role !== "user") {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|assets|images).*)"],
};
