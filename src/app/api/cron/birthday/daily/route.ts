import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  // const authHeader = request.headers.get('authorization');
  console.log('here is request for cron', request.json());

  return NextResponse.json({ success: true });
}
