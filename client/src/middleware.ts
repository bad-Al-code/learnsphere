import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// List of pages that a logged-in user should NOT be able to access
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("token")?.value;

  if (AUTH_ROUTES.includes(pathname)) {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password/:path*",
    "/verify-email",
  ],
};
