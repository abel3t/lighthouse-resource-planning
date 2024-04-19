'use client';

import { SidebarItems } from '@/types';
import { LogOut, Menu, MoreHorizontal, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '../../ui/drawer';
import { Separator } from '../../ui/separator';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '../../ui/sheet';
import { Icons } from '../icons';
import { SidebarButtonSheet as SidebarButton } from './sidebar-button';

interface SidebarMobileProps {
  sidebarItems: SidebarItems;
  user: any;
}

export function SidebarMobile({ sidebarItems, user }: SidebarMobileProps) {
  const pathname = usePathname();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="fixed left-3 top-3">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-3 py-4">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0">
          <span className="mx-3 text-lg font-semibold text-foreground">LRP</span>
        </SheetHeader>
        <div className="h-full">
          <div className="mt-5 flex w-full flex-col gap-1">
            {sidebarItems.links.map((link, idx) => (
              <Link key={idx} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  icon={link.icon}
                  className="w-full"
                  isExpanded={true}
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
            {sidebarItems.extras}
          </div>
          <div className="absolute bottom-4 left-0 w-full px-1">
            <Separator className="absolute -top-3 left-0 w-full" />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={user?.picture} />

                        <AvatarFallback>{user?.given_name || 'A'}</AvatarFallback>
                      </Avatar>
                      <span>
                        {user?.given_name || ''} {user?.family_name}
                      </span>
                    </div>
                    <MoreHorizontal size={20} />
                  </div>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="mb-2 p-2">
                <div className="mt-2 flex flex-col space-y-2">
                  <Link href="/">
                    <SidebarButton size="sm" icon={Settings} className="w-full" isExpanded>
                      Account Settings
                    </SidebarButton>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => {
                      router.push('/api/auth/logout');
                      setIsLogoutLoading(true);
                    }}
                  >
                    {isLogoutLoading ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <div className="flex justify-start gap-2 ">
                        <div>Logout</div>
                      </div>
                    )}
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
