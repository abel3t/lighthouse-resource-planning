import { LoginLink, LogoutLink, RegisterLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { cookies } from 'next/headers';

import Sidebar from '@/components/custom/sidebar';

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Authenticated: {!!(await isAuthenticated())}
    </main>
  );
}
