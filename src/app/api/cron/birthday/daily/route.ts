import type { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  // const authHeader = request.headers.get('authorization');
  console.log('here is request for cron', request.json());

  return Response.json({ success: true });
}
