import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['https://nguonsang.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default withAuth(async function middleware(request: NextRequest) {
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
    '/api/people/:path*'
  ]
};
