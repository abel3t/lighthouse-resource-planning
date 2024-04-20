import { PersonalType } from '@/enums';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET() {
  const members = await prisma.person.findMany({
    where: { type: PersonalType.Member },
    select: {
      id: true,
      name: true
    }
  });

  return NextResponse.json(members);
}
