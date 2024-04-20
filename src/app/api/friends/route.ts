import { PersonalType } from '@/enums';
import { SortType } from '@/types';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

import { searchParamsParser } from '../fund-record/route';

export async function POST(req: Request) {
  const data = await req.json();

  const friend = data.friendId
    ? await prisma.person.findUnique({
        where: {
          id: data.friendId
        },
        select: {
          id: true
        }
      })
    : null;

  await prisma.person.create({
    data: {
      ...data,
      friendId: friend?.id || undefined,
      organizationId: 'org_599bb6459de'
    }
  });

  return NextResponse.json(data);
}

export async function GET(req: Request) {
  const { search, page, pageSize, sortField, sortOrder } = searchParamsParser(req.url);

  let orderByField: string = sortField || '';
  let orderByType: SortType = (sortOrder || 'asc') as SortType;
  if (sortField && !['name'].includes(sortField)) {
    orderByField = 'name';
    orderByType = 'asc';
  }

  const $condition: Record<string, any> = {
    type: { not: PersonalType.Member }
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
