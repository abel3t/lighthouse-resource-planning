'use client';

import { SelectValue } from '@radix-ui/react-select';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select';

export default function MainNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push('/');
  };

  const locale = useLocale();

  const handleChangeLanguage = (language: string) => {
    if (locale !== language) {
      const path = pathname.replace(`/${locale}`, `/${language}`);

      router.push(path);
    }
  };

  return (
    <div onClick={handleClick} aria-label={'Logo'} className="mr-6 flex cursor-pointer items-end">
      <Select defaultValue={locale} onValueChange={handleChangeLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="vi">Tiếng Việt</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
