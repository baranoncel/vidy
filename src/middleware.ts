import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Soft auth: most pages are public for browsing; only account-management pages
// hard-redirect to /login. Feature pages show the UI to everyone and pop a
// login modal on action via the AuthGate provider.
const HARD_PROTECTED_PREFIXES = ["/profile", "/settings", "/analytics"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("vidy.session_token");

  if ((pathname === "/login" || pathname === "/register") && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (HARD_PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!sessionCookie) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
