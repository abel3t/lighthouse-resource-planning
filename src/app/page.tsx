import Sidebar from "@/components/sidebar";
import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
  LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from "next/headers";

export default async function Home() {
  const {getUser, isAuthenticated} = getKindeServerSession();
  const user = await getUser();

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        hello
      </main>
  );
}