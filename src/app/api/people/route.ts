import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const data = await prisma.person.findMany({ where: { organizationId }, select: { id: true, name: true } });

  return NextResponse.json(data);
}
