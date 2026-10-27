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

  const response = NextResponse.next();

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (sessionResponse?.headers) {
    const headers = sessionResponse.headers as Record<string, unknown>;
    const setCookieHeader = headers['set-cookie'] || (typeof headers.get === 'function' ? headers.get('set-cookie') : undefined);

    if (setCookieHeader) {
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      
      cookiesArray.forEach((cookieStr) => {
        if (typeof cookieStr === 'string') {
          const [cookiePart, ...optionsParts] = cookieStr.split(';');
          const [name, value] = cookiePart.split('=');
          
          if (name && value) {
            const options: { path?: string; httpOnly?: boolean; secure?: boolean; maxAge?: number } = {};
            
            optionsParts.forEach((part) => {
              const [optKey, optVal] = part.trim().split('=');
              const lowerKey = optKey?.toLowerCase();
              if (lowerKey === 'path') options.path = optVal;
              if (lowerKey === 'httponly') options.httpOnly = true;
              if (lowerKey === 'secure') options.secure = true;
              if (lowerKey === 'maxage') options.maxAge = Number(optVal);
            });

            response.cookies.set({
              name: name.trim(),
              value: value.trim(),
              ...options,
            });
          }
        }
      });
    }
  }

  if (sessionResponse && isPrivate && isAuthenticated) {
    return NextResponse.redirect(request.url, {
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};