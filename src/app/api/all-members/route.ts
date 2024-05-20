import { PersonalType } from '@/enums';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const members = await prisma.person.findMany({
    where: { type: PersonalType.Member, organizationId },
    select: {
      id: true,
      name: true
    },
    orderBy: { firstName: 'asc' }
  });

  return NextResponse.json(members);
}
