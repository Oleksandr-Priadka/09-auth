import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // Якщо користувач не авторизований (немає accessToken) і намагається зайти на приватний маршрут -> редірект на /sign-in
  if (isPrivate && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо користувач авторизований (є accessToken) і намагається зайти на публічний маршрут (/sign-in або /sign-up) -> редірект на /profile
  if (isPublic && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};