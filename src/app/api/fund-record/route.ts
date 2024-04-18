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

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url);
  const s = new URLSearchParams(url.searchParams);

  const search = s.get('search');
  const page = s.get('page');
  const pageSize = s.get('pageSize');
  type SortType = 'asc' | 'desc';

  let [sortField, sortOrder] = (s.get('sort') as string)?.split('.');
  if (sortField && !['date', 'amount'].includes(sortField)) {
    sortField = 'date';
    sortOrder = 'desc';
  }

  const $condition: Record<string, any> = {};

  console.log('searchne', search);

  if (search) {
    $condition.name = {
      contains: search,
      mode: 'insensitive'
    };
  }

  const data = await prisma.fundRecord.findMany({
    where: {
      contributor: $condition
    },
    include: {
      contributor: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      [sortField]: sortOrder as SortType
    }
  });
  return NextResponse.json(data || []);
}
