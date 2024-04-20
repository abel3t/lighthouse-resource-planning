'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Icons } from '@/components/custom/icons';

export default async function Home() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen animate-pulse items-center justify-center">
        <Icons.spinner className="mr-2 h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Authenticated
      <Image
        src="https://utfs.io/f/c0688a41-cbf1-4714-90a7-d84fe7e44b22-1xalbv.HEIC"
        alt="UTFS logo"
        width={300}
        height={300}
      />
    </main>
  );
}
