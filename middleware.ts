import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/payment'];
  if (publicRoutes.some(r => pathname === r || pathname.startsWith(r))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};