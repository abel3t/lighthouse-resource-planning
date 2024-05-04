'use client';

import { SelectValue } from '@radix-ui/react-select';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLanguage = (language: string) => {
    if (locale !== language) {
      const path = pathname.replace(`/${locale}`, `/${language}`);

      router.push(path);
    }
  };

  return (
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
  );
};

export default LanguageSwitcher;
