import prisma from "@/lib/prisma";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { Account } from "@prisma/client";
import {NextResponse} from "next/server";

export async function GET() {
    // check if user exists
    const {getUser, getOrganization} = getKindeServerSession();
    const user = await getUser();
    const {orgCode} = await getOrganization();

    console.log("user", user, "org", orgCode);
    if (!user || user == null || !user.id)
        throw new Error("something went wrong with authentication" + user);

    const account: Account = await prisma.account.findUnique({
        where: {
            id: user.id
        }
    });

    if (!account) {
      await prisma.account.create({
        data: {
          id: user.id,
          name: user.given_name + " " + user.family_name,
          email: user.email,
          role: "user",
        }
      })
    }

    return NextResponse.redirect("http://localhost:3000/");
}