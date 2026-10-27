import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';
import { parseSetCookie } from 'cookie';

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

  const response = NextResponse.next();

  if (sessionResponse?.headers) {
    const headers = sessionResponse.headers as Record<string, unknown>;
    const setCookieHeader = headers['set-cookie'] || (typeof headers.get === 'function' ? headers.get('set-cookie') : undefined);

    if (setCookieHeader) {
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      
      cookiesArray.forEach((cookieStr) => {
        if (typeof cookieStr === 'string') {
          const parsed = parseSetCookie(cookieStr);
          if (parsed && parsed.name && parsed.value) {
            response.cookies.set({
              name: parsed.name,
              value: parsed.value,
              path: parsed.path || '/',
              httpOnly: parsed.httpOnly,
              secure: parsed.secure,
              maxAge: parsed.maxAge,
            });
          }
        }
      });
    }
  }

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublic && isAuthenticated && !sessionResponse) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (sessionResponse && isPrivate && isAuthenticated) {
    return NextResponse.redirect(request.url, {
      headers: response.headers,
    });
  }

  if (sessionResponse && isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url), {
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};