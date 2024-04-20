import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const data = await prisma.account.findMany({ where: { organizationId } });

  return NextResponse.json(data);
}
