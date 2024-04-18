import { PersonalType } from '@/enums';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function POST(req: Request, res: Response) {
  const data = await req.json();

  await prisma.person.create({
    data: {
      ...data,
      organizationId: 'org_599bb6459de'
    }
  });

  return NextResponse.json(data);
}

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url);
  const s = new URLSearchParams(url.searchParams);

  const members = await prisma.person.findMany({
    where: { type: { not: PersonalType.Member } },
    include: {
      curator: true
    }
  });

  return NextResponse.json(members);
}
