import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_REDIRECT_TARGETS = ["/profile", "/settings"];

const PROTECTED_PREFIXES = [
  "/profile",
  "/settings",
  "/generate",
  "/image",
  "/video",
  "/agent",
  "/ugc-video",
  "/lipsync",
  "/upscale",
  "/enhance",
  "/tts",
  "/audio",
  "/dubbing",
  "/captions",
  "/clips",
  "/stories",
  "/3d",
  "/effects",
  "/realtime",
  "/style",
  "/train",
  "/edit",
  "/analytics",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get("vidy.session_token");

  // If already signed in and visiting login/register, send home.
  if ((pathname === "/login" || pathname === "/register") && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect feature pages: redirect to /login if no session cookie.
  if (PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
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
