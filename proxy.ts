import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // cookie set by backend on admin login
  const adminToken = req.cookies.get("admin_token");

  const isAdminRoute = pathname.startsWith("/admin");

  // 🔐 protect admin routes
  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard:path*"],
};
