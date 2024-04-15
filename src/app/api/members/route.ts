import { PersonalType } from "@/enums";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const data = await req.json();

  await prisma.person.create({
    data: {
      name: data.name || '',
      phone: data.phone || '',
      address: data.address || '',
      description: data.description || '',
      type: PersonalType.Member,
      organizationId: 'org_599bb6459de'
    },
  }); 

  return NextResponse.json(data);
}

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url)
  const s = new URLSearchParams(url.searchParams);

  console.log('req', s.get('name'))


  const members = await prisma.person.findMany({ where: { type: PersonalType.Member } }); 

  // console.log('members', 'ok')

  return NextResponse.json({data: members});
}