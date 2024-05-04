'use client';

import { SidebarItems } from '@/types';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { BookUser, Church, HandPlatter, Home, Users, Wallet2 } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';

import { SidebarDesktop } from './sidebar-desktop';
import { SidebarMobile } from './sidebar-mobile';

export const sidebarItems: SidebarItems = {
  links: [
    { label: 'dashboard', href: '/dashboard', icon: Home },
    { label: 'members', href: '/members', icon: Users },
    { label: 'friends', href: '/friends', icon: BookUser },
    {
      href: '/cares',
      icon: HandPlatter,
      label: 'cares'
    },
    {
      href: '/discipleship',
      icon: Church,
      label: 'discipleship'
    },
    {
      href: '/funds',
      icon: Wallet2,
      label: 'funds'
    }
  ],
  extras: <div className="flex flex-col gap-2"></div>
};

export default function Sidebar({ className }: { className?: string }) {
  const { user } = useKindeBrowserClient();

  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} className={className} user={user} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} user={user} />;
}
