import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const data = await req.json();
  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const fund = await prisma.fund.findFirst({
    where: {
      name: data?.name || ''
    }
  });

  if (fund) {
    return NextResponse.json({ error: 'Fund already exists' });
  }

  await prisma.fund.create({
    data: {
      ...data,
      organizationId
    }
  });

  return NextResponse.json(data);
}

export async function GET(req: Request) {
  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const data = await prisma.fund.findMany({ where: { organizationId } });
  return NextResponse.json(data);
}
