import { type NextRequest, NextResponse } from "next/server";

/** Optimistic auth gate: redirects to /login when no session cookie. Real authorization happens in the Go API. */
export function proxy(request: NextRequest) {
  if (!request.cookies.get("ppob_token")?.value) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*", "/admin/:path*"] };
