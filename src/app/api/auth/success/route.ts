import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Account, Organization } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  // check if user exists
  const { getUser, getOrganization } = getKindeServerSession();
  const [user, org] = await Promise.all([getUser(), getOrganization()]);

  if (!user) {
    return NextResponse.redirect(process.env.KINDE_SITE_URL || 'https://github.com/abel3t');
  }

  if (!user || user == null || !user.id || !org?.orgCode) {
    throw new Error('something went wrong with authentication' + user);
  }

  let [account, organization]: [Account | null, Organization | null] = await Promise.all([
    prisma.account.findUnique({
      where: {
        id: user.id
      }
    }),
    prisma.organization.findUnique({
      where: {
        id: org.orgCode
      }
    })
  ]);

  if (!account) {
    account = await prisma.account.create({
      data: {
        id: user.id,
        name: user.given_name + ' ' + user.family_name,
        email: user.email,
        role: 'user',
        organizationId: org.orgCode
      }
    });
  }

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        id: org.orgCode,
        name: org.orgCode
      }
    });
  }

  if (account.organizationId !== org.orgCode) {
    await prisma.account.update({
      where: {
        id: account.id
      },
      data: {
        organizationId: org.orgCode
      }
    });
  }

  return NextResponse.redirect(process.env.KINDE_SITE_URL || 'https://github.com/abel3t');
}
