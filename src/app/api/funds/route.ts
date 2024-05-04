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
      isDeleted: false,
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

export async function DELETE(req: Request) {
  const searchParams = new URL(req.url)?.searchParams;
  const ids = searchParams.get('ids');

  const organizationId = req.headers.get('x-organizationId');

  if (!organizationId) {
    return new Response('Invalid', {
      status: 400
    });
  }

  const fundIds = ids?.split(',') || [];

  if (!fundIds.length) {
    return new Response('Invalid', {
      status: 400
    });
  }

  await prisma.$transaction(
    fundIds.map((id) => prisma.fund.update({ where: { id, organizationId }, data: { isDeleted: true } }))
  );

  return NextResponse.json({ ids });
}
