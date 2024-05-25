import { type NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  // const authHeader = request.headers.get('authorization');
  console.log('here is request for cron quarterly', request.json());

  return NextResponse.json({ success: true });
}
