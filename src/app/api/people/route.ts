import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(req: Request, res: Response) {
  const data = await prisma.person.findMany();
  return NextResponse.json(data);
}
