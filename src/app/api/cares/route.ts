import { PersonalType } from '@/enums';
import { SortType } from '@/types';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { searchParamsParser } from '@/lib/utils';

export async function POST(req: Request) {
  const data = await req.json();

  if (!data.curatorId || !data.personId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const [curator, person] = await Promise.all([
    prisma.account.findUnique({
      where: {
        id: data.curatorId
      },
      select: {
        name: true
      }
    }),
    prisma.person.findUnique({
      where: {
        id: data.personId
      },
      select: {
        name: true
      }
    })
  ]);

  await prisma.care.create({
    data: {
      ...data,
      curatorName: curator?.name || undefined,
      personName: person?.name || undefined,
      organizationId: 'org_599bb6459de'
    }
  });

  return NextResponse.json(data);
}

export async function GET(req: Request) {
  const { search, page, pageSize, sortField, sortOrder } = searchParamsParser(req.url);

  let orderByField: string = sortField || '';
  let orderByType: SortType = (sortOrder || 'asc') as SortType;
  if (sortField && !['personName', 'date'].includes(sortField)) {
    orderByField = 'date';
    orderByType = 'desc';
  }

  const $condition: Record<string, any> = {};

  if (search) {
    $condition.personName = {
      contains: search,
      mode: 'insensitive'
    };
  }
  console.log($condition);

  const [total, fundRecords] = await Promise.all([
    prisma.care.count({ where: $condition }),
    prisma.care.findMany({
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
