import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.person.findMany({ select: { id: true, name: true } });

  return NextResponse.json(data);
}
