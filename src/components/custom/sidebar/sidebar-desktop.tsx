'use client';

import { SidebarItems } from '@/types';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, LogOut, MoreHorizontal, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Separator } from '../../ui/separator';
import { SidebarButton } from './sidebar-button';

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
  className?: string;
}

export function SidebarDesktop({ sidebarItems, className }: SidebarDesktopProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={false}
      animate={{
        width: isExpanded ? 230 : 100
      }}
      className={cn('z-40 h-screen max-w-xs flex-none border-r px-3 py-4', className)}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="flex items-start justify-between py-3">
            <h3 className="mx-3 text-lg font-semibold text-foreground">LRP</h3>

            <div className="relative cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
              <ChevronLeftIcon className="absolute right-0 top-0" />
              <ChevronLeftIcon className="absolute right-[-5px] top-0 opacity-60" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  icon={link.icon}
                  className="w-full"
                  isExpanded={isExpanded}
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
            {sidebarItems.extras}
          </div>
        </div>

        <div className="w-full px-3">
          <Separator className="w-full" />
          <Popover modal>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex w-full items-center justify-between">
                  <div className="flex gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src="https://github.com/abel3t.png" />
                      <AvatarFallback>Abel</AvatarFallback>
                    </Avatar>
                    {isExpanded && <span>Abel Tran</span>}
                  </div>
                  <MoreHorizontal size={20} />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mb-2 w-56 rounded-[1rem] p-3">
              <div className="space-y-1">
                <Link href="/">
                  <SidebarButton size="sm" icon={Settings} className="w-full">
                    Account Settings
                  </SidebarButton>
                </Link>
                <SidebarButton size="sm" icon={LogOut} className="w-full">
                  Log Out
                </SidebarButton>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
}
