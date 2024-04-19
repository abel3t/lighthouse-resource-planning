import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import Footer from '@/components/custom/footer';
import Sidebar from '@/components/custom/sidebar';

export default async function CommonLayout({ children }: { children: React.ReactNode }) {
  const kindle = getKindeServerSession();

  const isAuthenticated = await kindle.isAuthenticated();

  if (!isAuthenticated) {
    console.log('User is not login');
    redirect('/login');
  } else {
    console.log('User is login');
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="max-h-screen flex-1 overflow-y-scroll p-1 md:p-3">
        {children}

        <Footer />
      </div>
    </div>
  );
}
