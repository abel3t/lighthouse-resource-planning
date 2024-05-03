'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { ExternalLink, SettingsIcon, UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { Icons } from '../icons';
import Sidebar from '../sidebar';
import LanguageSwitcher from './language-switcher';
import MainNav from './main-nav';
import { ModeToggle } from './mode-toggle';

export default function Header() {
  const isMobile = useMediaQuery('(max-width: 640px)', {
    initializeWithValue: false
  });

  const { user } = useKindeBrowserClient();

  return (
    <header className="sticky top-0 z-50 flex w-full justify-end border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center px-0 md:px-5">
        <MainNav />

        {isMobile && <Sidebar />}

        <LanguageSwitcher />
        <div className="pl-3">
          <ModeToggle />
        </div>

        <div className="px-3">
          <AvatarIcon user={user} />
        </div>
      </div>
    </header>
  );
}

const AvatarIcon = ({ user }: { user: any }) => {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const t = useTranslations();
  const router = useRouter();

  const handleOnclick = () => {
    toast.info('Coming soon...');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user?.picture || ''} alt="Avatar" />
          <AvatarFallback>{user?.given_name || 'A'}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0">
        <div className="flex px-3 py-3">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user?.picture || ''} alt="Avatar" />
            <AvatarFallback>{user?.given_name || 'A'}</AvatarFallback>
          </Avatar>

          <div className="flex-1 px-3">
            <div>{user?.given_name}</div>
          </div>
        </div>

        <Separator />

        <div
          className="flex cursor-pointer py-2 hover:bg-gray-100 hover:opacity-80 dark:hover:bg-gray-700"
          onClick={handleOnclick}
        >
          <div className="px-3">
            <UserIcon />
          </div>
          <div className="px-2">{t('profile')}</div>
        </div>

        <div
          className="dark:bg-bg-transparent flex cursor-pointer  py-2 hover:bg-gray-100 hover:opacity-80  dark:hover:bg-gray-700"
          onClick={handleOnclick}
        >
          <div className="px-3">
            <SettingsIcon />
          </div>
          <div className="px-2">{t('settings')}</div>
        </div>

        <Separator />

        <div className="flex cursor-pointer items-center py-3 hover:bg-gray-100 hover:opacity-80  dark:hover:bg-gray-700">
          <div className="px-3">
            <ExternalLink />
          </div>
          <div className="px-2">
            <Button
              variant={'outline'}
              className="w-full cursor-pointer border-none bg-transparent p-0 ring-offset-transparent focus-visible:ring-0 focus-visible:ring-offset-0  dark:hover:bg-gray-700"
              onClick={() => {
                router.push('/api/auth/logout');
                setIsLogoutLoading(true);
              }}
            >
              {isLogoutLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <div className="flex justify-start gap-2 ">
                  <div>{t('logout')}</div>
                </div>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
