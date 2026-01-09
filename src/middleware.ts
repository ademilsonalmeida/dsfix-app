import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname === "/admin/login") {
    // If already authenticated, redirect to admin dashboard
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Protect all /admin/* routes (except /admin/login)
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
  runtime: "nodejs",
};
