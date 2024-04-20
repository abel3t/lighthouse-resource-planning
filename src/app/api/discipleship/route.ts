import { SortType } from '@/types';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { searchParamsParser } from '@/lib/utils';

export async function POST(req: Request) {
  const data = await req.json();

  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  if (!data.curatorId || !data.personId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const [curator, person] = await Promise.all([
    prisma.account.findUnique({
      where: {
        id: data.curatorId,
        organizationId
      },
      select: {
        name: true
      }
    }),
    prisma.person.findUnique({
      where: {
        id: data.personId,
        organizationId
      },
      select: {
        name: true
      }
    })
  ]);

  await prisma.discipleship.create({
    data: {
      ...data,
      curatorName: curator?.name || undefined,
      personName: person?.name || undefined,
      organizationId
    }
  });

  return NextResponse.json(data);
}

export async function GET(req: Request) {
  const { search, page, pageSize, sortField, sortOrder } = searchParamsParser(req.url);
  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  let orderByField: string = sortField || '';
  let orderByType: SortType = (sortOrder || 'asc') as SortType;
  if (sortField && !['personName', 'date'].includes(sortField)) {
    orderByField = 'date';
    orderByType = 'desc';
  }

  const $condition: Record<string, any> = { organizationId };

  if (search) {
    $condition.personName = {
      contains: search,
      mode: 'insensitive'
    };
  }

  const [total, fundRecords] = await Promise.all([
    prisma.discipleship.count({ where: $condition }),
    prisma.discipleship.findMany({
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
