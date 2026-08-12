import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE } from "@/lib/auth";

/**
 * Protects admin pages and admin API routes.
 * - /admin/*        (except /admin/login and /admin/signup) require a valid session.
 * - /api/admin/*    (except auth endpoints) require a valid session.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const admin = token ? await verifyToken(token) : null;

  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/signup";

  // ---- Admin API protection ----
  if (pathname.startsWith("/api/admin")) {
    const isAuthApi =
      pathname === "/api/admin/login" ||
      pathname === "/api/admin/signup" ||
      pathname === "/api/admin/logout";
    if (isAuthApi) return NextResponse.next();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // ---- Admin pages protection ----
  if (pathname.startsWith("/admin")) {
    if (isAuthPage) {
      // If already logged in, redirect away from login/signup.
      if (admin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }
    if (!admin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
