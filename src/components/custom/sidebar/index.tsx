'use client';

import { SidebarItems } from '@/types';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { BookUser, Church, HandPlatter, Home, User, Users, Wallet2 } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';

import { SidebarDesktop } from './sidebar-desktop';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Thống kê', href: '/', icon: Home },
    { label: 'Thành Viên', href: '/members', icon: Users },
    { label: 'Bạn hữu / Thân hữu', href: '/friends', icon: BookUser },
    {
      href: '/cares',
      icon: HandPlatter,
      label: 'Chăm sóc'
    },
    {
      href: '/discipleship',
      icon: Church,
      label: 'Môn đồ hóa'
    },
    {
      href: '/funds',
      icon: Wallet2,
      label: 'Quỹ'
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
