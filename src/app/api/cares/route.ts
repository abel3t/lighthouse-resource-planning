import { CarePriority, CareType, PersonalType } from '@/enums';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function POST(req: Request, res: Response) {
  const data = await req.json();

  await prisma.care.create({
    data: {
      curatorId: data.curatorId,
      personId: data.personId,
      priority: data.priority || CarePriority.Normal,
      type: data.type || CareType.Message,
      date: data.date,
      organizationId: 'org_599bb6459de'
    }
  });

  return NextResponse.json(data);
}

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url);
  const s = new URLSearchParams(url.searchParams);

  const members = await prisma.person.findMany({ where: { type: PersonalType.Member } });

  return NextResponse.json({ data: members });
}
