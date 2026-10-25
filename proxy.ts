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

  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();
      if (res && res.status === 200) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  const response = NextResponse.next();

  const updatedCookies = await cookies();
  const newAccessToken = updatedCookies.get('accessToken');
  if (newAccessToken && newAccessToken.value !== accessToken?.value) {
    response.cookies.set('accessToken', newAccessToken.value);
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};