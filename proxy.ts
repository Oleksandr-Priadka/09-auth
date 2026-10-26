import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');
  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;
  let sessionResponse = null as Awaited<ReturnType<typeof checkSession>> | null;

  if (!accessToken && refreshToken) {
    try {
      sessionResponse = await checkSession();
      if (sessionResponse && sessionResponse.status === 200) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  let response = NextResponse.next();

  if (isPrivate && !isAuthenticated) {
    response = NextResponse.redirect(new URL('/sign-in', request.url));
  } else if (isPublic && isAuthenticated) {
    response = NextResponse.redirect(new URL('/', request.url));
  }

  if (sessionResponse && sessionResponse.headers) {
    const headers = sessionResponse.headers as Record<string, unknown>;
    const setCookieHeader = headers['set-cookie'] || (typeof headers.get === 'function' ? headers.get('set-cookie') : undefined);

    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) => {
          if (typeof cookie === 'string') {
            response.headers.append('set-cookie', cookie);
          }
        });
      } else if (typeof setCookieHeader === 'string') {
        response.headers.set('set-cookie', setCookieHeader);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};