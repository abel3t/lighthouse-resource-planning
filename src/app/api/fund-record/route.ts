import { SortType } from '@/types';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { searchParamsParser } from '@/lib/utils';

export async function POST(req: Request, res: Response) {
  const data = await req.json();

  if (!data?.fundId) {
    return NextResponse.json({ error: 'Invalid data' });
  }

  const fund = await prisma.fund.findUnique({
    where: {
      id: data.fundId
    }
  });

  const contributor = data.contributorId
    ? await prisma.person.findUnique({
        where: {
          id: data.contributorId
        },
        select: {
          name: true
        }
      })
    : null;

  if (!fund) {
    return NextResponse.json({ error: 'Fund not found' });
  }

  await prisma.$transaction([
    prisma.fundRecord.create({
      data: {
        ...data,
        contributorName: contributor?.name || undefined
      }
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
  const { search, page, pageSize, sortField, sortOrder } = searchParamsParser(req.url);

  let orderByField: string = sortField || '';
  let orderByType: SortType = (sortOrder || 'desc') as SortType;
  if (sortField && !['date', 'amount'].includes(sortField)) {
    orderByField = 'date';
    orderByType = 'desc';
  }

  const $condition: Record<string, any> = {};
  if (search) {
    $condition.contributorName = {
      contains: search,
      mode: 'insensitive'
    };
  }

  const [total, fundRecords] = await Promise.all([
    prisma.fundRecord.count({ where: $condition }),
    prisma.fundRecord.findMany({
      where: $condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [orderByField]: orderByType as SortType
      }
    })
  ]);

  return NextResponse.json({
    metadata: {
      totalPages: Math.ceil(total / pageSize),
      pageSize,
      page,
      total
    },
    data: fundRecords
  });
}
