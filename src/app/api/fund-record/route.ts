import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function POST(req: Request, res: Response) {
  const data = await req.json();

  if (!data?.fundId) {
    return NextResponse.json({ error: 'Invalid data' });
  }
  await prisma.$transaction([
    prisma.fundRecord.create({
      data
    }),
    prisma.fund.update({
      where: {
        id: data.fundId
      },
      data: {
        amount: { increment: data.amount }
      }
    })
  ]);

  return NextResponse.json(data);
}
