import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { locales } from './constant';

const allowedOrigins = ['https://nguonsang.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const authMiddleware = withAuth(async function middleware(request: NextRequest) {
  const isAuthenticated = await getKindeServerSession()?.isAuthenticated();

  const org = await getKindeServerSession().getOrganization();

  if (!isAuthenticated) {
    return new Response("You're not authenticated", { status: 401 });
  }

  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  response.headers.set('x-organizationId', org?.orgCode || '');

  return response;
});

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: 'en',
  localeDetection: false
});

export default function middleware(req: NextRequest) {
  console.log('Request URL nè:', req.nextUrl.pathname);

  // Define a regex pattern for private URLs
  const excludePattern = '^(/(' + locales.join('|') + '))?/api/?.*?$';
  const publicPathnameRegex = RegExp(excludePattern, 'i');
  const isPublicPage = !publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    // Apply Next-Intl middleware for public pages
    return intlMiddleware(req);
  } else {
    // Apply Auth middleware for private pages
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: [
    '/api/accounts/:path*',
    '/api/all-members/:path*',
    '/api/cares/:path*',
    '/api/discipleship/:path*',
    '/api/friends/:path*',
    '/api/fund-record',
    '/api/funds/:path*',
    '/api/members/:path*',
    '/api/people/:path*',
    '/',
    '/(en|es|fr|ja|pt|th|vi|zh)/:path*',
    '/((?!_next|_vercel|api|.*\\..*).*)'
  ]
};
