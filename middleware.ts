// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Middleware token:", token);

  const { pathname } = req.nextUrl;

  // Allow requests if:
  // 1. It's a request for the homepage
  // 2. The token exists (user is authenticated)
  // 3. The request is for the register or login page
  if (
    pathname === "/" ||
    token ||
    pathname === "/register" ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // Redirect to the homepage if the user is not authenticated
  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the following:
     * 1. The homepage ('/')
     * 2. API routes ('/api/*')
     * 3. Static files
     * 4. _next (internal Next.js files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
