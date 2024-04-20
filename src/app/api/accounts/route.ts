import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.account.findMany();
  return NextResponse.json({
    metadata: {},
    data
  });
}
