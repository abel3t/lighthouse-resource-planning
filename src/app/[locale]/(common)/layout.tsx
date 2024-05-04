import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import Footer from '@/components/custom/footer';
import Header from '@/components/custom/header';
import Sidebar from '@/components/custom/sidebar';

export default async function CommonLayout({ children }: { children: React.ReactNode }) {
  const kindle = getKindeServerSession();

  const isAuthenticated = await kindle.isAuthenticated();

  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Header />
        <div className="min-h-[700px]">{children}</div>

        <Footer />
      </div>
    </div>
  );
}
