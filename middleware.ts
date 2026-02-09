import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedRoutes = [
    "/dashboard",
    "/leads",
    "/expenses",
    "/users",
    "/profile",
  ];

  if (protectedRoutes.some((r) => path.startsWith(r))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const role = (token as { role?: string }).role;
    if (path.startsWith("/expenses") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (path.startsWith("/users") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/leads/:path*",
    "/expenses/:path*",
    "/users/:path*",
    "/profile/:path*",
  ],
};
