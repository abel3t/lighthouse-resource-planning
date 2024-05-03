'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function MainNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push('/');
  };

  return <div onClick={handleClick} aria-label={'Logo'} className="mr-6 flex cursor-pointer items-end"></div>;
}
