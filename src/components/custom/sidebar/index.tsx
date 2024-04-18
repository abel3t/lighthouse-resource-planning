'use client';

import { SidebarItems } from '@/types';
import { Bell, Bookmark, Home, List, Mail, MoreHorizontal, User, Users } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';

import { SidebarButton } from './sidebar-button';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Thống kê', href: '/', icon: Home },
    { label: 'Thành Viên', href: '/members', icon: Bell },
    { label: 'Bạn hữu / Thân hữu', href: '/friends', icon: Mail },
    {
      href: '/cares',
      icon: List,
      label: 'Chăm sóc'
    },
    {
      href: '/discipleship',
      icon: Bookmark,
      label: 'Môn đồ hóa'
    },
    {
      href: 'faith-project',
      icon: Users,
      label: 'Dự án đức tin'
    }
  ],
  extras: <div className="flex flex-col gap-2"></div>
};

export default function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
