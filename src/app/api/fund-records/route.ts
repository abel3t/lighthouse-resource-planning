import { SortType } from '@/types';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { searchParamsParser } from '@/lib/utils';

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

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
        id: data.contributorId,
        organizationId
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
        id: data.fundId,
        organizationId
      },
      data: {
        amount: { increment: data.amount }
      }
    })
  ]);

  return NextResponse.json(data);
}

export async function GET(req: Request) {
  const { search, page, pageSize, sortField, sortOrder, fundId } = searchParamsParser(req.url);

  if (!fundId) {
    return NextResponse.json({ metadata: {}, data: [] });
  }

  let orderByField: string = sortField || '';
  let orderByType: SortType = (sortOrder || 'desc') as SortType;
  if (sortField && !['date', 'amount'].includes(sortField)) {
    orderByField = 'date';
    orderByType = 'desc';
  }

  const $condition: Record<string, any> = { fundId, isDeleted: false };
  if (search) {
    $condition.OR = [
      {
        contributorName: {
          contains: search,
          mode: 'insensitive'
        }
      },
      {
        description: {
          contains: search,
          mode: 'insensitive'
        }
      }
    ];
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

export async function DELETE(req: Request) {
  const searchParams = new URL(req.url)?.searchParams;
  const ids = searchParams.get('ids');
  const fundId = searchParams.get('fundId');

  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }
  if (!fundId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const fundRecordIds = ids?.split(',') || [];

  if (!fundRecordIds.length) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const fund = await prisma.fund.findUnique({
    where: {
      id: fundId
    },
    select: { id: true }
  });

  if (!fund) {
    return new Response('Fund not found', {
      status: 400
    });
  }
  const fundRecords = await prisma.fundRecord.findMany({
    where: {
      id: { in: fundRecordIds },
      fundId
    },
    select: { id: true, amount: true }
  });

  await prisma.$transaction([
    ...fundRecordIds.map((id) => prisma.fundRecord.update({ where: { id, fundId }, data: { isDeleted: true } })),
    prisma.fund.update({
      where: {
        id: fundId
      },
      data: {
        amount: { decrement: fundRecords.reduce((acc, record) => acc + record.amount, 0) }
      }
    })
  ]);

  return NextResponse.json({ ids });
}
