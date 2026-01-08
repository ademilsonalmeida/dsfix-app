import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // This will be implemented in Task 3 with proper NextAuth.js integration
  // For now, allow all requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
