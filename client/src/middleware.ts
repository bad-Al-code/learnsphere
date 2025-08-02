import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
const PROTECTED_ROUTES = ["/settings", "/courses"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("token")?.value;

  if (AUTH_ROUTES.includes(pathname) && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !sessionToken &&
    PROTECTED_ROUTES.some((path) => pathname.startsWith(path))
  ) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("from", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
