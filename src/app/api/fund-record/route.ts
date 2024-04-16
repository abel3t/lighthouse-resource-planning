import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const data = await req.json();

  await prisma.fundRecord.create({
    data,
  }); 

  return NextResponse.json(data);
}