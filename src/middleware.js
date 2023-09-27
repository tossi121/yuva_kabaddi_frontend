import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const publicPath = path === '/login' || path === '/signup';
  const token = request.cookies.get('yuva_kabaddi_role')?.value || '';

  if (publicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!publicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (token === 'SUPER_ADMIN') {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (token === 'COACH' || token === 'PLAYER') {
    if (request.nextUrl.pathname.startsWith('/super-admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}

export const config = {
  matcher: ['/super-admin/:path*', '/dashboard/:path*', '/login', '/signup'],
};
