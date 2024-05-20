import { PersonalType } from '@/enums';
import { SortType } from '@/types';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { searchParamsParser } from '@/lib/utils';

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
  if (sortField && !['name'].includes(sortField)) {
    orderByField = 'name';
    orderByType = 'asc';
  }

  if (orderByField === 'name') {
    orderByField = 'firstName';
  }

  const $condition: Record<string, any> = {
    isDeleted: false,
    type: PersonalType.Member,
    organizationId
  };

  if (search) {
    $condition.name = {
      contains: search,
      mode: 'insensitive'
    };
  }

  const [total, fundRecords] = await Promise.all([
    prisma.person.count({ where: $condition }),
    prisma.person.findMany({
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

export async function POST(req: Request) {
  const data = await req.json();
  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const curator = data.curatorId
    ? await prisma.account.findUnique({
        where: {
          id: data.curatorId
        },
        select: {
          name: true
        }
      })
    : null;

  const nameLetters = data.name?.split(' ') || [];
  await prisma.person.create({
    data: {
      ...data,
      firstName: nameLetters[nameLetters.length - 1] || undefined,
      curatorName: curator?.name || undefined,
      organizationId
    }
  });

  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  return NextResponse.json({});
}

export async function DELETE(req: Request) {
  const searchParams = new URL(req.url)?.searchParams;
  const ids = searchParams.get('ids');

  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const memberIds = ids?.split(',') || [];

  if (!memberIds.length) {
    return new Response('Invalid', {
      status: 400
    });
  }

  await prisma.$transaction(
    memberIds.map((id) => prisma.person.update({ where: { id, organizationId }, data: { isDeleted: true } }))
  );

  return NextResponse.json({ ids });
}
