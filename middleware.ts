import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  const protectedRoutes = ['/dashboard', '/leads', '/expenses', '/users', '/profile'];
  if (protectedRoutes.some(r => path.startsWith(r))) {
    if (!token) return NextResponse.redirect(new URL('/', request.url));
    try {
       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
       const { payload } = await jwtVerify(token, secret);
       const role = payload.role as string;
       if (path.startsWith('/expenses') && role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
       }
       if (path.startsWith('/users') && role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
       }
    } catch (e) { return NextResponse.redirect(new URL('/', request.url)); }
  }
  return NextResponse.next();
}
export const config = { matcher: ['/', '/dashboard/:path*', '/leads/:path*', '/expenses/:path*', '/users/:path*', '/profile/:path*'], };